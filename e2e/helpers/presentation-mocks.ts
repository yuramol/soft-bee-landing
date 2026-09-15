import { expect, type Page, type Route } from '@playwright/test';

export const MOCK_JOB_ID = 'prop_e2e_weather_bot';

export interface MockJobState {
  status: string;
  progress: number;
  stage: string;
  estimate?: {
    hours?: string;
    price?: string;
    hoursMin?: number;
    hoursMax?: number;
    priceMin?: number;
    priceMax?: number;
  } | null;
  error?: string | null;
}

export interface PresentationMockController {
  setState: (next: MockJobState) => void;
  getState: () => MockJobState;
}

export async function stubRecaptcha(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'grecaptcha', {
      configurable: true,
      writable: true,
      value: {
        ready(callback: () => void) {
          callback();
        },
        execute: async () => 'playwright-recaptcha-token'
      }
    });
  });
}

export async function mockPresentationApis(
  page: Page,
  options?: {
    initialStatus?: MockJobState;
    activeOnLoad?: boolean;
  }
): Promise<PresentationMockController> {
  let current: MockJobState =
    options?.initialStatus ??
    ({
      status: 'queued',
      progress: 0,
      stage: 'Queued',
      estimate: null,
      error: null
    } satisfies MockJobState);

  const activeOnLoad = options?.activeOnLoad === true;

  async function fulfillJson(route: Route, body: Record<string, unknown>, status = 200) {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  }

  await page.route('**/api/presentation/active', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    if (!activeOnLoad) {
      await fulfillJson(route, { active: false });
      return;
    }

    await fulfillJson(route, {
      active: true,
      jobId: MOCK_JOB_ID,
      status: current.status,
      progress: current.progress,
      stage: current.stage,
      estimate: current.estimate,
      error: current.error
    });
  });

  await page.route('**/api/presentation/generate', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    await fulfillJson(route, {
      jobId: MOCK_JOB_ID,
      status: 'queued'
    });
  });

  await page.route(`**/api/presentation/${MOCK_JOB_ID}/download`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      headers: {
        'content-disposition': 'attachment; filename="estimation.pptx"'
      },
      body: Buffer.from('PK-mock-pptx')
    });
  });

  await page.route(`**/api/presentation/${MOCK_JOB_ID}`, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    await fulfillJson(route, {
      jobId: MOCK_JOB_ID,
      status: current.status,
      progress: current.progress,
      stage: current.stage,
      estimate: current.estimate,
      error: current.error
    });
  });

  return {
    setState(next) {
      current = next;
    },
    getState() {
      return current;
    }
  };
}

export async function openSmartEstimation(page: Page) {
  await page.goto('/case-studies');
  const section = page.getByTestId('smart-estimation');
  await section.waitFor({ state: 'visible' });
  await section.evaluate((node) => {
    node.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await page.getByTestId('smart-estimation-textarea').waitFor({ state: 'visible' });
}

export async function submitEstimateBrief(page: Page, brief: string) {
  const textarea = page.getByTestId('smart-estimation-textarea');
  const submit = page.getByTestId('smart-estimation-submit');

  await textarea.fill(brief);
  await expect(submit).toBeEnabled();

  const generateResponse = page.waitForResponse(
    (response) => response.url().includes('/api/presentation/generate') && response.request().method() === 'POST'
  );

  await submit.evaluate((node) => {
    (node as HTMLButtonElement).click();
  });

  const response = await generateResponse;
  expect(response.ok()).toBeTruthy();
}
