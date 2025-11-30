# Lorem Picsum Museum 🖼️

Lorem Picsum API를 활용한 가상 사진 전시회 웹사이트입니다. 랜덤 이미지 100개를 갤러리 형식으로 전시하며, 페이지네이션을 통해 편리하게 탐색할 수 있습니다.

## 🎨 주요 기능

- **100개의 랜덤 이미지**: Lorem Picsum API를 통해 고품질 랜덤 이미지 제공
- **페이지네이션**: 페이지당 10개씩, 총 10페이지로 구성
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에 최적화
- **현대적인 UI**: shadcn/ui 컴포넌트와 Claude 테마 적용
- **부드러운 애니메이션**: 호버 효과 및 페이지 전환 애니메이션
- **완전한 네비게이션**: 헤더와 푸터 포함

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Theme**: TweakCN Claude Theme
- **Icons**: Lucide React
- **Image API**: Lorem Picsum (https://picsum.photos)

## 🚀 시작하기

### 설치

\`\`\`bash

# 의존성 설치

npm install
\`\`\`

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

\`\`\`bash

# 프로덕션 빌드

npm run build

# 프로덕션 서버 실행

npm start
\`\`\`

## 📁 프로젝트 구조

\`\`\`
lorempicsum_museum/
├── app/
│ ├── globals.css # 전역 스타일
│ ├── layout.tsx # 루트 레이아웃
│ └── page.tsx # 메인 페이지
├── components/
│ ├── ui/ # shadcn UI 컴포넌트
│ ├── header.tsx # 헤더 컴포넌트
│ ├── footer.tsx # 푸터 컴포넌트
│ └── gallery.tsx # 갤러리 컴포넌트
└── next.config.ts # Next.js 설정
\`\`\`

## 🎯 주요 컴포넌트

### Gallery

- 100개의 이미지를 관리
- 페이지네이션 로직 구현
- 반응형 그리드 레이아웃 (모바일 1열 ~ 데스크톱 5열)
- 이미지 호버 효과 및 확대 애니메이션

### Header

- 브랜드 로고 및 네비게이션
- 모바일 반응형 메뉴
- Sticky 헤더 (스크롤 시 고정)

### Footer

- 박물관 정보
- 전시 정보
- 방문 안내
- 연락처

## 🎨 디자인 특징

- **Claude 테마**: TweakCN의 Claude 테마로 세련된 컬러 팔레트
- **반응형 그리드**: 화면 크기에 따라 자동 조정되는 그리드
- **부드러운 애니메이션**: 호버 시 이미지 확대 및 카드 상승 효과
- **페이지네이션**: 직관적인 페이지 이동 UI

## 📱 반응형 브레이크포인트

- **Mobile**: 1열 (< 640px)
- **Tablet**: 2-3열 (640px - 1024px)
- **Desktop**: 4-5열 (> 1024px)

## 🌐 배포

이 프로젝트는 다음 플랫폼에 쉽게 배포할 수 있습니다:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [AWS Amplify](https://aws.amazon.com/amplify/)

## 📄 라이선스

MIT License

## 👨‍💻 개발자

AI Assistant와 함께 만든 프로젝트입니다.

---

**즐거운 관람 되세요! 🎨**
