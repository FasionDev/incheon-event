# 인천이벤트 사이트 계획

사이트: https://fasiondev.github.io/incheon-event

---

## 0단계 — 기획 및 기술 스택 결정

### 요구사항
- 인천시청, 각 구청, 공공기관에서 주최하는 행사를 한눈에 보여줄 것
- 행사 이름, 날짜, 장소, 온/오프라인 여부를 표시할 것
- 모바일에서도 잘 보일 것
- 검색 유입을 위한 SEO를 갖출 것

### 기술 스택
- **프레임워크**: Next.js (App Router, `output: 'export'`)
- **데이터**: `events.json` 정적 파일로 관리
- **배포**: GitHub Pages (무료)

---

## 1단계 — 사이트 구현 및 배포

### [x] 프로젝트 초기 세팅
- Next.js 프로젝트 생성 (App Router, TypeScript)
- `output: 'export'` 설정 → 정적 빌드
- GitHub 저장소 생성 및 GitHub Pages 배포 설정

### [x] 데이터 수집 (크롤링)
- 인천시청, 각 구청, 공식 기관 행사 페이지 크롤링
- `events.json` 파일로 정리
- 항목: 행사명, 주최기관, 날짜, 장소, 온/오프라인 여부, 링크

### [x] 메인 화면 구현
- 행사 목록 카드 UI
- 날짜순 정렬
- 모바일 반응형

### [x] 제보 시스템
- GitHub Issue 템플릿 작성 (행사 제보용)
- 사이트에 제보 링크 연결

### [x] 배포
- GitHub Actions로 자동 빌드 및 Pages 배포 설정

---

## 2단계 — 측정 기반 만들기

### [x] Google Analytics 연결
- GA4 계정 생성 후 추적 코드를 `src/app/layout.tsx`에 삽입
- 방문자 수, 유입 경로, 체류 시간 측정 시작
- **목표**: 얼마나 오는지 알아야 광고 효과를 측정할 수 있음
- Script 태그 위치 버그 수정 (head → body, afterInteractive 정상 동작)

### [ ] Google Search Console 등록
- 사이트를 구글에 직접 신고 → 검색 결과에 더 빠르게 노출
- sitemap.xml 제출
- **목표**: "인천 행사", "인천 축제 2026" 키워드로 검색 유입

### [ ] 네이버 서치어드바이저 등록
- 한국 사용자는 네이버 검색 비중이 높음
- **목표**: 네이버 검색에도 노출

---

## 4단계 — SEO 강화

### [ ] meta 태그 보강
- `layout.tsx`에 title, description, og:image 설정
- 키워드: "인천 행사", "인천 축제", "인천 이벤트", "인천 문화행사"

### [ ] sitemap.xml 생성
- 정적 사이트이므로 수동 또는 스크립트로 생성
- Google Search Console에 제출

### [ ] 행사 데이터 확충
- 현재 14개 행사 → 인천시 공공 행사 페이지 크롤링으로 50개 이상 목표
- 행사 수가 늘수록 검색 키워드 커버리지 확대
- 스크립트 자동화로 주기적 업데이트 체계 마련

### [x] slug 기반 URL 적용 (SEO 강화)
- `/events/11` → `/events/인천펜타포트-락-페스티벌` 형식으로 변경
- 행사명이 URL에 포함되어 구글 검색 결과 노출 향상
- sitemap에 행사 상세 페이지 전체 포함

---

## 5단계 — 홍보 채널 운영

### [ ] 티스토리 블로그
- 바이브코딩 체험기 형식으로 사이트 제작 과정 공유
- **효과**: 개발자 커뮤니티 유입 + 백링크

### [ ] 네이버 블로그
- "2026 인천 행사 모음", "인천 축제 일정" 등 검색 키워드 중심 글 작성
- 사이트 링크 포함
- **효과**: 단기 검색 유입에 가장 효과적

### [ ] 인스타그램
- 행사 포스터 이미지 + 날짜 정보 카드뉴스 형식으로 게시
- 해시태그: #인천행사 #인천축제 #인천이벤트 #인천문화
- **효과**: 장기적 팔로워 기반 구축

### [ ] 카카오톡 / 지역 커뮤니티
- 인천 지역 오픈채팅, 맘카페, 에브리타임에 공유
- **효과**: 즉각적인 유입

---

## 7단계 — 크롤링 AI 이미지 검증 (예정)

> GitHub Actions에서 **GitHub Models API** (무료, GITHUB_TOKEN만 필요)를 사용해
> 수집된 썸네일이 행사에 맞는 이미지인지 AI가 자동 판별.

### 목표
- 크롤링으로 자동 수집된 이미지 중 부적절한 것(기관 로고, 관련없는 사진 등)을 제거
- 사람이 직접 확인하지 않아도 품질 유지

### 구현 방법

#### 1. GitHub Models API (Vision) 사용
- 모델: `gpt-4o-mini` (Vision 지원, 무료 티어 존재)
- 인증: `GITHUB_TOKEN`만 사용 (별도 API 키 불필요)
- 엔드포인트: `https://models.inference.ai.azure.com`

```javascript
// scripts/crawl/validateImage.js
const { AzureOpenAI } = require('openai');

async function isValidEventThumbnail(imageUrl, eventTitle) {
  const client = new AzureOpenAI({
    endpoint: 'https://models.inference.ai.azure.com',
    apiKey: process.env.GITHUB_TOKEN,
    apiVersion: '2024-08-01-preview',
  });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl } },
        { type: 'text', text: `이 이미지가 "${eventTitle}" 행사의 포스터나 썸네일로 적합한가요? "yes" 또는 "no"만 답하세요.` },
      ],
    }],
    max_tokens: 10,
  });

  return response.choices[0].message.content?.toLowerCase().includes('yes') ?? false;
}
```

#### 2. auto.js 파이프라인에 통합
```
크롤링 → URL 유효성 검사(현재) → AI 이미지 판별(신규) → events.json 병합
```

#### 3. GitHub Actions 설정
- `GITHUB_TOKEN`은 Actions에서 자동 제공 (추가 설정 없음)
- `openai` npm 패키지 추가 필요

### 비용 및 제약
- GitHub Models 무료 티어: 하루 150 요청 (Vision)
- 하루 크롤링되는 신규 행사가 통상 5~20개 이내 → 무료 티어로 충분
- 이미지가 없는 행사는 검증 스킵

### TODO
- [ ] `npm install openai` 추가
- [ ] `scripts/crawl/validateImage.js` 작성
- [ ] `auto.js`에 AI 검증 단계 통합
- [ ] GitHub Actions workflow에 GITHUB_TOKEN 환경변수 전달

---

## 6단계 — 디자인 개선

### [x] 라이트/다크 모드
- 시스템 설정 자동 감지 + 수동 토글 버튼
- CSS 변수로 색상 체계 정리
- next-themes + CSS 변수 방식으로 구현, 헤더에 ☀️/🌙 토글 버튼 추가

### [ ] 전체 UI 리뉴얼
- 행사 카드 디자인 개선 (이미지 비율, 그림자, hover 효과)
- 타이포그래피 정리 (폰트 크기 계층, 행간)
- 색상 팔레트 정의 (인천 브랜드 컬러 활용)

### [ ] 사용성 개선
- 행사 필터 (날짜순 / 마감임박순 / 카테고리별)
- 검색 기능
- 모바일 하단 내비게이션

### [ ] 로딩 / 빈 상태 처리
- 스켈레톤 로딩 UI
- 행사 없을 때 빈 상태 화면

### [ ] 애니메이션
- 카드 진입 애니메이션 (fade-in, slide-up)
- 페이지 전환 효과

### [ ] 접근성 (a11y)
- 키보드 네비게이션
- 스크린리더 대응 (aria 속성)
- 색상 대비 기준 충족

---

## 진행 현황

| 항목 | 상태 |
|---|---|
| 요구사항 정의 및 기술 스택 결정 | ✅ 완료 |
| 사이트 구현 (Next.js + events.json) | ✅ 완료 |
| 사이트 배포 (GitHub Pages) | ✅ 완료 |
| 저장소 FasionDev 계정으로 이전 | ✅ 완료 |
| 이미지 폴백 처리 | ✅ 완료 |
| Google Analytics 연결 (G-WYQYGC8JH2) | ✅ 완료 (Script 버그 수정 포함) |
| Google Search Console 등록 + sitemap 제출 | ✅ 완료 |
| 네이버 서치어드바이저 등록 | ⏭ 스킵 (GitHub Pages 공유 도메인 한계) |
| meta 태그 보강 (keywords, OG, Twitter Card) | ✅ 완료 |
| OG 이미지 생성 | ✅ 완료 |
| 파비콘 🌊 변경 | ✅ 완료 |
| 티스토리 블로그 포스팅 (바이브코딩 체험기) | ✅ 완료 |
| 인스타그램 포스팅 (사이트 홍보 카드) | ✅ 완료 |
| 네이버 블로그 운영 | ⬜ 예정 |
| 라이트/다크 모드 토글 | ✅ 완료 |
| 소래포구축제 데이터 추가 (2026-10-02) | ✅ 완료 |
| 행사 상태별 탭 (진행 예정/종료됨/전체) | ✅ 완료 |
| slug 기반 URL 적용 (SEO 강화) | ✅ 완료 |
| 행사 데이터 확충 (50개 이상 목표) | ⬜ 예정 |
| 크롤러 선택자 수정 (ifac, itour) | ✅ 완료 |
| 한국관광공사 API 크롤러 추가 | ✅ 완료 (TOUR_API_KEY 시크릿 등록 필요) |
| GitHub Actions 자동 크롤링 (매일 00:00 KST) | ✅ 완료 |
| AI 이미지 검증 (GitHub Models) | ⬜ 예정 (7단계) |
