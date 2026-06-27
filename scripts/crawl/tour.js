/**
 * 한국관광공사 오픈API 크롤러 (인천 행사)
 * https://www.data.go.kr 에서 API 키 발급 필요
 *
 * 환경변수: TOUR_API_KEY (없으면 이 크롤러는 스킵됨)
 * GitHub Actions: Settings → Secrets → TOUR_API_KEY 로 등록
 *
 * areaCode=2 (인천), contentTypeId=15 (축제공연행사)
 */
const axios = require('axios');
const { inferDistrict, normalizeCategory } = require('./utils');

const API_BASE = 'https://apis.data.go.kr/B551011/KorService2';
const AREA_CODE = '2'; // 인천

function yyyymmdd(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

function parseApiDate(str) {
  if (!str || str.length !== 8) return '';
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
}

async function fetchPage(serviceKey, pageNo, eventStartDate) {
  const res = await axios.get(`${API_BASE}/searchFestival2`, {
    params: {
      serviceKey,
      numOfRows: 100,
      pageNo,
      MobileOS: 'ETC',
      MobileApp: 'IncheonEvent',
      _type: 'json',
      listYN: 'Y',
      arrange: 'A',
      contentTypeId: 15,
      areaCode: AREA_CODE,
      eventStartDate,
    },
    timeout: 15000,
  });

  const body = res.data?.response?.body;
  if (!body) return { items: [], totalCount: 0 };

  const totalCount = body.totalCount || 0;
  const raw = body.items?.item;
  if (!raw) return { items: [], totalCount };

  const items = (Array.isArray(raw) ? raw : [raw]).map((item) => ({
    title: item.title?.trim() || '',
    startDate: parseApiDate(item.eventstartdate),
    endDate: parseApiDate(item.eventenddate) || parseApiDate(item.eventstartdate),
    location: item.addr1?.trim() || '인천',
    district: inferDistrict(item.addr1 || ''),
    category: normalizeCategory(item.title || ''),
    tags: ['오프라인'],
    sourceUrl: `https://www.visitkorea.or.kr/detail?contentId=${item.contentid}`,
    imageUrl: item.firstimage || item.firstimage2 || undefined,
    organizer: '한국관광공사',
    isFree: false,
    _source: 'tour',
  })).filter((e) => e.title && e.startDate);

  return { items, totalCount };
}

async function crawlAll() {
  const serviceKey = process.env.TOUR_API_KEY;
  if (!serviceKey) {
    console.log('[tour] TOUR_API_KEY 환경변수 없음 — 스킵');
    return [];
  }

  console.log('[tour] 한국관광공사 API 크롤링 시작...');
  const eventStartDate = yyyymmdd(new Date());
  const all = [];
  let pageNo = 1;

  while (true) {
    console.log(`  페이지 ${pageNo} 수집 중...`);
    const { items, totalCount } = await fetchPage(serviceKey, pageNo, eventStartDate);

    if (items.length === 0) break;
    all.push(...items);

    if (all.length >= totalCount || pageNo >= 10) break;
    pageNo++;
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`[tour] 총 ${all.length}개 행사 수집 완료`);
  return all;
}

module.exports = { crawlAll };
