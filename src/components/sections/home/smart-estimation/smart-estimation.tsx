'use client';

import { useEffect, useRef, useState } from 'react';

import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { createPresentationJob, downloadPresentationJob, getActivePresentationJob, getPresentationJob } from '@/lib/api/presentation';
import type { ProposalEstimate } from '@/lib/estimator/types';
import { executeEstimatorRecaptcha } from '@/lib/estimator/recaptcha-client';
import { validateEstimatorUpload } from '@/lib/estimator/validate-upload';
import { cn } from '@/lib/utils';

import { EstimationAnimatedBackground, SmartEstimationInput } from './components';
import smartEstimationContent from './content.json';

interface SmartEstimationProps {
  hideAnimatedBackground?: boolean;
  className?: string;
}

type Step = 'input' | 'loading' | 'success';

const ACTIVE_JOB_STORAGE_KEY = 'estimator_active_job_id';

export function SmartEstimation({ hideAnimatedBackground, className }: SmartEstimationProps = {}) {
  const [step, setStep] = useState<Step>('input');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<ProposalEstimate | null>(null);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [stage, setStage] = useState<string | undefined>(undefined);
  const [isBackgroundPolling, setIsBackgroundPolling] = useState(false);
  const isSubmittingRef = useRef(false);
  const isPollingRef = useRef(false);
  const isResumingRef = useRef(true);
  const resumeGenerationRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoDownloadedRef = useRef(false);
  const hasResumedRef = useRef(false);

  useEffect(() => {
    void resumeActiveJob();

    return () => {
      clearPollTimeout();
      abortInFlight();
    };
  }, []);

  async function resumeActiveJob() {
    if (hasResumedRef.current) return;
    hasResumedRef.current = true;
    const generation = resumeGenerationRef.current;

    try {
      const active = await getActivePresentationJob();
      if (!isResumeGenerationCurrent(generation) || isSubmittingRef.current) {
        return;
      }

      if (!active.active || !active.jobId) {
        clearStoredActiveJobId();
        return;
      }

      const isTerminal = active.status === 'completed' || active.status === 'failed';
      const isInFlight = Boolean(active.status) && !isTerminal;
      const storedJobId = readStoredActiveJobId();
      const shouldResumeCompleted = active.status === 'completed' && storedJobId === active.jobId;

      if (!isInFlight && !shouldResumeCompleted) {
        if (active.status === 'failed' || active.status === 'completed') {
          clearStoredActiveJobId();
        }
        return;
      }

      if (!isResumeGenerationCurrent(generation) || isSubmittingRef.current) {
        return;
      }

      setJobId(active.jobId);
      setProgress(active.progress);
      setStage(active.stage);
      writeStoredActiveJobId(active.jobId);

      if (active.status === 'completed') {
        setEstimate(active.estimate ?? null);
        setStep('success');
        setIsBackgroundPolling(false);
        clearStoredActiveJobId();
        return;
      }

      setStep('loading');
      setIsBackgroundPolling(false);
      // Release before polling so a later intentional submit is not blocked for the whole job.
      isResumingRef.current = false;
      await startPolling(active.jobId, generation);
    } catch (err) {
      console.error('Failed to resume active estimate:', err);
    } finally {
      isResumingRef.current = false;
    }
  }

  async function handleSubmit() {
    const validation = validateEstimatorUpload({ text, file });
    if (
      !validation.ok ||
      step === 'loading' ||
      isSubmittingRef.current ||
      isPollingRef.current ||
      isResumingRef.current
    ) {
      if (!validation.ok) {
        setError(validation.error);
      }
      return;
    }

    isSubmittingRef.current = true;
    // Invalidate any in-flight resume so it cannot abort/poll over this new job.
    resumeGenerationRef.current += 1;
    hasAutoDownloadedRef.current = false;
    setError(null);
    setEstimate(null);
    setProgress(undefined);
    setStage(undefined);
    setJobId(null);
    setIsBackgroundPolling(false);
    setStep('loading');
    clearPollTimeout();
    abortInFlight();

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const captchaToken = await executeEstimatorRecaptcha();
      const created = await createPresentationJob(
        {
          text,
          file,
          captchaToken,
          idempotencyKey: crypto.randomUUID()
        },
        signal
      );

      setJobId(created.jobId);
      writeStoredActiveJobId(created.jobId);
      await pollUntilSettled(created.jobId, signal);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      clearStoredActiveJobId();
      setIsBackgroundPolling(false);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setStep('input');
    } finally {
      isSubmittingRef.current = false;
    }
  }

  async function startPolling(activeJobId: string, resumeGeneration?: number) {
    if (isPollingRef.current) return;
    if (resumeGeneration !== undefined) {
      if (!isResumeGenerationCurrent(resumeGeneration) || isSubmittingRef.current) {
        return;
      }
    }

    clearPollTimeout();

    let signal: AbortSignal;

    if (resumeGeneration !== undefined) {
      // Resume must not abortInFlight — a newer submit may already own the controller.
      if (!isResumeGenerationCurrent(resumeGeneration) || isSubmittingRef.current || isPollingRef.current) {
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!isResumeGenerationCurrent(resumeGeneration) || isSubmittingRef.current) {
        controller.abort();
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        return;
      }

      signal = controller.signal;
    } else {
      abortInFlight();
      abortControllerRef.current = new AbortController();
      signal = abortControllerRef.current.signal;
    }

    try {
      await pollUntilSettled(activeJobId, signal);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      clearStoredActiveJobId();
      setIsBackgroundPolling(false);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setStep('input');
    }
  }

  function isResumeGenerationCurrent(generation: number) {
    return resumeGenerationRef.current === generation;
  }

  async function pollUntilSettled(activeJobId: string, signal: AbortSignal) {
    isPollingRef.current = true;
    let delayMs = 3000;

    try {
      while (!signal.aborted) {
        const status = await getPresentationJob(activeJobId, signal);

        setProgress(status.progress);
        setStage(status.stage);

        if (status.status === 'completed') {
          setEstimate(status.estimate ?? null);
          setIsBackgroundPolling(false);
          setStep('success');
          clearStoredActiveJobId();
          await downloadPresentation(activeJobId, { isAuto: true });
          return;
        }

        if (status.status === 'failed') {
          clearStoredActiveJobId();
          setIsBackgroundPolling(false);
          throw new Error(status.error || 'Estimate generation failed.');
        }

        await sleep(delayMs, signal);
        delayMs = Math.min(delayMs + 1000, 5000);
      }

      throw new DOMException('Aborted', 'AbortError');
    } finally {
      isPollingRef.current = false;
      if (abortControllerRef.current?.signal === signal) {
        abortControllerRef.current = null;
      }
    }
  }

  function handleDismissLoading() {
    setIsBackgroundPolling(true);
    setStep('input');
  }

  function handleShowProgress() {
    if (!jobId) return;
    setIsBackgroundPolling(false);
    setStep('loading');
  }

  function handleEdit() {
    clearPollTimeout();
    abortInFlight();
    isSubmittingRef.current = false;
    isPollingRef.current = false;
    clearStoredActiveJobId();
    setError(null);
    setProgress(undefined);
    setStage(undefined);
    setJobId(null);
    setEstimate(null);
    setIsBackgroundPolling(false);
    setStep('input');
  }

  function handleTextChange(newText: string) {
    setText(newText);
    if (error) setError(null);
  }

  function handleFileChange(newFile: File | null) {
    if (newFile) {
      const fileOnly = validateEstimatorUpload({ text: 'x'.repeat(10), file: newFile });
      if (!fileOnly.ok) {
        setError(fileOnly.error);
        return;
      }
    }

    setFile(newFile);
    if (error) setError(null);
  }

  async function downloadPresentation(activeJobId: string, options?: { isAuto?: boolean }) {
    if (options?.isAuto) {
      if (hasAutoDownloadedRef.current) return;
      hasAutoDownloadedRef.current = true;
    }

    try {
      const blob = await downloadPresentationJob(activeJobId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'estimation.pptx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      if (options?.isAuto) {
        hasAutoDownloadedRef.current = false;
      }
      setError(err instanceof Error ? err.message : 'Failed to download presentation.');
    }
  }

  function handleDownload() {
    if (!jobId) {
      setError('Nothing to download yet.');
      return;
    }

    void downloadPresentation(jobId);
  }

  function abortInFlight() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }

  function clearPollTimeout() {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }

  function sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }

      const onAbort = () => {
        clearPollTimeout();
        reject(new DOMException('Aborted', 'AbortError'));
      };

      pollTimeoutRef.current = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        pollTimeoutRef.current = null;
        resolve();
      }, ms);

      signal.addEventListener('abort', onAbort, { once: true });
    });
  }

  function onSubmit() {
    void handleSubmit();
  }

  function onDownload() {
    handleDownload();
  }

  function onDismissLoading() {
    handleDismissLoading();
  }

  function onShowProgress() {
    handleShowProgress();
  }

  function onEdit() {
    handleEdit();
  }

  return (
    <section
      data-testid='smart-estimation'
      className={cn(
        'relative flex w-full flex-col pt-53.25 pb-38.75 md:pt-80.5 md:pb-89.25 xl:h-screen xl:justify-center xl:py-16',
        className,
        step === 'loading' && 'z-50'
      )}
    >
      {!hideAnimatedBackground && (
        <EstimationAnimatedBackground className='-left-1.25 h-200 w-[calc(100%+10px)] md:-left-2.5 md:h-300 md:w-[calc(100%+20px)] xl:h-full' />
      )}

      <ComponentContainer className='relative z-10 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col xl:justify-center'>
        <div className='flex flex-col items-start justify-center px-4 md:items-center md:px-0'>
          <Badge title={smartEstimationContent.badge} className='mb-7.5 w-fit md:mb-10' />

          <Typography variant='h2' className='text-foreground mb-14.25 max-w-264.5 text-left md:mb-19.75 md:text-center'>
            {step === 'success' ? (
              <>{smartEstimationContent.title.success}</>
            ) : (
              <>
                {smartEstimationContent.title.input.map((segment, index) =>
                  segment.gradient ? (
                    <span
                      key={index}
                      className='bg-clip-text text-transparent'
                      style={{
                        backgroundImage: 'linear-gradient(94.31deg, #C3FF00 -13.39%, #00A2BB 106.35%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {segment.text}
                    </span>
                  ) : (
                    <span key={index}>{segment.text}</span>
                  )
                )}
              </>
            )}
          </Typography>

          <SmartEstimationInput
            step={step}
            text={text}
            file={file}
            error={error}
            progress={progress}
            stage={stage}
            estimate={estimate}
            isBackgroundPolling={isBackgroundPolling}
            onTextChange={handleTextChange}
            onFileChange={handleFileChange}
            onSubmit={onSubmit}
            onEdit={onEdit}
            onDismissLoading={onDismissLoading}
            onShowProgress={onShowProgress}
            onDownload={onDownload}
          />
        </div>
      </ComponentContainer>
    </section>
  );
}

function readStoredActiveJobId(): string | null {
  try {
    const value = window.localStorage.getItem(ACTIVE_JOB_STORAGE_KEY);
    return value && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeStoredActiveJobId(jobId: string) {
  try {
    window.localStorage.setItem(ACTIVE_JOB_STORAGE_KEY, jobId);
  } catch {
    // ignore quota / private mode
  }
}

function clearStoredActiveJobId() {
  try {
    window.localStorage.removeItem(ACTIVE_JOB_STORAGE_KEY);
  } catch {
    // ignore
  }
}
