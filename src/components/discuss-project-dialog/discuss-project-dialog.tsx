'use client';

import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { FileUploadBadge } from './components/file-upload-badge';
import { BaseSyntheticEvent, ChangeEvent, MouseEvent, ReactNode, useRef, useState } from 'react';

const discussProjectSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.email('Invalid email address'),
    projectDetails: z.string().optional(),
    file: z.custom<File>().optional()
  })
  .refine((data) => (data.projectDetails && data.projectDetails.trim().length > 0) || !!data.file, {
    message: 'Please provide either project details or attach a file',
    path: ['projectDetails']
  });

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
    formState: { errors },
    setValue,
    control,
    trigger: triggerValidation
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(discussProjectSchema),
    defaultValues: {
      fullName: '',
      email: '',
      projectDetails: '',
      file: undefined
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPaperclipHovered, setIsPaperclipHovered] = useState(false);

  const file = useWatch({ control, name: 'file' });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('file', e.target.files[0], { shouldValidate: true });
      void triggerValidation('projectDetails');
    }
  };

  const handleRemoveFile = (e: MouseEvent) => {
    e.stopPropagation();
    setValue('file', undefined, { shouldValidate: true });
    void triggerValidation('projectDetails');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: ProjectFormValues) => {
    console.log('Project Details Form Submitted:', data);
  };

  const handleFormSubmit = (e: BaseSyntheticEvent) => {
    void handleSubmit(onSubmit)(e);
  };

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
              <Input placeholder='Full name' {...register('fullName')} error={errors.fullName?.message} />
              <Input placeholder='Your email' type='email' {...register('email')} error={errors.email?.message} />
            </div>
            <input type='file' className='hidden' ref={fileInputRef} onChange={handleFileChange} />

            <div>
              <div className='flex w-full flex-col gap-1'>
                <div className='relative flex w-full'>
                  <textarea
                    placeholder='Project details'
                    {...register('projectDetails')}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = '52px';
                      target.style.height = `${Math.min(target.scrollHeight, 82)}px`;
                    }}
                    className={cn(
                      'focus-visible:ring-ring border-border focus:border-brand-black/50 placeholder:text-16 placeholder:text-brand-black/50 text-brand-black text-16 flex h-13 min-h-13 w-full resize-none overflow-y-auto rounded-3xl border bg-transparent p-4 leading-5.25 transition-colors focus-visible:outline-none',
                      !file && 'pr-12'
                    )}
                  />
                  {!file && (
                    <div
                      className='absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer'
                      onClick={handleFileClick}
                      onMouseEnter={() => setIsPaperclipHovered(true)}
                      onMouseLeave={() => setIsPaperclipHovered(false)}
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
                    <FileUploadBadge file={file} onRemove={handleRemoveFile} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Button type='submit' variant='primary'>
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
