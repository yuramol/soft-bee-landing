import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import './globals.css';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

const fixel = localFont({
  src: [
    {
      path: '../assets/fonts/fixel/fixelVariable.ttf',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/fixelVariableItalic.ttf',
      style: 'italic'
    }
  ],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Confyde',
  description: 'Confyde landing page'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={cn('h-full antialiased', 'font-sans', fixel.variable)}>
      <body className='flex h-full flex-col'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
