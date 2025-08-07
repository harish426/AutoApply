import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/header'; // ✅ import your header

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Autoapply',
  description: 'Automated job application dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Shared Header */}
        <Header />

        {/* ✅ Page Content */}
        <main className='max-w-7xl mx-auto'>{children}</main>
      </body>
    </html>
  );
}
