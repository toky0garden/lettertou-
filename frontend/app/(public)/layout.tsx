import { Header } from './(components)/layout';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <>
      <Header />
      <main className='h-full min-h-screen'>{children}</main>
    </>
  );
}
