import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
    <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.1"/>
    </linearGradient>
    <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.05"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>

  <!-- 배경 -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 물결 장식 -->
  <ellipse cx="1100" cy="100" rx="400" ry="300" fill="url(#wave1)"/>
  <ellipse cx="150" cy="530" rx="350" ry="250" fill="url(#wave2)"/>

  <!-- 하단 파도 라인 -->
  <path d="M0 500 Q150 470 300 490 Q450 510 600 485 Q750 460 900 480 Q1050 500 1200 475 L1200 630 L0 630 Z" fill="#1e3a5f" opacity="0.5"/>
  <path d="M0 530 Q200 505 400 520 Q600 535 800 510 Q1000 485 1200 505 L1200 630 L0 630 Z" fill="#0f4c75" opacity="0.4"/>

  <!-- 상단 accent 라인 -->
  <rect x="80" y="195" width="60" height="5" rx="3" fill="url(#accent)"/>

  <!-- 이모지 아이콘 영역 -->
  <text x="80" y="185" font-size="72" font-family="serif">🌊</text>

  <!-- 메인 타이틀 -->
  <text x="80" y="295" font-size="80" font-weight="bold" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" fill="white" letter-spacing="-1">인천이벤트</text>

  <!-- 서브 텍스트 -->
  <text x="83" y="360" font-size="34" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" fill="#94a3b8" letter-spacing="1">인천의 행사를 한눈에</text>

  <!-- 구분선 -->
  <rect x="80" y="400" width="1040" height="1" fill="#334155"/>

  <!-- 하단 설명 -->
  <text x="83" y="445" font-size="26" font-family="'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" fill="#64748b">인천시청 · 각 구청 · 공식 기관 주최 행사 모음</text>

  <!-- URL 뱃지 -->
  <rect x="83" y="475" width="420" height="44" rx="22" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="293" y="503" font-size="22" font-family="monospace" fill="#60a5fa" text-anchor="middle">fasiondev.github.io/incheon-event</text>

  <!-- 우측 장식 도트 -->
  <circle cx="1050" cy="315" r="6" fill="#3b82f6" opacity="0.8"/>
  <circle cx="1080" cy="295" r="4" fill="#06b6d4" opacity="0.6"/>
  <circle cx="1100" cy="330" r="5" fill="#3b82f6" opacity="0.5"/>
  <circle cx="1070" cy="350" r="3" fill="#06b6d4" opacity="0.7"/>
  <circle cx="1040" cy="290" r="4" fill="#60a5fa" opacity="0.4"/>
</svg>
`;

const outputPath = resolve(__dirname, '../public/og-image.png');
writeFileSync('/tmp/og-image.svg', svg);

await sharp(Buffer.from(svg))
  .png()
  .toFile(outputPath);

console.log('og-image.png 생성 완료:', outputPath);
