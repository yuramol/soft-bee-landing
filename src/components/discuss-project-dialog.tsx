'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { FileBadge } from '@/components/ui/file-badge';

const discussProjectSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    projectDetails: z.string().optional(),
    file: z.custom<File>().optional()
  })
  .refine((data) => (data.projectDetails && data.projectDetails.trim().length > 0) || !!data.file, {
    message: 'Please provide either project details or attach a file',
    path: ['projectDetails']
  });

type ProjectFormValues = z.infer<typeof discussProjectSchema>;

export function DiscussProjectDialog({
  children,
  open,
  onOpenChange
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    trigger
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(discussProjectSchema),
    defaultValues: {
      fullName: '',
      email: '',
      projectDetails: '',
      file: undefined
    }
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isPaperclipHovered, setIsPaperclipHovered] = React.useState(false);

  const file = useWatch({ control, name: 'file' });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('file', e.target.files[0], { shouldValidate: true });
      void trigger('projectDetails');
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('file', undefined, { shouldValidate: true });
    void trigger('projectDetails');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: ProjectFormValues) => {
    console.log('Project Details Form Submitted:', data);
  };

  const handleFormSubmit = (e: React.BaseSyntheticEvent) => {
    void handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className='flex h-auto max-w-268 flex-col gap-5.75 overflow-hidden rounded-2xl border-0 p-4 md:flex-row md:gap-10 md:p-3 md:pr-10 lg:gap-15.25 lg:pr-19.25'>
        <div className='order-last flex h-64.25 w-full flex-col items-center justify-center rounded-xl bg-[url("/backgrounds/main-gradient.png")] bg-cover bg-center bg-no-repeat md:order-0 md:h-135 md:max-w-80 lg:max-w-91.5'>
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
            <Input
              placeholder='Project details'
              {...register('projectDetails')}
              error={errors.projectDetails?.message}
              handleIcon={handleFileClick}
              className={file ? 'pr-40' : ''}
              endIcon={
                <div className='flex items-center gap-3'>
                  {file && <FileBadge name={file.name} onRemove={handleRemoveFile} />}
                  <div
                    onMouseEnter={() => setIsPaperclipHovered(true)}
                    onMouseLeave={() => setIsPaperclipHovered(false)}
                    className='relative flex items-center justify-center after:absolute after:-inset-3 after:content-[""]'
                  >
                    <Icon icon='Paperclip' fill={isPaperclipHovered ? undefined : '#1B1C2380'} width={20} height={20} />
                  </div>
                </div>
              }
            />
          </div>
          <Button type='submit' variant='primary'>
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
