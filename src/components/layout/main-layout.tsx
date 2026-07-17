import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const MainLayout: FC<Props> = ({ children }) => (
  <main className='flex flex-1 flex-col'>
    <div className='flex h-full min-h-full w-full flex-auto flex-col overflow-hidden'>
      <div className='bg-muted text-brand-black flex min-h-screen flex-col p-2.5'>
        <div className='bg-background w-full overflow-hidden rounded-2xl'>{children}</div>
      </div>
    </div>
  </main>
);
