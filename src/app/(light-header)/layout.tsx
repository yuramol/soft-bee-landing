import { Header } from '@/components/layout';

export default function LightHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header theme='light' />
      {children}
    </>
  );
}
