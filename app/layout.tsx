import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'RealStateAgent.AI - Your AI Real Estate Assistant',
  description: '24/7 AI-powered virtual realtor helping buyers and sellers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='antialiased'>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
