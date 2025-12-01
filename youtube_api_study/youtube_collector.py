"""
YouTube 채널의 동영상과 댓글 정보를 수집하는 스크립트
"""
import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime

# .env 파일에서 API 키 로드
load_dotenv()
API_KEY = os.getenv('YOUTUBE_API_KEY')

if not API_KEY or API_KEY == 'your_api_key_here':
    raise ValueError("API 키가 설정되지 않았습니다. .env 파일에 YOUTUBE_API_KEY를 설정하세요.")

# YouTube API 클라이언트 생성
youtube = build('youtube', 'v3', developerKey=API_KEY)


def get_channel_id_from_handle(handle):
    """
    채널 핸들(@nomadcoders)을 채널 ID로 변환
    
    Args:
        handle: 채널 핸들 (예: '@nomadcoders' 또는 'nomadcoders')
    
    Returns:
        채널 ID
    """
    # @ 제거
    if handle.startswith('@'):
        handle = handle[1:]
    
    try:
        # search API를 사용하여 채널 검색
        request = youtube.search().list(
            part='snippet',
            q=handle,
            type='channel',
            maxResults=5
        )
        response = request.execute()
        
        if 'items' in response and len(response['items']) > 0:
            # 정확히 일치하는 채널 찾기
            for item in response['items']:
                custom_url = item['snippet'].get('customUrl', '').lower()
                channel_title = item['snippet']['title'].lower()
                
                # 채널 핸들 또는 채널명이 일치하는지 확인
                if handle.lower() in custom_url or handle.lower() in channel_title or custom_url.endswith(handle.lower()):
                    channel_id = item['snippet']['channelId']
                    channel_title = item['snippet']['title']
                    print(f"[OK] 채널 발견: {channel_title} (ID: {channel_id})")
                    return channel_id
            
            # 정확히 일치하는 것이 없으면 첫 번째 결과 사용
            channel_id = response['items'][0]['snippet']['channelId']
            channel_title = response['items'][0]['snippet']['title']
            print(f"[OK] 채널 발견: {channel_title} (ID: {channel_id})")
            return channel_id
        else:
            raise ValueError(f"채널 핸들 '{handle}'을(를) 찾을 수 없습니다.")
    except HttpError as e:
        print(f"API 오류 발생: {e}")
        raise


def get_channel_uploads_playlist_id(channel_id):
    """
    채널의 업로드 재생목록 ID 가져오기
    
    Args:
        channel_id: 채널 ID
    
    Returns:
        업로드 재생목록 ID
    """
    try:
        request = youtube.channels().list(
            part='contentDetails',
            id=channel_id
        )
        response = request.execute()
        
        if 'items' in response and len(response['items']) > 0:
            uploads_playlist_id = response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
            print(f"[OK] 업로드 재생목록 ID: {uploads_playlist_id}")
            return uploads_playlist_id
        else:
            raise ValueError("재생목록 ID를 찾을 수 없습니다.")
    except HttpError as e:
        print(f"API 오류 발생: {e}")
        raise


def get_video_ids_from_playlist(playlist_id, max_results=100):
    """
    재생목록에서 동영상 ID 목록 가져오기
    
    Args:
        playlist_id: 재생목록 ID
        max_results: 가져올 최대 동영상 수
    
    Returns:
        동영상 ID 리스트
    """
    video_ids = []
    next_page_token = None
    
    print(f"동영상 ID 수집 중... (최대 {max_results}개)")
    
    try:
        while len(video_ids) < max_results:
            request = youtube.playlistItems().list(
                part='contentDetails',
                playlistId=playlist_id,
                maxResults=min(50, max_results - len(video_ids)),
                pageToken=next_page_token
            )
            response = request.execute()
            
            for item in response['items']:
                video_ids.append(item['contentDetails']['videoId'])
            
            print(f"  -> {len(video_ids)}개 수집됨")
            
            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break
        
        print(f"[OK] 총 {len(video_ids)}개 동영상 ID 수집 완료\n")
        return video_ids[:max_results]
    
    except HttpError as e:
        print(f"API 오류 발생: {e}")
        raise


def get_video_details(video_ids):
    """
    동영상 상세 정보 가져오기 (쇼츠 제외)
    
    Args:
        video_ids: 동영상 ID 리스트
    
    Returns:
        동영상 정보 리스트
    """
    videos_data = []
    
    print("동영상 상세 정보 수집 중... (쇼츠 제외)")
    
    try:
        # 한 번에 최대 50개씩 처리
        for i in range(0, len(video_ids), 50):
            batch_ids = video_ids[i:i+50]
            
            request = youtube.videos().list(
                part='snippet,statistics,contentDetails',
                id=','.join(batch_ids)
            )
            response = request.execute()
            
            for item in response['items']:
                # 동영상 길이 확인 (쇼츠는 60초 이하)
                duration = item['contentDetails']['duration']
                
                # ISO 8601 duration을 초로 변환 (간단한 파싱)
                import re
                # PT1M30S -> 90초, PT10M -> 600초 형식
                match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
                if match:
                    hours = int(match.group(1) or 0)
                    minutes = int(match.group(2) or 0)
                    seconds = int(match.group(3) or 0)
                    total_seconds = hours * 3600 + minutes * 60 + seconds
                    
                    # 60초 이하는 쇼츠로 간주하고 제외
                    if total_seconds <= 60:
                        continue
                
                video_info = {
                    '제목': item['snippet']['title'],
                    '조회수': int(item['statistics'].get('viewCount', 0)),
                    '좋아요수': int(item['statistics'].get('likeCount', 0)),
                    '게시일': item['snippet']['publishedAt'],
                    '_video_id': item['id']  # 댓글 수집용 (CSV에는 저장 안 됨)
                }
                videos_data.append(video_info)
            
            print(f"  -> {len(videos_data)}개 처리됨 (쇼츠 제외)")
        
        print(f"[OK] 총 {len(videos_data)}개 동영상 정보 수집 완료\n")
        return videos_data
    
    except HttpError as e:
        print(f"API 오류 발생: {e}")
        raise


def get_video_comments(video_info, max_comments=10):
    """
    특정 동영상의 댓글 가져오기
    
    Args:
        video_info: 동영상 정보 딕셔너리
        max_comments: 가져올 최대 댓글 수
    
    Returns:
        동영상 정보 + 댓글 정보 결합 리스트
    """
    comments_data = []
    
    video_id = video_info['_video_id']
    
    try:
        request = youtube.commentThreads().list(
            part='snippet',
            videoId=video_id,
            maxResults=max_comments,
            order='relevance',  # 인기순 정렬
            textFormat='plainText'
        )
        response = request.execute()
        
        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']
            # 동영상 정보 + 댓글 정보 결합
            combined_info = {
                '동영상제목': video_info['제목'],
                '조회수': video_info['조회수'],
                '좋아요수': video_info['좋아요수'],
                '게시일': video_info['게시일'],
                '댓글내용': comment['textDisplay'],
                '댓글작성자': comment['authorDisplayName'],
                '댓글좋아요수': int(comment.get('likeCount', 0)),
                '댓글작성일': comment['publishedAt']
            }
            comments_data.append(combined_info)
        
        return comments_data
    
    except HttpError as e:
        # 댓글이 비활성화된 경우 등의 오류 처리
        video_title = video_info['제목']
        if e.resp.status == 403:
            print(f"  [WARN] 댓글을 가져올 수 없음 (댓글 비활성화): {video_title[:50]}...")
        else:
            print(f"  [WARN] 댓글 수집 오류: {e}")
        return []


def collect_all_comments(videos_data, max_comments_per_video=10):
    """
    모든 동영상의 댓글 수집 (동영상 정보와 함께)
    
    Args:
        videos_data: 동영상 정보 리스트
        max_comments_per_video: 동영상당 수집할 최대 댓글 수
    
    Returns:
        동영상 정보 + 댓글 정보 결합 리스트
    """
    all_data = []
    total_videos = len(videos_data)
    
    print(f"댓글 수집 중... (총 {total_videos}개 동영상)")
    
    for idx, video in enumerate(videos_data, 1):
        comments = get_video_comments(video, max_comments_per_video)
        all_data.extend(comments)
        
        if idx % 10 == 0:
            print(f"  -> {idx}/{total_videos}개 동영상 처리됨 (데이터 {len(all_data)}개)")
    
    print(f"[OK] 총 {len(all_data)}개 데이터 수집 완료\n")
    return all_data


def save_to_csv(data, filename):
    """
    데이터를 CSV 파일로 저장
    
    Args:
        data: 저장할 데이터 리스트
        filename: 파일명
    """
    df = pd.DataFrame(data)
    # 내부용 컬럼(_로 시작) 제거
    df = df[[col for col in df.columns if not col.startswith('_')]]
    
    # 동일한 동영상의 경우 동영상 정보 중복 제거 (첫 행만 표시)
    if '동영상제목' in df.columns:
        # 동영상 정보 컬럼들
        video_cols = ['동영상제목', '조회수', '좋아요수', '게시일']
        
        # 컬럼을 문자열 타입으로 변환 (숫자 컬럼도 빈칸 표시 가능하도록)
        for col in video_cols:
            df[col] = df[col].astype(str)
        
        # 이전 행과 동일한 동영상이면 빈칸으로 처리
        prev_title = None
        for i in range(len(df)):
            current_title = df.loc[i, '동영상제목']
            if current_title == prev_title:
                for col in video_cols:
                    df.loc[i, col] = ''
            prev_title = current_title
    
    df.to_csv(filename, index=False, encoding='utf-8-sig')
    print(f"[OK] 파일 저장 완료: {filename}")


def main():
    """메인 함수"""
    print("=" * 60)
    print("YouTube 채널 동영상 및 댓글 수집 시작")
    print("=" * 60)
    print()
    
    # 설정
    # 노마드코더 실제 채널 ID (https://www.youtube.com/@nomadcoders)
    CHANNEL_ID = 'UCUpJs89fSBXNolQGOYKn0YQ'
    MAX_VIDEOS = 100
    MAX_COMMENTS_PER_VIDEO = 10
    
    try:
        # 1. 채널 확인 및 업로드 재생목록 ID 가져오기
        print("1단계: 채널 확인")
        channel_id = CHANNEL_ID
        print(f"[OK] 채널 ID: {channel_id}")
        
        # 업로드 재생목록 ID 계산 (UC -> UU)
        uploads_playlist_id = 'UU' + channel_id[2:]
        print(f"[OK] 업로드 재생목록 ID: {uploads_playlist_id}")
        print()
        
        # 2. 동영상 ID 목록 가져오기 (쇼츠 포함, 나중에 필터링)
        print("2단계: 동영상 ID 수집")
        # 쇼츠를 제외하기 위해 더 많이 가져옴 (200개 가져와서 쇼츠 제외 후 100개 확보)
        video_ids = get_video_ids_from_playlist(uploads_playlist_id, 200)
        
        # 3. 동영상 상세 정보 가져오기 (쇼츠 제외)
        print("3단계: 동영상 상세 정보 수집")
        videos_data = get_video_details(video_ids)
        
        # 목표 개수만큼 자르기
        videos_data = videos_data[:MAX_VIDEOS]
        print(f"[OK] 최종 {len(videos_data)}개 동영상 선택\n")
        
        # 4. 댓글 수집 (동영상 정보와 함께)
        print("4단계: 댓글 수집")
        all_data = collect_all_comments(videos_data, MAX_COMMENTS_PER_VIDEO)
        
        # 5. CSV 파일로 저장
        print("5단계: CSV 파일 저장")
        save_to_csv(all_data, 'nomadcoders_data.csv')
        
        print()
        print("=" * 60)
        print("[SUCCESS] 모든 작업 완료!")
        print("=" * 60)
        print(f"- 수집된 동영상: {len(videos_data)}개")
        print(f"- 수집된 데이터: {len(all_data)}개 (동영상 정보 + 댓글)")
        print(f"- 저장된 파일:")
        print(f"  - nomadcoders_data.csv")
        
    except Exception as e:
        print()
        print("=" * 60)
        print(f"[ERROR] 오류 발생: {e}")
        print("=" * 60)
        raise


if __name__ == '__main__':
    main()

