# YouTube 채널 동영상 및 댓글 수집기

YouTube Data API v3를 사용하여 특정 채널의 동영상 정보와 댓글을 수집하는 Python 스크립트입니다.

## 기능

- 📹 채널의 최신 동영상 100개 정보 수집
  - 동영상 ID, 제목, 조회수, 좋아요 수, 게시일
- 💬 각 동영상의 상위 10개 댓글 수집
  - 댓글 내용, 작성자, 댓글 좋아요 수, 작성일
- 📊 결과를 CSV 파일로 저장

## 필요 조건

- Python 3.7 이상
- YouTube Data API v3 키

## 설치 방법

### 1. 저장소 클론 또는 다운로드

```bash
cd youtube_api_study
```

### 2. 필요한 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. API 키 설정

#### 3-1. YouTube Data API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. "YouTube Data API v3" 검색 후 활성화
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키 복사

#### 3-2. 환경 변수 설정

1. `env.example` 파일을 `.env`로 복사:

```bash
cp env.example .env
```

2. `.env` 파일을 열어 API 키 입력:

```
YOUTUBE_API_KEY=여기에_실제_API_키_입력
```

## 사용 방법

### 기본 실행

```bash
python youtube_collector.py
```

### 실행 결과

스크립트 실행 후 다음 파일이 생성됩니다:

1. **nomadcoders_videos.csv** - 동영상 정보
   - 컬럼: 동영상ID, 제목, 조회수, 좋아요수, 게시일

2. **nomadcoders_comments.csv** - 댓글 정보
   - 컬럼: 동영상ID, 동영상제목, 댓글내용, 작성자, 댓글좋아요수, 작성일

### 실행 화면 예시

```
============================================================
YouTube 채널 동영상 및 댓글 수집 시작
============================================================

1단계: 채널 정보 수집
✓ 채널 발견: 노마드 코더 Nomad Coders (ID: UCUpJs89...)

2단계: 업로드 재생목록 확인
✓ 업로드 재생목록 ID: UUUpJs89...

3단계: 동영상 ID 수집
동영상 ID 수집 중... (최대 100개)
  → 50개 수집됨
  → 100개 수집됨
✓ 총 100개 동영상 ID 수집 완료

4단계: 동영상 상세 정보 수집
동영상 상세 정보 수집 중...
  → 50개 처리됨
  → 100개 처리됨
✓ 총 100개 동영상 정보 수집 완료

5단계: 댓글 수집
댓글 수집 중... (총 100개 동영상)
  → 10/100개 동영상 처리됨 (댓글 95개)
  → 20/100개 동영상 처리됨 (댓글 195개)
  ...
✓ 총 987개 댓글 수집 완료

6단계: CSV 파일 저장
✓ 파일 저장 완료: nomadcoders_videos.csv
✓ 파일 저장 완료: nomadcoders_comments.csv

============================================================
✓ 모든 작업 완료!
============================================================
• 수집된 동영상: 100개
• 수집된 댓글: 987개
• 저장된 파일:
  - nomadcoders_videos.csv
  - nomadcoders_comments.csv
```

## 설정 변경

`youtube_collector.py` 파일의 `main()` 함수에서 다음 설정을 변경할 수 있습니다:

```python
# 설정
CHANNEL_HANDLE = 'nomadcoders'  # 채널 핸들 변경
MAX_VIDEOS = 100                 # 수집할 동영상 수
MAX_COMMENTS_PER_VIDEO = 10      # 동영상당 댓글 수
```

## API 할당량 정보

YouTube Data API v3는 일일 할당량 제한이 있습니다 (기본: 10,000 units).

이 스크립트의 예상 할당량 사용량:
- 채널 검색: ~100 units
- 재생목록 조회: 3 units
- 동영상 정보 조회: 2 units
- 댓글 수집: 100 units (동영상 100개 × 1 unit)
- **총합: 약 205 units**

더 많은 동영상이나 댓글을 수집하려면 할당량을 고려하여 조정하세요.

## 주의사항

- ⚠️ `.env` 파일은 절대 공개 저장소에 업로드하지 마세요 (API 키 노출 위험)
- ⚠️ 일부 동영상은 댓글이 비활성화되어 있을 수 있습니다
- ⚠️ API 할당량을 초과하면 다음 날까지 사용할 수 없습니다
- ⚠️ 대량의 데이터를 수집할 경우 시간이 오래 걸릴 수 있습니다

## 문제 해결

### API 키 오류
```
ValueError: API 키가 설정되지 않았습니다.
```
→ `.env` 파일에 올바른 API 키가 설정되어 있는지 확인하세요.

### 할당량 초과 오류
```
HttpError 403: quotaExceeded
```
→ 일일 API 할당량을 초과했습니다. 다음 날 다시 시도하거나 Google Cloud Console에서 할당량 증가를 요청하세요.

### 채널을 찾을 수 없음
```
ValueError: 채널 핸들 'xxx'을(를) 찾을 수 없습니다.
```
→ 채널 핸들이 올바른지 확인하세요. YouTube 채널 URL에서 `@` 뒤의 이름을 사용하세요.

## 라이선스

이 프로젝트는 개인 학습 및 연구 목적으로 사용됩니다.

## 참고 자료

- [YouTube Data API v3 공식 문서](https://developers.google.com/youtube/v3)
- [API 탐색기](https://developers.google.com/youtube/v3/docs)
- [할당량 계산기](https://developers.google.com/youtube/v3/determine_quota_cost)

