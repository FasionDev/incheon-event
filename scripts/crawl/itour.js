/**
 * 인천관광재단(인천투어) 축제·공연·전시 크롤러
 * https://itour.incheon.go.kr/ssst/ssst/list.do?pageNm=fstv
 *
 * 이 사이트는 JS 기반 페이지네이션을 사용합니다.
 * form POST 방식으로 각 페이지를 가져옵니다.
 */
const axios = require('axios');
const cheerio = require('cheerio');
const { parseDateRange, inferDistrict, normalizeCategory } = require('./utils');

const BASE_URL = 'https://itour.incheon.go.kr';
const LIST_URL = `${BASE_URL}/ssst/ssst/list.do`;

async function crawlPage(pageIndex) {
  const params = new URLSearchParams({ pageNm: 'fstv', pageIndex: String(pageIndex) });

  const res = await axios.post(LIST_URL, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': `${LIST_URL}?pageNm=fstv`,
      'User-Agent': 'Mozilla/5.0 (compatible; crawler)',
    },
    timeout: 30000,
  });

  const $ = cheerio.load(res.data);
  const events = [];

  // 행사 카드 목록 순회 (선택자는 사이트 구조에 따라 조정 필요)
  $('ul.event-list > li, ul.list > li, .content-list > li').each((_, el) => {
    const $el = $(el);

    const $link = $el.find('a[name="btn_detail"]');
    const title = $link.text().trim();
    const cotId = $link.attr('cotid') || $link.attr('cotId');
    if (!title || !cotId) return;

    // 날짜 텍스트: "2026.10.03 ~2026.10.04"
    const dateRaw = $el.text().match(/\d{4}\.\d{2}\.\d{2}\s*~\s*\d{4}\.\d{2}\.\d{2}/);
    if (!dateRaw) return;
    const { startDate, endDate } = parseDateRange(dateRaw[0]);

    // 카테고리 텍스트 (축제/공연/전시 등)
    const categoryRaw = $el.find('span, em, .category').first().text().trim();

    // 이미지 (btn_share의 imgsrc 속성 또는 img 태그)
    const $share = $el.find('button[name="btn_share"]');
    const imgSrc = $share.attr('imgsrc') || $el.find('img').attr('src') || '';
    const imageUrl = imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc}`) : undefined;

    // 장소
    const location = $el.find('.place, .location').text().trim() || '인천';

    events.push({
      title,
      startDate,
      endDate,
      location,
      district: inferDistrict(location),
      category: normalizeCategory(categoryRaw || title),
      tags: ['오프라인'],
      sourceUrl: `${BASE_URL}/ssst/ssst/detail.do?cotId=${cotId}`,
      imageUrl,
      organizer: '인천관광재단',
      isFree: false,
      _source: 'itour',
    });
  });

  return events;
}

async function crawlAll() {
  console.log('[itour] 크롤링 시작...');
  const all = [];
  const seenKeys = new Set();
  let page = 1;

  while (true) {
    console.log(`  페이지 ${page} 수집 중...`);
    const items = await crawlPage(page);

    if (items.length === 0 || page > 10) break;

    // 새 항목이 하나도 없으면 페이지네이션이 반복된 것 → 중단
    const newItems = items.filter((e) => {
      const key = e.title + e.startDate;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
    if (newItems.length === 0) break;

    all.push(...newItems);
    page++;
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`[itour] 총 ${all.length}개 행사 수집 완료`);
  return all;
}

module.exports = { crawlAll };
