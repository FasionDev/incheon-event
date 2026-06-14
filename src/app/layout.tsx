import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '인천이벤트 | 인천의 행사를 한눈에',
  description: '인천시청, 각 구청, 공식 기관에서 주최하는 행사를 모아 소개합니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
