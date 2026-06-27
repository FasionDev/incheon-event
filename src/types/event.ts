export type EventCategory =
  | '축제'
  | '문화/공연'
  | '전시'
  | '스포츠'
  | '교육'
  | '음식'
  | '환경'
  | '기타';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  district: string;
  category: EventCategory;
  tags: string[];
  sourceUrl?: string;
  imageUrl?: string;
  organizer: string;
  isFree: boolean;
}
