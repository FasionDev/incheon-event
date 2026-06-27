/**
 * 인천관광재단(인천투어) 축제·공연·전시 크롤러
 * https://itour.incheon.go.kr/ssst/ssst/list.do?pageNm=fstv
 *
 * 실제 HTML 구조 (POST 응답):
 *   <li class="item_fstv">
 *     <div class="photo">
 *       <div class="f_icon"><span class="fest">축제</span></div>
 *       <img src="/common/viewImg.do?imgId=..." alt="제목">
 *     </div>
 *     <div class="subject">
 *       <a name="btn_detail" cotId="APD..." class="link">제목</a>
 *     </div>
 *     <div class="date">2026.10.02 ~2026.10.04</div>
 *     <div class="buttons">
 *       <button name="btn_share" cotId="..." imgsrc="/common/viewImg.do?imgId=...">
 *     </div>
 *   </li>
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

  $('li.item_fstv').each((_, el) => {
    const $el = $(el);

    const $link = $el.find('a[name="btn_detail"]');
    const title = $link.text().trim();
    const cotId = $link.attr('cotId') || $link.attr('cotid');
    if (!title || !cotId) return;

    // 날짜: "2026.10.02 ~2026.10.04"
    const dateRaw = $el.find('div.date').text().trim();
    if (!dateRaw) return;
    const { startDate, endDate } = parseDateRange(dateRaw);

    // 카테고리 (축제/공연/전시 등)
    const categoryRaw = $el.find('div.f_icon span').first().text().trim();

    // 이미지: div.photo img (src는 상대경로)
    const imgSrc = $el.find('div.photo img').attr('src') || '';
    const imageUrl = imgSrc
      ? (imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc}`)
      : undefined;

    events.push({
      title,
      startDate,
      endDate,
      location: '인천',
      district: '',
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

    if (items.length === 0 || page > 15) break;

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
