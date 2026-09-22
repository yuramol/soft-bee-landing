'use client';

import { BaseSyntheticEvent, ChangeEvent, MouseEvent, ReactNode, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import { FileUploadBadge } from '@/components/discuss-project-dialog/components/file-upload-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { submitContactForm } from '@/lib/api/contact';
import { CONTACT_FILE_ACCEPT, CONTACT_RECAPTCHA_ACTIONS } from '@/lib/contact/constants';
import { executeRecaptcha } from '@/lib/estimator/recaptcha-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';

const vacancyApplicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  message: z.string().min(10, 'Please include a short note (at least 10 characters)'),
  file: z.custom<File>().optional(),
  website: z.string().optional()
});

type VacancyApplicationValues = z.infer<typeof vacancyApplicationSchema>;

interface VacancyDialogProps {
  children?: ReactNode;
  triggerButton?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  location?: string;
  type?: string;
  roleDescription?: ReactNode;
  responsibilities?: ReactNode;
}

export function VacancyDialog({
  children,
  triggerButton,
  open,
  onOpenChange,
  title = 'Client director',
  location = 'Kyiv, Ukraine',
  type = 'Full-time',
  roleDescription,
  responsibilities
}: VacancyDialogProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset
  } = useForm<VacancyApplicationValues>({
    resolver: zodResolver(vacancyApplicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
      file: undefined,
      website: ''
    }
  });

  const file = useWatch({ control, name: 'file' });

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setShowApplyForm(false);
      setSubmitError(null);
      setSubmitSuccess(false);
      reset();
    }
  }

  function handleApplyClick() {
    setShowApplyForm(true);
    setSubmitError(null);
    setSubmitSuccess(false);
  }

  function handleFileClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setValue('file', e.target.files[0], { shouldValidate: true });
    }
  }

  function handleRemoveFile(e: MouseEvent) {
    e.stopPropagation();
    setValue('file', undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function onSubmit(data: VacancyApplicationValues) {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const captchaToken = await executeRecaptcha(CONTACT_RECAPTCHA_ACTIONS.vacancy_application);
      await submitContactForm({
        kind: 'vacancy_application',
        fullName: data.fullName,
        email: data.email,
        message: data.message,
        roleTitle: title,
        file: data.file ?? null,
        captchaToken,
        website: data.website ?? ''
      });
      reset();
      setSubmitSuccess(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send application.';
      setSubmitError(message);
    }
  }

  function handleFormSubmit(e: BaseSyntheticEvent) {
    void handleSubmit(onSubmit)(e);
  }

  function handleBackToRole() {
    setShowApplyForm(false);
    setSubmitError(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {(triggerButton || children) && <DialogTrigger asChild>{triggerButton || children}</DialogTrigger>}

      <DialogContent className='flex h-[95vh] max-h-[min(884px,95vh)] w-[95vw] max-w-268 flex-col gap-0 overflow-hidden rounded-2xl border-0 px-5 pt-20 pb-5 md:h-auto md:px-10 md:pt-27.75 md:pb-10'>
        <DialogHeader className='mb-10 flex flex-col space-y-0 text-left md:mb-17'>
          <DialogTitle asChild className='text-48 mb-4 leading-[1.24] font-normal'>
            <Typography variant='h2'>{title}</Typography>
          </DialogTitle>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
            <div className='flex items-center gap-2'>
              <div className='bg-foreground-secondary/4 rounded-sm px-3.5 py-[12.5px]'>
                <Typography variant='body3' className='font-normal'>
                  {location}
                </Typography>
              </div>
              <div className='bg-foreground-secondary/4 rounded-sm px-3.5 py-[12.5px]'>
                <Typography variant='body3' className='font-normal'>
                  {type}
                </Typography>
              </div>
            </div>

            {!showApplyForm && (
              <Button type='button' variant='primary' className='w-42.75' onClick={handleApplyClick}>
                Apply now
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className='bg-foreground/50 h-px w-full shrink-0' />

        <div className='custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto pt-9 pr-2 sm:pr-4'>
          {showApplyForm ? (
            <form onSubmit={handleFormSubmit} className='flex max-w-183.75 flex-col gap-5 pb-4'>
              <Typography variant='h4' className='text-foreground text-[24px] font-medium'>
                Apply for {title}
              </Typography>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-3 md:flex-row md:gap-2'>
                  <Input placeholder='Full name' {...register('fullName')} error={errors.fullName?.message} disabled={isSubmitting} />
                  <Input
                    placeholder='Your email'
                    type='email'
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isSubmitting}
                  />
                </div>
                <input
                  type='text'
                  tabIndex={-1}
                  autoComplete='off'
                  aria-hidden='true'
                  className='pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0'
                  {...register('website')}
                />
                <div className='flex w-full flex-col gap-1'>
                  <textarea
                    placeholder='Short note / cover letter'
                    {...register('message')}
                    disabled={isSubmitting}
                    className={cn(
                      'focus-visible:ring-ring border-border focus:border-brand-black/50 placeholder:text-16 placeholder:text-brand-black/50 text-brand-black text-16 min-h-28 w-full resize-y rounded-3xl border bg-transparent p-4 leading-5.25 transition-colors focus-visible:outline-none disabled:opacity-60'
                    )}
                  />
                  {errors.message && <span className='text-destructive w-full text-left text-xs'>{errors.message.message}</span>}
                </div>
                <input type='file' className='hidden' accept={CONTACT_FILE_ACCEPT} ref={fileInputRef} onChange={handleFileChange} />
                <Button type='button' variant='white' className='w-fit' onClick={handleFileClick} disabled={isSubmitting}>
                  Attach CV (PDF, DOC, DOCX)
                </Button>
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className='overflow-hidden'
                    >
                      <FileUploadBadge file={file} onRemove={handleRemoveFile} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {submitError && <p className='text-destructive text-sm'>{submitError}</p>}
              {submitSuccess && <p className='text-sm text-emerald-700'>Thanks — your application was sent.</p>}
              <div className='flex flex-wrap gap-3'>
                <Button type='submit' variant='primary' disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send application'}
                </Button>
                <Button type='button' variant='white' disabled={isSubmitting} onClick={handleBackToRole}>
                  Back to role
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-8'>
                <Typography variant='h4' className='text-foreground max-w-42.25 text-[24px] font-medium'>
                  The role
                </Typography>
                <Typography variant='h4' className='text-foreground/50 max-w-183.75'>
                  {roleDescription}
                </Typography>
              </div>

              <div className='bg-foreground/50 my-9 h-px w-full shrink-0' />

              <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-between sm:gap-8'>
                <Typography variant='h4' className='text-foreground max-w-42.25 text-[24px] font-medium'>
                  Your responsibilities
                </Typography>
                <div className='text-foreground/50 flex max-w-183.75 flex-col gap-4 text-[24px] leading-[1.6] font-normal'>
                  {responsibilities}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
