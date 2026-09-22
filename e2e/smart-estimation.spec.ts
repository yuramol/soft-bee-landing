import { expect, test } from '@playwright/test';

import { mockPresentationApis, openSmartEstimation, stubRecaptcha, submitEstimateBrief } from './helpers/presentation-mocks';

const SAMPLE_BRIEF =
  'Create a Telegram bot that sends me daily weather as TXT and PDF attachments for my saved city.';

test.describe('Smart Estimation', () => {
  test.beforeEach(async ({ page }) => {
    await stubRecaptcha(page);
  });

  test('submits brief, shows progress, and reaches success with download', async ({ page }) => {
    const api = await mockPresentationApis(page, {
      initialStatus: {
        status: 'analyzing',
        progress: 20,
        stage: 'Analyzing project requirements',
        estimate: null
      }
    });

    await openSmartEstimation(page);

    const downloadPromise = page.waitForEvent('download');
    await submitEstimateBrief(page, SAMPLE_BRIEF);

    await expect(page.getByTestId('smart-estimation-loading')).toBeVisible();
    await expect(page.getByTestId('smart-estimation-progress')).toContainText('20%');
    await expect(page.getByTestId('smart-estimation-progress')).toContainText('Analyzing project requirements');

    api.setState({
      status: 'completed',
      progress: 100,
      stage: 'Completed',
      estimate: {
        hoursMin: 24,
        hoursMax: 40,
        priceMin: 960,
        priceMax: 1600
      }
    });

    await expect(page.getByText(/Your custom estimate is done/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId('smart-estimation-download')).toBeVisible();
    await expect(page.getByText(/Estimate:/i)).toBeVisible();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/estimation\.pptx/i);
  });

  test('can hide loading modal and resume progress from background state', async ({ page }) => {
    const api = await mockPresentationApis(page, {
      initialStatus: {
        status: 'analyzing',
        progress: 20,
        stage: 'Analyzing project requirements',
        estimate: null
      }
    });

    await openSmartEstimation(page);
    await submitEstimateBrief(page, SAMPLE_BRIEF);

    await expect(page.getByTestId('smart-estimation-loading')).toBeVisible();
    await page.getByTestId('smart-estimation-dismiss').click({ force: true });

    await expect(page.getByTestId('smart-estimation-loading')).toHaveCount(0);
    await expect(page.getByTestId('smart-estimation-background')).toBeVisible();
    await expect(page.getByText(/still generating in the background/i)).toBeVisible();

    await page.getByTestId('smart-estimation-show-progress').evaluate((node) => {
      (node as HTMLButtonElement).click();
    });
    await expect(page.getByTestId('smart-estimation-loading')).toBeVisible();
    await expect(page.getByTestId('smart-estimation-progress')).toContainText('20%');

    api.setState({
      status: 'completed',
      progress: 100,
      stage: 'Completed',
      estimate: {
        hours: '30-50 hours',
        price: '$1,200 - $2,000'
      }
    });

    await expect(page.getByText(/Your custom estimate is done/i)).toBeVisible({ timeout: 20_000 });
  });

  test('resumes in-flight job after reload for non-processing statuses', async ({ page }) => {
    const api = await mockPresentationApis(page, {
      activeOnLoad: true,
      initialStatus: {
        status: 'analyzing',
        progress: 20,
        stage: 'Analyzing project requirements',
        estimate: null
      }
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('estimator_active_job_id', 'prop_e2e_weather_bot');
    });

    await openSmartEstimation(page);

    await expect(page.getByTestId('smart-estimation-loading')).toBeVisible();
    await expect(page.getByTestId('smart-estimation-progress')).toContainText('20%');

    api.setState({
      status: 'completed',
      progress: 100,
      stage: 'Completed',
      estimate: {
        hoursMin: 16,
        hoursMax: 28,
        priceMin: 640,
        priceMax: 1120
      }
    });

    await expect(page.getByText(/Your custom estimate is done/i)).toBeVisible({ timeout: 20_000 });
  });
});
