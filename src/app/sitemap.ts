import { MetadataRoute } from 'next';
import eventsData from '@/data/events.json';
import { Event } from '@/types/event';

export const dynamic = 'force-static';

const BASE_URL = 'https://fasiondev.github.io/incheon-event';

export default function sitemap(): MetadataRoute.Sitemap {
  const eventPages = (eventsData as Event[]).map((e) => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...eventPages,
  ];
}
