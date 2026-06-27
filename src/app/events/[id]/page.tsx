import { notFound } from 'next/navigation';
import Link from 'next/link';
import eventsData from '@/data/events.json';
import { Event } from '@/types/event';

function localSrc(url: string) {
  return url.startsWith('/') ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${url}` : url;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  '축제': 'linear-gradient(135deg, #f97316, #ec4899)',
  '문화/공연': 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
  '전시': 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  '스포츠': 'linear-gradient(135deg, #22c55e, #84cc16)',
  '교육': 'linear-gradient(135deg, #eab308, #f97316)',
  '음식': 'linear-gradient(135deg, #ef4444, #f97316)',
  '환경': 'linear-gradient(135deg, #14b8a6, #22c55e)',
  '기타': 'linear-gradient(135deg, #6b7280, #374151)',
};

const CATEGORY_ICONS: Record<string, string> = {
  '축제': '🎪',
  '문화/공연': '🎭',
  '전시': '🖼️',
  '스포츠': '🏃',
  '교육': '📚',
  '음식': '🍽️',
  '환경': '🌿',
  '기타': '📌',
};

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dow = DAYS[d.getDay()];
  return `${y}.${m}.${day} (${dow})`;
}

function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

export function generateStaticParams() {
  return (eventsData as Event[]).map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = (eventsData as Event[]).find((e) => e.id === id);
  if (!event) return {};
  return {
    title: `${event.title} | 인천이벤트`,
    description: event.description ?? `${event.organizer} 주최 행사. ${formatDateRange(event.startDate, event.endDate)} · ${event.location}`,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = (eventsData as Event[]).find((e) => e.id === id);
  if (!event) notFound();

  const gradient = CATEGORY_GRADIENTS[event.category] ?? CATEGORY_GRADIENTS['기타'];
  const icon = CATEGORY_ICONS[event.category] ?? '📌';

  return (
    <main className="max-w-3xl mx-auto px-4 pb-16 pt-8">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-muted)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        목록으로
      </Link>

      {/* 정보 */}
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: 'var(--text-dim)' }}>{event.organizer}</p>
        <h1 className="text-2xl font-bold leading-snug mb-3" style={{ color: 'var(--text)' }}>
          {event.title}
        </h1>

        {/* 뱃지 */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {event.isFree && (
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--badge-free-bg)', color: 'var(--badge-free-color)', border: '1px solid var(--badge-free-border)' }}
            >
              무료
            </span>
          )}
          <span
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            {event.category}
          </span>
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 상세 정보 */}
        <div
          className="rounded-xl p-4 mb-5 flex flex-col gap-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="flex gap-3 text-sm">
            <span style={{ color: 'var(--text-dim)' }}>📅 일정</span>
            <span style={{ color: 'var(--text)' }}>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>
          <div className="flex gap-3 text-sm">
            <span style={{ color: 'var(--text-dim)' }}>📍 장소</span>
            <span style={{ color: 'var(--text)' }}>{event.location}</span>
          </div>
          {event.district && (
            <div className="flex gap-3 text-sm">
              <span style={{ color: 'var(--text-dim)' }}>🏙️ 지역</span>
              <span style={{ color: 'var(--text)' }}>{event.district}</span>
            </div>
          )}
        </div>

        {/* 설명 */}
        {event.description && (
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
            {event.description}
          </p>
        )}

        {/* 공식 페이지 링크 */}
        {event.sourceUrl && (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            공식 페이지 바로가기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>

      {/* 이미지 포스터 (하단, 크게) */}
      {event.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={localSrc(event.imageUrl)}
          alt={event.title}
          className="w-full rounded-2xl"
          style={{ height: 'auto' }}
        />
      ) : (
        <div
          className="w-full rounded-2xl flex flex-col items-center justify-center gap-3"
          style={{ background: gradient, aspectRatio: '3/4' }}
        >
          <span className="text-6xl">{icon}</span>
          <span className="text-white font-bold text-lg opacity-80">{event.category}</span>
        </div>
      )}
    </main>
  );
}
