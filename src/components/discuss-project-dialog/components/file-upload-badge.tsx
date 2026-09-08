import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { Loader } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';

interface FileUploadBadgeProps {
  file: File;
  onRemove: (e: MouseEvent) => void;
}

export function FileUploadBadge({ file, onRemove }: FileUploadBadgeProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const extMatch = file.name.match(/\.([^.]+)$/);
  const fileExt = extMatch ? extMatch[1] : 'file';

  const formattedTotalSize = formatSize(file.size);
  const formattedCurrentSize = formatSize((file.size * progress) / 100);

  return (
    <div className='border-muted relative flex w-full flex-col gap-2 rounded-md border p-4'>
      <div className='flex items-center'>
        <div className='flex items-center gap-2.5'>
          <Icon icon='DocumentFile' extension={fileExt} width={30} height={30} />
          <div className='flex flex-col'>
            <Typography variant='caption3' className='text-brand-black mb-1.5 font-medium'>
              {file.name}
            </Typography>
            <div className='text-brand-black/50 flex items-center gap-1.25 font-normal'>
              {isCompleted ? (
                <Typography variant='caption3'>
                  {formattedTotalSize} of {formattedTotalSize}
                </Typography>
              ) : (
                <Typography variant='caption3'>
                  {formattedCurrentSize} of {formattedTotalSize}
                </Typography>
              )}
              <Typography variant='caption3' className='text-brand-black/50'>
                •
              </Typography>
              {isCompleted ? (
                <div className='text-brand-black/50 flex items-center gap-1.25'>
                  <Icon icon='CheckCircle' width={14} height={14} />
                  <Typography variant='caption3'>Completed</Typography>
                </div>
              ) : (
                <div className='text-brand-black/50 flex items-center gap-1'>
                  <Loader className='h-3.5 w-3.5 animate-spin' strokeWidth={2.5} />
                  <Typography variant='caption3'>Uploading...</Typography>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          type='button'
          onClick={onRemove}
          className='absolute top-3 right-3 cursor-pointer rounded-full p-1 transition-colors outline-none hover:bg-black/5 focus:outline-none'
        >
          <Icon icon='Plus' width={14} height={14} />
        </button>
      </div>

      {!isCompleted && (
        <div className='mt-1 h-0.5 w-full overflow-hidden rounded-full bg-black/5'>
          <div className='bg-brand-black h-full transition-all duration-200 ease-in-out' style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
