/** "2026.10.03" 또는 "2026.10.03 ~2026.10.04" → "2026-10-03" */
function parseDate(str) {
  return str.trim().replace(/\./g, '-');
}

/** "2026.10.03 ~2026.10.04" → { startDate, endDate } */
function parseDateRange(str) {
  const parts = str.split('~').map((s) => s.trim());
  const startDate = parseDate(parts[0]);
  const endDate = parts[1] ? parseDate(parts[1]) : startDate;
  return { startDate, endDate };
}

const DISTRICT_KEYWORDS = {
  '중구': ['중구', '개항장', '차이나타운', '월미', '인천국제공항', '영종'],
  '동구': ['동구', '화수', '만석'],
  '미추홀구': ['미추홀', '주안', '용현', '학익'],
  '연수구': ['연수구', '송도', 'G-Tower', 'IFEZ', '인천경제자유구역'],
  '남동구': ['남동구', '소래포구', '소래', '간석', '구월'],
  '부평구': ['부평'],
  '계양구': ['계양'],
  '서구': ['서구', '청라', '검단', '루원'],
  '강화군': ['강화'],
  '옹진군': ['옹진', '백령', '덕적', '자월'],
};

function inferDistrict(location) {
  for (const [district, keywords] of Object.entries(DISTRICT_KEYWORDS)) {
    if (keywords.some((k) => location.includes(k))) return district;
  }
  return '';
}

/** 카테고리 문자열 → events.json 카테고리 */
function normalizeCategory(raw) {
  const map = {
    '축제': '축제',
    '공연': '문화/공연',
    '전시': '전시',
    '스포츠': '스포츠',
    '교육': '교육',
    '체험': '교육',
    '음식': '음식',
    '환경': '환경',
  };
  for (const [key, val] of Object.entries(map)) {
    if (raw.includes(key)) return val;
  }
  return '기타';
}

module.exports = { parseDateRange, inferDistrict, normalizeCategory };
