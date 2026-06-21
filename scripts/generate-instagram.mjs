import sharp from 'sharp';

const svg = `
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:0.9"/>
      <stop offset="100%" style="stop-color:#0f2744;stop-opacity:1"/>
    </linearGradient>
  </defs>

  <!-- 배경 -->
  <rect width="1080" height="1080" fill="url(#bg)"/>

  <!-- 배경 장식 원 -->
  <circle cx="950" cy="150" r="380" fill="#1e3a5f" opacity="0.4"/>
  <circle cx="100" cy="950" r="300" fill="#0f4c75" opacity="0.3"/>

  <!-- 파도 장식 -->
  <path d="M0 820 Q135 790 270 808 Q405 826 540 800 Q675 774 810 792 Q945 810 1080 784 L1080 1080 L0 1080 Z" fill="#1e3a5f" opacity="0.5"/>
  <path d="M0 870 Q180 845 360 860 Q540 875 720 850 Q900 825 1080 845 L1080 1080 L0 1080 Z" fill="#0f4c75" opacity="0.4"/>

  <!-- 상단 태그 -->
  <rect x="80" y="80" width="220" height="50" rx="25" fill="url(#accent)" opacity="0.9"/>
  <text x="190" y="114" font-size="22" font-family="sans-serif" fill="white" text-anchor="middle" font-weight="bold">인천 행사 정보</text>

  <!-- 파도 아이콘 (SVG 도형) -->
  <path d="M80 240 Q120 210 160 240 Q200 270 240 240 Q280 210 320 240 Q360 270 400 240" stroke="#3b82f6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M80 270 Q120 240 160 270 Q200 300 240 270 Q280 240 320 270 Q360 300 400 270" stroke="#06b6d4" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.6"/>

  <!-- 메인 타이틀 -->
  <text x="80" y="390" font-size="100" font-weight="bold" font-family="sans-serif" fill="white" letter-spacing="-2">인천이벤트</text>

  <!-- 서브 타이틀 -->
  <text x="82" y="455" font-size="38" font-family="sans-serif" fill="#94a3b8" letter-spacing="1">인천의 모든 행사를 한눈에</text>

  <!-- 구분선 -->
  <rect x="80" y="495" width="920" height="2" rx="1" fill="url(#accent)" opacity="0.5"/>

  <!-- 특징 카드 3개 -->
  <!-- 카드 1 -->
  <rect x="80" y="525" width="270" height="150" rx="16" fill="url(#card)" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.5"/>
  <!-- 빌딩 아이콘 -->
  <rect x="160" y="548" width="50" height="55" rx="3" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
  <rect x="170" y="558" width="10" height="12" fill="#60a5fa"/>
  <rect x="190" y="558" width="10" height="12" fill="#60a5fa"/>
  <rect x="170" y="578" width="10" height="12" fill="#60a5fa"/>
  <rect x="190" y="578" width="10" height="12" fill="#60a5fa"/>
  <rect x="177" y="590" width="16" height="13" fill="#60a5fa"/>
  <text x="195" y="635" font-size="22" font-family="sans-serif" fill="white" text-anchor="middle" font-weight="bold">공식 기관</text>
  <text x="195" y="660" font-size="19" font-family="sans-serif" fill="#94a3b8" text-anchor="middle">시청·구청 행사</text>

  <!-- 카드 2 -->
  <rect x="405" y="525" width="270" height="150" rx="16" fill="url(#card)" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.5"/>
  <!-- 달력 아이콘 -->
  <rect x="515" y="547" width="50" height="48" rx="5" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
  <rect x="515" y="547" width="50" height="15" rx="3" fill="#3b82f6" opacity="0.6"/>
  <line x1="527" y1="542" x2="527" y2="552" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="553" y1="542" x2="553" y2="552" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="523" y="570" width="8" height="8" rx="1" fill="#60a5fa"/>
  <rect x="537" y="570" width="8" height="8" rx="1" fill="#60a5fa"/>
  <rect x="551" y="570" width="8" height="8" rx="1" fill="#60a5fa"/>
  <rect x="523" y="584" width="8" height="8" rx="1" fill="#60a5fa" opacity="0.5"/>
  <rect x="537" y="584" width="8" height="8" rx="1" fill="#60a5fa" opacity="0.5"/>
  <text x="540" y="635" font-size="22" font-family="sans-serif" fill="white" text-anchor="middle" font-weight="bold">날짜 정보</text>
  <text x="540" y="660" font-size="19" font-family="sans-serif" fill="#94a3b8" text-anchor="middle">일정 한눈에 확인</text>

  <!-- 카드 3 -->
  <rect x="730" y="525" width="270" height="150" rx="16" fill="url(#card)" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.5"/>
  <!-- 핀 아이콘 -->
  <ellipse cx="865" cy="562" rx="18" ry="18" fill="none" stroke="#60a5fa" stroke-width="2.5"/>
  <circle cx="865" cy="562" r="6" fill="#60a5fa"/>
  <line x1="865" y1="580" x2="865" y2="597" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
  <text x="865" y="635" font-size="22" font-family="sans-serif" fill="white" text-anchor="middle" font-weight="bold">장소 안내</text>
  <text x="865" y="660" font-size="19" font-family="sans-serif" fill="#94a3b8" text-anchor="middle">온/오프라인 구분</text>

  <!-- 하단 설명 -->
  <text x="540" y="745" font-size="30" font-family="sans-serif" fill="#cbd5e1" text-anchor="middle">인천시 축제 · 문화 · 체육 · 공연 행사</text>
  <text x="540" y="788" font-size="30" font-family="sans-serif" fill="#cbd5e1" text-anchor="middle">무료로 모아서 알려드립니다</text>

  <!-- URL 뱃지 -->
  <rect x="190" y="825" width="700" height="58" rx="29" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="540" y="862" font-size="26" font-family="monospace" fill="#60a5fa" text-anchor="middle">fasiondev.github.io/incheon-event</text>

  <!-- 하단 안내 -->
  <text x="540" y="950" font-size="26" font-family="sans-serif" fill="#475569" text-anchor="middle">프로필 링크에서 바로 확인하세요</text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('scripts/instagram-card.png');

console.log('instagram-card.png 생성 완료');
