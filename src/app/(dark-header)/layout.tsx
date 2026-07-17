import { Header } from '@/components/layout';

export default function DarkHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header theme='dark' />
      {children}
    </>
  );
}
