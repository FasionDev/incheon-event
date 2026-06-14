/**
 * crawl-result.json → events.json 병합
 * 사용법: npm run crawl:merge
 */
const fs = require('fs');
const path = require('path');

const EVENTS_PATH = path.join(__dirname, '../../src/data/events.json');
const RESULT_PATH = path.join(__dirname, 'crawl-result.json');

if (!fs.existsSync(RESULT_PATH)) {
  console.error('crawl-result.json 파일이 없습니다. 먼저 npm run crawl 을 실행하세요.');
  process.exit(1);
}

const existing = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf-8'));
const newEvents = JSON.parse(fs.readFileSync(RESULT_PATH, 'utf-8'));

const merged = [...existing, ...newEvents].sort(
  (a, b) => new Date(a.startDate) - new Date(b.startDate)
);

fs.writeFileSync(EVENTS_PATH, JSON.stringify(merged, null, 2), 'utf-8');
fs.unlinkSync(RESULT_PATH);

console.log(`✅ events.json 병합 완료: ${existing.length}개 → ${merged.length}개`);
