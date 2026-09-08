'use client';

import { cn } from '@/lib/utils';
import { FileBadge } from '@/components/ui/file-badge';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SmartEstimationLoadingModal } from './smart-estimation-loading-modal';
import { SmartEstimationResultCard } from './smart-estimation-result-card';
import { ChangeEvent, useRef, useState } from 'react';

import smartEstimationContent from '../content.json';

type Step = 'input' | 'loading' | 'success';

interface SmartEstimationInputProps {
  step: Step;
  text: string;
  file: File | null;
  error?: string | null;
  onTextChange: (text: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

export const SmartEstimationInput = ({
  step,
  text,
  file,
  error,
  onTextChange,
  onFileChange,
  onSubmit,
  onEdit,
  onDownload
}: SmartEstimationInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPaperclipHovered, setIsPaperclipHovered] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  const isExpanded = text.length > 0 || file !== null;
  const MIN_TEXT_LENGTH = 10;
  const isDisabled = !file && text.trim().length < MIN_TEXT_LENGTH;

  return (
    <div className='relative w-full max-w-181.25'>
      <div className='absolute inset-0 z-0 scale-110 transform rounded-full bg-[#C3FF00]/20 blur-[80px] md:blur-[120px]'></div>

      <div
        className={cn(
          'bg-gradient-border shadow-smart-input relative z-10 flex min-h-17.5 w-full flex-col justify-center rounded-[45px] border-2 border-transparent py-5.25 pr-3 pl-6 transition-all duration-500 ease-out focus-within:ring-[5px] focus-within:ring-white/50 md:min-h-23.5 md:py-0 md:pr-4 md:pl-8.5',
          step !== 'input' && 'pointer-events-none blur-[2px]',
          isExpanded ? (file ? 'md:pt-6 md:pb-3.5' : 'md:pt-8.5 md:pb-3.5') : 'md:py-4'
        )}
      >
        <div className='relative flex w-full flex-col'>
          {file && (
            <div className='mb-5.5'>
              <FileBadge name={file.name} onRemove={handleRemoveFile} />
            </div>
          )}

          <div className='relative flex w-full items-center'>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInput}
              placeholder={smartEstimationContent.placeholder}
              className={cn(
                'text-foreground placeholder:text-foreground/50 m-0 max-h-18 min-h-6 w-full resize-none overflow-y-auto bg-transparent p-0 leading-6 font-normal transition-all duration-500 ease-out outline-none placeholder:text-[16px] placeholder:font-normal md:max-h-42 md:min-h-9 md:leading-9 md:placeholder:text-[24px] md:placeholder:font-medium',
                text.length === 0 ? 'text-[16px] md:text-[24px]' : 'text-[16px] md:text-[18px]',
                isExpanded ? 'pr-0' : 'pr-27.5'
              )}
              style={{ height: 'auto' }}
              rows={1}
            />
          </div>

          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-500 ease-out',
              '-mr-1 -ml-4 md:-mr-2 md:-ml-6.5',
              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className='overflow-hidden'>
              <div
                className={cn(
                  'mt-5 mb-3.5 h-px w-full bg-black/10 transition-opacity duration-500 md:mt-7',
                  isExpanded ? 'opacity-100' : 'opacity-0'
                )}
              />
              <div className='h-10.5 w-full md:h-15.5' />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute right-3.5 flex items-center gap-1 transition-all duration-500 ease-out md:bottom-3.5',
            isExpanded ? 'bottom-3.5' : 'bottom-3'
          )}
        >
          <div
            onClick={handleFileClick}
            onMouseEnter={() => setIsPaperclipHovered(true)}
            onMouseLeave={() => setIsPaperclipHovered(false)}
            className='relative flex cursor-pointer items-center justify-center p-2'
          >
            <Icon icon='Paperclip' fill={isPaperclipHovered ? undefined : '#1B1C2380'} className='size-6 md:size-8' />
          </div>

          <Button
            variant='icon'
            onClick={onSubmit}
            disabled={isDisabled}
            className='disabled:bg-muted disabled:text-foreground size-10.5 shrink-0 transition-colors duration-500 disabled:opacity-100 md:size-15.5'
          >
            <Icon
              icon='ArrowUp'
              color={isDisabled ? 'var(--foreground)' : undefined}
              className='size-4 transition-colors duration-500 md:size-6'
            />
          </Button>
        </div>
      </div>

      {step === 'loading' && <SmartEstimationLoadingModal />}

      {step !== 'input' && (
        <div className='pointer-events-none absolute inset-0 z-30 flex items-center justify-center'>
          <div className='pointer-events-auto absolute top-6 right-6 z-60'>
            <Button
              onClick={onEdit}
              className='bg-accent hover:bg-accent/90 border-accent-dark h-10.5 gap-2.5 border px-4 py-1.5 pr-4 pl-6 text-[14px] text-white shadow'
              rightIcon={<Icon icon='PencilSimple' className='opacity-50' width={22} height={22} />}
            >
              {smartEstimationContent.editLabel}
            </Button>
          </div>

          {step === 'success' && (
            <div className='pointer-events-auto absolute inset-x-0 top-21.25 flex justify-center'>
              <SmartEstimationResultCard isSuccess onDownload={onDownload} />
            </div>
          )}
        </div>
      )}

      {error && <p className='text-destructive mt-3 text-center text-[12px] font-light md:mt-4 md:text-[14px]'>{error}</p>}

      <p className='text-foreground/50 mt-3.75 text-center text-[12px] md:mt-5 md:text-[16px]'>{smartEstimationContent.privacyNote}</p>
      <input type='file' className='hidden' ref={fileInputRef} onChange={handleFileChange} />
    </div>
  );
};
