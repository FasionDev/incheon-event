/**
 * 종료된 행사를 events.json에서 제거하고 이름만 archive.md에 기록
 * 사용법: npm run archive
 */
const fs = require('fs');
const path = require('path');

const EVENTS_PATH = path.join(__dirname, '../../src/data/events.json');
const ARCHIVE_PATH = path.join(__dirname, '../../src/data/archive.md');

const today = new Date();
today.setHours(0, 0, 0, 0);

const events = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf-8'));

const active = [];
const past = [];

for (const e of events) {
  if (new Date(e.endDate) < today) {
    past.push(e);
  } else {
    active.push(e);
  }
}

if (past.length === 0) {
  console.log('종료된 행사가 없습니다.');
  process.exit(0);
}

// archive.md에 추가 (없으면 생성)
const existing = fs.existsSync(ARCHIVE_PATH) ? fs.readFileSync(ARCHIVE_PATH, 'utf-8') : '# 인천이벤트 이력\n';

// 연도별 그룹화
const byYear = {};
for (const e of past) {
  const year = e.endDate.slice(0, 4);
  if (!byYear[year]) byYear[year] = [];
  byYear[year].push(e);
}

let appendText = '';
for (const year of Object.keys(byYear).sort()) {
  // 이미 해당 연도 섹션이 있으면 항목만 추가, 없으면 섹션 새로 작성
  const sectionHeader = `## ${year}년`;
  const lines = byYear[year].map((e) => `- ${e.title} (${e.startDate} ~ ${e.endDate})`);

  if (existing.includes(sectionHeader)) {
    // 섹션 뒤에 항목 삽입은 복잡하므로 파일 끝에 추가
    appendText += lines.join('\n') + '\n';
  } else {
    appendText += `\n${sectionHeader}\n${lines.join('\n')}\n`;
  }
}

fs.writeFileSync(ARCHIVE_PATH, existing + appendText, 'utf-8');
fs.writeFileSync(EVENTS_PATH, JSON.stringify(active, null, 2), 'utf-8');

console.log(`✅ 아카이브 완료`);
console.log(`  - 제거된 행사: ${past.length}개 → src/data/archive.md 기록`);
console.log(`  - 남은 행사: ${active.length}개`);
past.forEach((e) => console.log(`    [종료] ${e.title}`));
