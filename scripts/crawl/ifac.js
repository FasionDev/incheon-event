/**
 * 인천문화재단 공연·행사 크롤러
 * https://ifac.or.kr/culturalInfo/cuturalEvents/performanceSrch/list.do
 *
 * 실제 HTML 구조:
 *   <a href="#none" onclick="goView('13677');">
 *     <div class="img"><img src="/common/image.do?key=..." alt="제목"></div>
 *     <div class="text">
 *       <p class="title">제목</p>
 *       <ul class="info">
 *         <li><b>주최</b><span>주최기관</span></li>
 *         <li><b>모임기간</b><span>2026.06.27 ~ 2026.06.28</span></li>
 *       </ul>
 *     </div>
 *   </a>
 */
const axios = require('axios');
const cheerio = require('cheerio');
const { parseDateRange, inferDistrict, normalizeCategory } = require('./utils');

const BASE_URL = 'https://ifac.or.kr';
const KEY = 'm2501152621396';
const LIST_URL = `${BASE_URL}/culturalInfo/cuturalEvents/performanceSrch/list.do`;

async function crawlPage(pageIndex) {
  const res = await axios.get(LIST_URL, {
    params: { key: KEY, pageIndex },
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; crawler)' },
    timeout: 10000,
  });

  const $ = cheerio.load(res.data);
  const events = [];

  $('a[onclick*="goView"]').each((_, el) => {
    const $el = $(el);

    // 종료된 행사 제외 (ended 클래스)
    if ($el.find('span.ended').length > 0) return;

    const title = $el.find('p.title').text().trim();
    if (!title) return;

    // 날짜
    const $dateLi = $el.find('li').filter((_, li) => $(li).find('b').text().trim() === '모임기간');
    const dateRaw = $dateLi.find('span').text().trim();
    if (!dateRaw) return;
    const { startDate, endDate } = parseDateRange(dateRaw);

    // 주최기관
    const $orgLi = $el.find('li').filter((_, li) => $(li).find('b').text().trim() === '주최');
    const organizer = $orgLi.find('span').text().trim() || '인천문화재단';

    // 이미지
    const imgSrc = $el.find('div.img img').attr('src') || '';
    const imageUrl = imgSrc ? `${BASE_URL}${imgSrc}` : undefined;

    // 상세 페이지 URL
    const onclick = $el.attr('onclick') || '';
    const viewIdMatch = onclick.match(/goView\('(\d+)'\)/);
    const viewId = viewIdMatch ? viewIdMatch[1] : '';
    const sourceUrl = viewId
      ? `${BASE_URL}/culturalInfo/cuturalEvents/performanceSrch/view.do?key=${KEY}&seq=${viewId}`
      : LIST_URL;

    events.push({
      title,
      startDate,
      endDate,
      location: organizer,
      district: inferDistrict(organizer),
      category: normalizeCategory(title),
      tags: ['문화', '오프라인'],
      sourceUrl,
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
    if (items.length === 0 || page > 20) break;
    all.push(...items);
    page++;
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`[ifac] 총 ${all.length}개 행사 수집 완료`);
  return all;
}

module.exports = { crawlAll };
