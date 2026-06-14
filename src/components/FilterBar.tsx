'use client';

import { EventCategory } from '@/types/event';

const CATEGORIES: { label: string; value: EventCategory | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '축제', value: '축제' },
  { label: '문화/공연', value: '문화/공연' },
  { label: '전시', value: '전시' },
  { label: '스포츠', value: '스포츠' },
  { label: '교육', value: '교육' },
  { label: '음식', value: '음식' },
  { label: '환경', value: '환경' },
  { label: '기타', value: '기타' },
];

interface Props {
  selected: EventCategory | 'all';
  onSelect: (value: EventCategory | 'all') => void;
  showFreeOnly: boolean;
  onToggleFree: () => void;
}

export default function FilterBar({ selected, onSelect, showFreeOnly, onToggleFree }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="flex flex-wrap gap-1.5 flex-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={
              selected === cat.value
                ? { background: 'var(--accent)', color: '#fff' }
                : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
      <button
        onClick={onToggleFree}
        className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
        style={
          showFreeOnly
            ? { background: '#052e16', color: '#4ade80', border: '1px solid #166534' }
            : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
        }
      >
        무료만
      </button>
    </div>
  );
}
