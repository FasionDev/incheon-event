'use client';

import { useState, useMemo } from 'react';
import { Event, EventCategory } from '@/types/event';
import EventCard from './EventCard';
import FilterBar from './FilterBar';

type Tab = 'upcoming' | 'ended' | 'all';

const TABS: { value: Tab; label: string }[] = [
  { value: 'upcoming', label: '진행 예정' },
  { value: 'ended', label: '종료됨' },
  { value: 'all', label: '전체' },
];

interface MonthGroup {
  label: string;
  events: Event[];
}

function groupByMonth(events: Event[], descending = false): MonthGroup[] {
  const sorted = [...events].sort((a, b) => {
    const diff = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    return descending ? -diff : diff;
  });

  const map = new Map<string, Event[]>();
  for (const e of sorted) {
    const d = new Date(e.startDate);
    const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }

  return Array.from(map.entries()).map(([label, events]) => ({ label, events }));
}

interface Props {
  events: Event[];
}

export default function EventList({ events }: Props) {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [search, setSearch] = useState('');

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const filtered = useMemo(() => {
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);

    return events.filter((e) => {
      const end = new Date(e.endDate);
      if (tab === 'upcoming' && end < today) return false;
      if (tab === 'ended' && end >= today) return false;
      if (tab === 'ended' && end < twoMonthsAgo) return false;
      if (tab === 'all' && end < twoMonthsAgo) return false;
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (showFreeOnly && !e.isFree) return false;
      if (
        search &&
        !e.title.includes(search) &&
        !(e.description ?? '').includes(search) &&
        !e.tags.some((t) => t.includes(search))
      )
        return false;
      return true;
    });
  }, [events, tab, selectedCategory, showFreeOnly, search, today]);

  const grouped = useMemo(
    () => groupByMonth(filtered, tab === 'ended'),
    [filtered, tab]
  );

  return (
    <div>
      {/* Tabs */}
      <div
        className="flex mt-6 rounded-xl p-1 gap-1"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={
              tab === value
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--text-muted)' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-0 mt-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-dim)' }}>
          🔍
        </span>
        <input
          type="text"
          placeholder="행사 검색하기"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      {/* Filters */}
      <FilterBar
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        showFreeOnly={showFreeOnly}
        onToggleFree={() => setShowFreeOnly((v) => !v)}
      />

      {/* Count */}
      <p className="text-sm mt-4 mb-2" style={{ color: 'var(--text-dim)' }}>
        총 {filtered.length}개 행사
      </p>

      {/* Grouped list */}
      {grouped.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-dim)' }}>
          <p className="text-4xl mb-3">🥲</p>
          <p>조건에 맞는 행사가 없어요</p>
        </div>
      ) : (
        grouped.map(({ label, events }) => (
          <section key={label} className="mt-6">
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
              {label}
            </h3>
            <div>
              {events.map((event) => {
                const isPast = new Date(event.endDate) < today;
                return <EventCard key={event.id} event={event} isPast={isPast} />;
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
