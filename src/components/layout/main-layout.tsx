import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const MainLayout: FC<Props> = ({ children }) => (
  <main className='flex flex-1 flex-col'>
    <div className='flex h-full min-h-full w-full flex-auto flex-col overflow-clip'>{children}</div>
  </main>
);
