import { Header } from '@/components/layout/header';

export default function LightHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header theme='light' />
      {children}
    </>
  );
}
