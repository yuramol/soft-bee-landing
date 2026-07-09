'use client';

import React from 'react';
import { Navbar } from './navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='bg-surface flex h-screen flex-col overflow-hidden font-sans'>
      <Navbar />

      <main className='flex min-h-0 flex-1 flex-col'>{children}</main>
    </div>
  );
};
