import eventsData from '@/data/events.json';
import { Event } from '@/types/event';
import EventList from '@/components/EventList';

export default function Home() {
  const events = eventsData as Event[];

  return (
    <main className="max-w-3xl mx-auto px-4 pb-16">
      <div className="pt-8 pb-2">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
          전체 행사
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
          인천시청, 각 구청, 공공기관의 행사를 모아 소개합니다.
        </p>
      </div>
      <EventList events={events} />
    </main>
  );
}
