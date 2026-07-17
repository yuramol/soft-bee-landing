import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const MainLayout: FC<Props> = ({ children }) => (
  <main className='flex flex-1 flex-col'>
    <div className='bg-muted text-foreground flex h-full min-h-screen w-full flex-auto flex-col overflow-hidden p-2.5'>{children}</div>
  </main>
);
