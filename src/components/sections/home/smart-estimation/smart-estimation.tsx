'use client';

import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { ComponentContainer } from '@/components/layout';

import { SmartEstimationInput } from './components';
import { EstimationAnimatedBackground } from './components';
import { useEffect, useRef, useState } from 'react';

import smartEstimationContent from './content.json';

export const SmartEstimation = () => {
  const [step, setStep] = useState<'input' | 'loading' | 'success'>('input');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = () => {
    if (!text.trim() && !file) return;
    setStep('loading');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStep('success');
    }, 5000);
  };

  const handleEdit = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStep('input');
  };

  const handleDownload = () => {
    const pdfBase64 =
      'JVBERi0xLjcKJYGBgYEKCjYgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbmd0aCAxODMKPj4Kc3RyZWFtCnicdY5BCgIxDEX3OUXXgpomadKCCOooLtwIvYCIiqKLEfH8ZhQUQQk09CXh/RamFTB0dT3AcLk733e343bTNyxZMlougTDUPZCEuoL4XI0hYTCJA5/WC4wkGZto0Uaj98QTQiZGavxNhJp1YcnIeBzqCWoP5hXW0P6TFxPSTElziPJbjm95QiNX80tLwszJ1TPGrpw0Tyrf1IOidZcLy5/gOrPiM3VKhE6yenyz7q/Tr/APa2lDpQplbmRzdHJlYW0KZW5kb2JqCgo3IDAgb2JqCjw8Ci9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9UeXBlIC9PYmpTdG0KL04gNQovRmlyc3QgMjYKL0xlbmd0aCAzNzgKPj4Kc3RyZWFtCnic1VLfS8MwEH7PX3GP+uCSZmmTyhjsVxVEFCcoig9dG0ZlJNJmMv9779LNsQfxWcrR3N13ue9yXwICJCgFQ9AGFKRDCSlolcJoxPjj14cFfl+ubcf4TVN38IoYAQ/wxvjMb12AhI3H7IidlaHc+DXriyAh8AFx3/p6W9kWRsWiKITQQohMoWVCyDn+Z2g5mkQfc9LgGU2rvWFMD4UYTjBX9JbpvobyEZvu6xf4R2xGmHmPVab3f/pSr0V/h/yLTz5m/NbX8zJYOJtfSiGzSAafSiQv5/gcrS2D/7/DRf6Nd79OeLJnWi8tubWkgbhl/mA7v20rXDvhCo8ZOlzbzacNTVVeaJEb5KlNjhqLJcdcrpXMjEwzs89hO/58t3q3VbyG3MUuXC0D8esDFLu1dVNO/Q6VKfBL83QgDRiVDLALqnTinA+k26hYF5AvedlexSdDEWXGl9tViC4FE8anZWfjMEe2SMVVvm7cGvhT4yauaw4BuvEbKHXOWAplbmRzdHJlYW0KZW5kb2JqCgo4IDAgb2JqCjw8Ci9TaXplIDkKL1Jvb3QgMiAwIFIKL0luZm8gMyAwIFIKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL1R5cGUgL1hSZWYKL0xlbmd0aCAzOQovVyBbIDEgMiAyIF0KL0luZGV4IFsgMCA5IF0KPj4Kc3RyZWFtCnicFcSxDQAgEAOxS0CiZf8p2eDRuTAwUw5YrLZshwuJ9cEHXPsDTAplbmRzdHJlYW0KZW5kb2JqCgpzdGFydHhyZWYKNzUyCiUlRU9G';

    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'estimation.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className='relative flex w-full flex-col pt-53.25 pb-38.75 md:pt-80.5 md:pb-89.25 xl:h-screen xl:justify-center xl:overflow-hidden xl:py-16'>
      <EstimationAnimatedBackground className='-left-1.25 h-200 w-[calc(100%+10px)] md:-left-2.5 md:h-300 md:w-[calc(100%+20px)] xl:h-full' />

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
            onTextChange={setText}
            onFileChange={setFile}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            onDownload={handleDownload}
          />
        </div>
      </ComponentContainer>
    </section>
  );
};
