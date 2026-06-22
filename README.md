# AWS SAA-C03 문제집 (한국어)

AWS Certified Solutions Architect – Associate (SAA-C03) 시험 대비 한국어 문제 풀이 사이트.
Next.js(App Router) + Tailwind CSS로 구축했으며 **별도의 DB 없이** 동작합니다.

## 기능

- **인터랙티브 퀴즈** (`/quiz`): 문항 수(10/20/50/전체)·출제 순서(랜덤/번호순)를 선택하고, 보기를 고르면 즉시 채점 + 상세 해설 표시. 마지막에 점수 요약.
- **문제 탐색** (`/browse`): 677문항 전체를 검색(문제·보기·해설·번호)하고 해설을 바로 확인.
- **복습** (`/review`): 틀린 문제 / 즐겨찾기한 문제 모아보기.
- **다크 / 라이트 테마** 토글 (`next-themes`).
- **진행상황 저장**: 푼 문제·정답률·오답·즐겨찾기를 브라우저 `localStorage`에 저장 (서버/DB 불필요).

## 데이터

- 문항 데이터: `public/questions.json` (677문항). 클라이언트에서 fetch 후 캐싱.
- 기존 정적 HTML 버전은 `legacy/index.html`에 보존.

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 (전 페이지 정적 prerender)
npm start
```

## 구조

```
app/
  layout.tsx        # 공통 레이아웃 + 테마 Provider + 헤더
  page.tsx          # 홈 대시보드 (진행상황 통계)
  quiz/page.tsx     # 인터랙티브 퀴즈 (설정 → 풀이 → 결과)
  browse/page.tsx   # 검색 + 페이지네이션 탐색
  review/page.tsx   # 오답 / 즐겨찾기 복습
components/
  Header.tsx        # 네비게이션
  ThemeToggle.tsx   # 다크/라이트 토글
  QuestionCard.tsx  # 문항 카드 (quiz / study 모드)
lib/
  types.ts          # Question 타입 + 정답 정규화
  useQuestions.ts   # questions.json 로딩 + 캐싱 훅
  useProgress.ts    # localStorage 진행상황 훅
```
