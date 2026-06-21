# 🌊 인천이벤트

인천시청, 각 구청, 공공기관의 행사를 모아 소개하는 정적 웹사이트입니다.

**사이트 주소:** https://fasiondev.github.io/incheon-event

---

## 행사 등록 요청

새로운 행사를 제보하고 싶다면 GitHub Issue를 통해 등록 요청을 해주세요.

👉 [행사 등록 요청하기](https://github.com/FasionDev/incheon-event/issues/new?template=event-request.md&title=%5B%EC%9D%B4%EB%B2%A4%ED%8A%B8+%EB%93%B1%EB%A1%9D%5D&labels=event-request)

양식에 맞게 행사명, 날짜, 장소, 출처 링크를 작성해 주시면 검토 후 반영합니다.

---

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하세요.

## 행사 데이터 관리

행사 데이터는 `src/data/events.json` 파일로 관리합니다.

### 크롤링으로 데이터 수집

인천투어, 인천문화재단 등에서 자동으로 행사를 수집합니다.

```bash
# 크롤링 실행 (미리보기 파일 생성)
npm run crawl

# 결과 확인 후 events.json에 병합
npm run crawl:merge
```

### 수동으로 행사 추가

`src/data/events.json`에 아래 형식으로 항목을 추가하세요.

```json
{
  "id": "고유번호",
  "title": "행사명",
  "description": "행사 설명",
  "startDate": "2025-10-01",
  "endDate": "2025-10-03",
  "location": "장소",
  "district": "연수구",
  "category": "축제",
  "tags": ["태그1", "태그2"],
  "sourceUrl": "https://출처URL",
  "imageUrl": "https://이미지URL (선택)",
  "organizer": "주최 기관",
  "isFree": true
}
```

카테고리: `축제` / `문화/공연` / `전시` / `스포츠` / `교육` / `음식` / `환경` / `기타`

## 주기적 유지보수

### 월 1~2회 권장 작업 순서

**1단계 — 새 행사 수집**
```bash
npm run crawl
```
`scripts/crawl/crawl-result.json` 미리보기 파일이 생성됩니다.  
내용을 확인한 뒤 이상 없으면 다음 단계로 넘어갑니다.

**2단계 — events.json에 병합**
```bash
npm run crawl:merge
```

**3단계 — 종료 행사 정리**
```bash
npm run archive
```
종료된 행사를 `events.json`에서 제거하고 `src/data/archive.md`에 이름만 기록합니다.

**4단계 — 배포**
```bash
git add src/data/events.json src/data/archive.md
git commit -m "chore: 행사 데이터 갱신"
git push
```
push 후 GitHub Actions가 자동으로 빌드 및 배포합니다.

---

### 크롤링 소스

| 소스 | URL | 비고 |
|---|---|---|
| 인천투어 | https://itour.incheon.go.kr/ssst/ssst/list.do?pageNm=fstv | 축제·공연·전시 |
| 인천문화재단 | https://ifac.or.kr/culturalInfo/cuturalEvents/performanceSrch/list.do | 공연·행사 |

크롤링 스크립트는 `scripts/crawl/` 에 있습니다.  
선택자가 맞지 않아 0개가 수집된다면 해당 사이트 HTML 구조를 확인하고 선택자를 조정하세요.

---

## 배포

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 및 배포합니다.
