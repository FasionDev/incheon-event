import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌊</text></svg>' },
  title: '인천이벤트 | 인천의 행사를 한눈에',
  description: '인천시청, 각 구청, 공식 기관에서 주최하는 행사를 모아 소개합니다.',
  keywords: ['인천 행사', '인천 축제', '인천 이벤트', '인천 문화행사', '인천 공연', '인천 전시', '2026 인천'],
  openGraph: {
    title: '인천이벤트 | 인천의 행사를 한눈에',
    description: '인천시청, 각 구청, 공식 기관에서 주최하는 행사를 모아 소개합니다.',
    url: 'https://fasiondev.github.io/incheon-event',
    siteName: '인천이벤트',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://fasiondev.github.io/incheon-event/og-image.png',
        width: 1200,
        height: 630,
        alt: '인천이벤트 - 인천의 행사를 한눈에',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '인천이벤트 | 인천의 행사를 한눈에',
    description: '인천시청, 각 구청, 공식 기관에서 주최하는 행사를 모아 소개합니다.',
    images: ['https://fasiondev.github.io/incheon-event/og-image.png'],
  },
  verification: {
    google: 'htSrTa_Dy0f_YUjM2vM3X1tA1XlRMdhMW0aMFPnfsEI',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-WYQYGC8JH2"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WYQYGC8JH2');
            `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}
