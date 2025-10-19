import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nestora - Your AI Real Estate Assistant',
  description: '24/7 AI-powered virtual realtor helping buyers and sellers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
