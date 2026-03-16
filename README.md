# 우세림의 TTS 생성기

Microsoft Edge TTS 기반 **완전 무료** 한국어 TTS 웹 서비스. 텍스트를 입력하면 음성 파일을 생성하고, 텍스트 분위기에 맞는 배경 음악과 믹싱하여 다운로드할 수 있습니다.

## 기능

- **한국어 TTS**: Microsoft Edge TTS (edge-tts-universal) - **API 키 없음, 비용 무료**
- **음성 선택**: 여성(선희) / 남성(인준) 음성 선택
- **배경 음악 믹싱**: 텍스트 분위기에 맞는 배경 음악 + TTS 믹싱 다운로드 (로컬 샘플 사용)
- **볼륨 조절**: TTS와 배경 음악 믹싱 시 배경 음악 볼륨 조절 가능
- **다운로드**: TTS만 다운로드 또는 배경 음악 믹싱 후 다운로드

## 기술 스택

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **TTS**: edge-tts-universal (Microsoft Edge TTS, 무료)
- **배경 음악**: 로컬 WAV 샘플 (`npm run generate-music`로 생성, 또는 public/music/에 직접 추가)
- **믹싱**: Web Audio API (클라이언트 사이드)

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (환경 변수 불필요!)
npm run dev
```

http://localhost:3000 에서 확인

## Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 배포 (환경 변수 설정 불필요)

```bash
vercel
```

## 비용

- **완전 무료** - Microsoft Edge TTS는 API 키 없이 무료로 사용 가능

## 라이선스

- edge-tts-universal: AGPL-3.0
- Mixkit 음악: 무료 사용 가능 (CC0)
