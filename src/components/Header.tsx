'use client';

import Link from 'next/link';

const GITHUB_ISSUE_URL =
  'https://github.com/Chung10kr/inchecon-event/issues/new?template=event-request.md&title=%5B%EC%9D%B4%EB%B2%A4%ED%8A%B8+%EB%93%B1%EB%A1%9D%5D&labels=event-request';

export default function Header() {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: '#111111' }} className="sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl">🌊</span>
          <div>
            <h1 className="text-base font-bold leading-tight" style={{ color: 'var(--text)' }}>
              인천이벤트
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              인천의 행사를 한눈에
            </p>
          </div>
        </Link>
        <a
          href={GITHUB_ISSUE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <span>+</span> 행사 등록 요청
        </a>
      </div>
    </header>
  );
}
