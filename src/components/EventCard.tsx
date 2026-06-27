'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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

function getDday(startDate: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const diff = Math.floor((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return 'Today';
  if (diff <= 60) return `D-${diff}`;
  return null;
}

interface Props {
  event: Event;
  isPast?: boolean;
}

export default function EventCard({ event, isPast = false }: Props) {
  const [imgError, setImgError] = useState(false);
  const dday = getDday(event.startDate);
  const gradient = CATEGORY_GRADIENTS[event.category] ?? CATEGORY_GRADIENTS['기타'];
  const icon = CATEGORY_ICONS[event.category] ?? '📌';

  const sharedClassName = "group flex gap-5 py-6";
  const sharedStyle = { borderBottom: '1px solid var(--border)', opacity: isPast ? 0.5 : 1 };

  const content = (
    <>
      {/* Thumbnail */}
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: 200, height: 134 }}
      >
        {event.imageUrl && !imgError ? (
          <>
            <Image
              src={localSrc(event.imageUrl)}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
              onError={() => setImgError(true)}
            />
            {isPast ? (
              <span
                className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#aaa' }}
              >
                종료
              </span>
            ) : dday && (
              <span
                className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: dday === 'Today' ? '#ef4444' : 'var(--accent)', color: '#fff' }}
              >
                {dday}
              </span>
            )}
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-1"
            style={{ background: gradient }}
          >
            <span className="text-3xl">{icon}</span>
            {isPast ? (
              <span
                className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#aaa' }}
              >
                종료
              </span>
            ) : dday && (
              <span
                className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: dday === 'Today' ? '#ef4444' : 'rgba(0,0,0,0.5)', color: '#fff' }}
              >
                {dday}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>
            {event.organizer}
          </p>
          <h2
            className="font-bold text-lg leading-snug mb-1.5 group-hover:text-blue-400 transition-colors line-clamp-2"
            style={{ color: 'var(--text)' }}
          >
            {event.title}
          </h2>
          {event.description && (
            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
              {event.description}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs mb-2.5" style={{ color: 'var(--text-dim)' }}>
            📅 {formatDateRange(event.startDate, event.endDate)}
            <span className="mx-1.5">·</span>
            📍 {event.location}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {event.isFree && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--badge-free-bg)', color: 'var(--badge-free-color)', border: '1px solid var(--badge-free-border)' }}
              >
                무료
              </span>
            )}
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
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/events/${event.slug}`} className={sharedClassName} style={sharedStyle}>
      {content}
    </Link>
  );
}
