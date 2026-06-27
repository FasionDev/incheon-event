/**
 * 자동 크롤링 + 이미지 검증 + 병합 스크립트 (GitHub Actions 전용)
 * 사용법: npm run crawl:auto
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { crawlAll: crawlIfac } = require('./ifac');
const { crawlAll: crawlItour } = require('./itour');
const { crawlAll: crawlTour } = require('./tour');

const EVENTS_PATH = path.join(__dirname, '../../src/data/events.json');
const IMAGE_CHECK_TIMEOUT_MS = 5000;
const IMAGE_CHECK_CONCURRENCY = 5;

function isDuplicate(existing, newItem) {
  return existing.some(
    (e) => e.title === newItem.title && e.startDate === newItem.startDate
  );
}

function generateId(existing) {
  const maxId = existing.reduce((max, e) => Math.max(max, parseInt(e.id, 10) || 0), 0);
  return String(maxId + 1);
}

/** 이미지 URL이 실제로 이미지를 반환하는지 확인 */
function checkImageUrl(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);

    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: 'HEAD', timeout: IMAGE_CHECK_TIMEOUT_MS }, (res) => {
      const ok = res.statusCode >= 200 && res.statusCode < 300;
      const isImage = (res.headers['content-type'] || '').startsWith('image/');
      resolve(ok && isImage);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

/** 배열을 청크로 나눠 순차 병렬 실행 */
async function checkImagesInBatches(events) {
  const results = new Array(events.length).fill(false);

  for (let i = 0; i < events.length; i += IMAGE_CHECK_CONCURRENCY) {
    const batch = events.slice(i, i + IMAGE_CHECK_CONCURRENCY);
    const checks = await Promise.all(batch.map((e) => checkImageUrl(e.imageUrl)));
    checks.forEach((ok, j) => { results[i + j] = ok; });
  }

  return results;
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf-8'));
  console.log(`기존 행사 수: ${existing.length}개`);

  const [ifacEvents, itourEvents, tourEvents] = await Promise.all([
    crawlIfac().catch((e) => { console.error('[ifac 오류]', e.message); return []; }),
    crawlItour().catch((e) => { console.error('[itour 오류]', e.message); return []; }),
    crawlTour().catch((e) => { console.error('[tour 오류]', e.message); return []; }),
  ]);

  // 크롤링 결과 중복 제거
  const seen = new Set();
  const crawled = [...ifacEvents, ...itourEvents, ...tourEvents].filter((e) => {
    const key = e.title + e.startDate;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 기존 데이터와 중복 제거
  const candidates = [];
  for (const item of crawled) {
    if (isDuplicate(existing, item)) continue;
    const { _source, ...clean } = item;
    candidates.push(clean);
  }

  if (candidates.length === 0) {
    console.log('신규 행사 없음 — events.json 변경 없음');
    process.exit(0);
  }

  console.log(`\n신규 후보 ${candidates.length}개 — 이미지 URL 검증 중...`);

  // 이미지 유효성 검사 (깨진 이미지는 제거)
  const imageResults = await checkImagesInBatches(candidates);
  let invalidCount = 0;
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i].imageUrl && !imageResults[i]) {
      console.log(`  [이미지 무효] ${candidates[i].title} → imageUrl 제거`);
      delete candidates[i].imageUrl;
      invalidCount++;
    }
  }
  if (invalidCount > 0) {
    console.log(`  → 유효하지 않은 이미지 ${invalidCount}개 제거됨`);
  }

  // ID 부여
  const newEvents = candidates.map((item, i) => ({
    ...item,
    id: generateId([...existing, ...candidates.slice(0, i)]),
  }));

  console.log(`\n✅ 신규 행사 ${newEvents.length}개:`);
  newEvents.forEach((e) => console.log(`  - [${e.startDate}] ${e.title}`));

  const merged = [...existing, ...newEvents].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  fs.writeFileSync(EVENTS_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`\nevents.json 업데이트 완료: ${existing.length}개 → ${merged.length}개`);
}

main().catch((e) => {
  console.error('크롤링 실패:', e.message);
  process.exit(1);
});
