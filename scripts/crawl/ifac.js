/**
 * 인천문화재단 공연·행사 크롤러
 * https://ifac.or.kr/culturalInfo/cuturalEvents/performanceSrch/list.do
 */
const axios = require('axios');
const cheerio = require('cheerio');
const { parseDateRange, inferDistrict, normalizeCategory } = require('./utils');

const BASE_URL = 'https://ifac.or.kr';
const LIST_URL = `${BASE_URL}/culturalInfo/cuturalEvents/performanceSrch/list.do`;
const KEY = 'm2501152621396';

async function crawlPage(pageIndex) {
  const res = await axios.get(LIST_URL, {
    params: { key: KEY, pageIndex },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; crawler)' },
    timeout: 10000,
  });

  const $ = cheerio.load(res.data);
  const events = [];

  // 행사 목록 아이템 순회 (구조: ul > li > a)
  $('ul.list > li, .list-type > li, .board-list > li').each((_, el) => {
    const $el = $(el);

    // 종료된 행사 제외
    const status = $el.find('div, span').first().text().trim();
    if (status === '종료') return;

    const title = $el.find('strong').first().text().trim();
    if (!title) return;

    // 날짜: "모임기간" 포함 li 텍스트
    const dateRaw = $el.find('li').filter((_, li) => $(li).text().includes('모임기간')).text()
      .replace('모임기간', '').trim();
    if (!dateRaw) return;
    const { startDate, endDate } = parseDateRange(dateRaw);

    // 장소/주최
    const organizer = $el.find('li').filter((_, li) => $(li).text().includes('주최')).text()
      .replace('주최', '').trim() || '인천문화재단';

    // 이미지
    const imgSrc = $el.find('img').attr('src') || '';
    const imageUrl = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc}`) : undefined;

    events.push({
      title,
      startDate,
      endDate,
      location: organizer,
      district: inferDistrict(organizer),
      category: normalizeCategory(title),
      tags: ['문화', '오프라인'],
      sourceUrl: LIST_URL,
      imageUrl,
      organizer,
      isFree: false,
      _source: 'ifac',
    });
  });

  return events;
}

async function crawlAll() {
  console.log('[ifac] 크롤링 시작...');
  const all = [];
  let page = 1;

  while (true) {
    console.log(`  페이지 ${page} 수집 중...`);
    const items = await crawlPage(page);
    if (items.length === 0) break;
    all.push(...items);
    page++;
    await new Promise((r) => setTimeout(r, 500)); // 서버 부하 방지
  }

  console.log(`[ifac] 총 ${all.length}개 행사 수집 완료`);
  return all;
}

module.exports = { crawlAll };
