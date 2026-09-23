'use client';

import { BaseSyntheticEvent, ChangeEvent, MouseEvent, ReactNode, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import { FileUploadBadge } from '@/components/discuss-project-dialog/components/file-upload-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { submitContactForm } from '@/lib/api/contact';
import { CONTACT_FILE_ACCEPT, CONTACT_RECAPTCHA_ACTIONS } from '@/lib/contact/constants';
import { executeRecaptcha } from '@/lib/estimator/recaptcha-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const discussProjectSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.email('Invalid email address'),
    projectDetails: z.string().optional(),
    file: z.custom<File>().optional(),
    website: z.string().optional()
  })
  .refine(
    (data) => {
      const details = data.projectDetails?.trim() ?? '';
      return details.length >= 10 || !!data.file;
    },
    {
      message: 'Please provide project details (at least 10 characters) or attach a file',
      path: ['projectDetails']
    }
  );

type ProjectFormValues = z.infer<typeof discussProjectSchema>;

interface DiscussProjectDialogProps {
  children?: ReactNode;
  triggerButton?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DiscussProjectDialog({ children, triggerButton, open, onOpenChange }: DiscussProjectDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset,
    trigger: triggerValidation
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(discussProjectSchema),
    defaultValues: {
      fullName: '',
      email: '',
      projectDetails: '',
      file: undefined,
      website: ''
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPaperclipHovered, setIsPaperclipHovered] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const file = useWatch({ control, name: 'file' });

  function handleFileClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setValue('file', e.target.files[0], { shouldValidate: true });
      void triggerValidation('projectDetails');
    }
  }

  function handleRemoveFile(e: MouseEvent) {
    e.stopPropagation();
    setValue('file', undefined, { shouldValidate: true });
    void triggerValidation('projectDetails');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function onSubmit(data: ProjectFormValues) {
    setSubmitError(null);

    try {
      const captchaToken = await executeRecaptcha(CONTACT_RECAPTCHA_ACTIONS.discuss_project);
      await submitContactForm({
        kind: 'discuss_project',
        fullName: data.fullName,
        email: data.email,
        message: data.projectDetails?.trim() ?? '',
        file: data.file ?? null,
        captchaToken,
        website: data.website ?? ''
      });
      reset();
      onOpenChange?.(false);
      toast.success('Message sent', {
        description: 'Thanks — we received your message and will get back to you soon.',
        duration: 5000
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message.';
      setSubmitError(message);
    }
  }

  function handleFormSubmit(e: BaseSyntheticEvent) {
    void handleSubmit(onSubmit)(e);
  }

  function handleProjectDetailsInput(e: BaseSyntheticEvent) {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = '52px';
    target.style.height = `${Math.min(target.scrollHeight, 82)}px`;
  }

  function handlePaperclipMouseEnter() {
    setIsPaperclipHovered(true);
  }

  function handlePaperclipMouseLeave() {
    setIsPaperclipHovered(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {(triggerButton || children) && <DialogTrigger asChild>{triggerButton || children}</DialogTrigger>}
      <DialogContent className='flex h-auto max-w-268 flex-col gap-5.75 overflow-hidden rounded-2xl border-0 p-4 md:flex-row md:gap-10 md:p-3 md:pr-10 lg:gap-15.25 lg:pr-19.25'>
        <div
          className='order-last flex h-64.25 w-full flex-col items-center justify-center rounded-xl bg-cover bg-center bg-no-repeat md:order-0 md:h-135 md:max-w-80 lg:max-w-91.5'
          style={{ backgroundImage: 'url("/backgrounds/main-gradient.webp")' }}
        >
          <Icon icon='LogoWhite' width={205} height={47} />
        </div>
        <form onSubmit={handleFormSubmit} className='flex flex-1 flex-col justify-center gap-5 md:gap-10'>
          <DialogHeader className='mt-20 md:mt-0'>
            <DialogTitle className='text-brand-black text-28 font-semibold md:font-medium'>
              Let&apos;s build your next
              <br />
              digital product
            </DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-3.25'>
            <div className='flex flex-col gap-3.25 md:flex-row md:gap-2'>
              <Input placeholder='Full name' {...register('fullName')} error={errors.fullName?.message} disabled={isSubmitting} />
              <Input placeholder='Your email' type='email' {...register('email')} error={errors.email?.message} disabled={isSubmitting} />
            </div>
            {/* Honeypot — leave empty; hidden from users */}
            <input
              type='text'
              tabIndex={-1}
              autoComplete='off'
              aria-hidden='true'
              className='pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0'
              {...register('website')}
            />
            <input type='file' className='hidden' accept={CONTACT_FILE_ACCEPT} ref={fileInputRef} onChange={handleFileChange} />

            <div>
              <div className='flex w-full flex-col gap-1'>
                <div className='relative flex w-full'>
                  <textarea
                    placeholder='Project details'
                    {...register('projectDetails')}
                    onInput={handleProjectDetailsInput}
                    disabled={isSubmitting}
                    className={cn(
                      'focus-visible:ring-ring border-border focus:border-brand-black/50 placeholder:text-16 placeholder:text-brand-black/50 text-brand-black text-16 flex h-13 min-h-13 w-full resize-none overflow-y-auto rounded-3xl border bg-transparent p-4 leading-5.25 transition-colors focus-visible:outline-none disabled:opacity-60',
                      !file && 'pr-12'
                    )}
                  />
                  {!file && (
                    <div
                      className={cn(
                        'absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer',
                        isSubmitting && 'pointer-events-none opacity-60'
                      )}
                      onClick={handleFileClick}
                      onMouseEnter={handlePaperclipMouseEnter}
                      onMouseLeave={handlePaperclipMouseLeave}
                    >
                      <Icon icon='Paperclip' fill={isPaperclipHovered ? undefined : '#1B1C2380'} width={20} height={20} />
                    </div>
                  )}
                </div>
                {errors.projectDetails && (
                  <span className='text-destructive w-full text-left text-xs'>{errors.projectDetails.message}</span>
                )}
              </div>

              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className='overflow-hidden'
                  >
                    <FileUploadBadge file={file} onRemove={handleRemoveFile} disabled={isSubmitting} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {submitError && (
            <p role='alert' className='text-destructive text-sm'>
              {submitError} Please try again.
            </p>
          )}
          <Button type='submit' variant='primary' disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : submitError ? 'Try again' : 'Send'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
