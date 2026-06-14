/**
 * 크롤링 메인 실행 파일
 * 사용법: npm run crawl
 *
 * 수집한 데이터를 기존 events.json과 병합 후 출력합니다.
 * 최종 반영은 직접 확인 후 진행하세요.
 */
const fs = require('fs');
const path = require('path');
const { crawlAll: crawlIfac } = require('./ifac');
const { crawlAll: crawlItour } = require('./itour');

const EVENTS_PATH = path.join(__dirname, '../../src/data/events.json');

function isDuplicate(existing, newItem) {
  return existing.some(
    (e) => e.title === newItem.title && e.startDate === newItem.startDate
  );
}

function generateId(existing) {
  const maxId = existing.reduce((max, e) => Math.max(max, parseInt(e.id, 10) || 0), 0);
  return String(maxId + 1);
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf-8'));
  console.log(`기존 행사 수: ${existing.length}개\n`);

  const [ifacEvents, itourEvents] = await Promise.all([
    crawlIfac().catch((e) => { console.error('[ifac 오류]', e.message); return []; }),
    crawlItour().catch((e) => { console.error('[itour 오류]', e.message); return []; }),
  ]);

  // 크롤링 결과 내부 중복 제거
  const seen = new Set();
  const crawled = [...ifacEvents, ...itourEvents].filter((e) => {
    const key = e.title + e.startDate;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`\n크롤링 합계 (중복 제거): ${crawled.length}개`);

  const newEvents = [];
  for (const item of crawled) {
    if (isDuplicate(existing, item)) continue;

    // _source 내부 필드 제거 후 ID 부여
    const { _source, ...clean } = item;
    clean.id = generateId([...existing, ...newEvents]);
    newEvents.push(clean);
  }

  if (newEvents.length === 0) {
    console.log('\n새로운 행사가 없습니다.');
    return;
  }

  console.log(`\n✅ 신규 행사 ${newEvents.length}개:`);
  newEvents.forEach((e) => console.log(`  - [${e.startDate}] ${e.title}`));

  // 미리보기 파일로 저장 (events.json 직접 덮어쓰지 않음)
  const previewPath = path.join(__dirname, 'crawl-result.json');
  fs.writeFileSync(previewPath, JSON.stringify(newEvents, null, 2), 'utf-8');
  console.log(`\n📄 미리보기 저장: scripts/crawl/crawl-result.json`);
  console.log('확인 후 events.json에 병합하려면 npm run crawl:merge 를 실행하세요.');
}

main();
