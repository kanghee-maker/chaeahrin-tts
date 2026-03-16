# 채아린 TTS

MeloTTS-Korean 기반 한국어 TTS 웹 서비스. 텍스트를 입력하면 음성 파일을 생성하고, 텍스트 분위기에 맞는 배경 음악과 믹싱하여 다운로드할 수 있습니다.

## 기능

- **한국어 TTS**: Replicate의 MeloTTS-Korean API를 사용한 고품질 음성 합성
- **배경 음악 믹싱**: 텍스트 분위기(평화로운, 밝은, 활기찬, 감성적인)에 맞는 무료 배경 음악 자동 추천
- **볼륨 조절**: TTS와 배경 음악 믹싱 시 배경 음악 볼륨 조절 가능
- **다운로드**: TTS만 다운로드 또는 배경 음악 믹싱 후 다운로드

## 기술 스택

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **TTS**: Replicate API (MeloTTS-Korean)
- **배경 음악**: Mixkit 무료 음악 (CC0)
- **믹싱**: Web Audio API (클라이언트 사이드)

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env.local 생성)
# REPLICATE_API_TOKEN=your_token_here

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

## Vercel 배포

1. [Vercel](https://vercel.com)에 프로젝트 연결
2. 환경 변수 설정:
   - `REPLICATE_API_TOKEN`: [Replicate](https://replicate.com/account/api-tokens)에서 API 토큰 발급
3. 배포

```bash
vercel
```

## Replicate API 비용

- MeloTTS: 약 $0.00073/요청 (1달러당 ~1,369회)
- [Replicate 가격](https://replicate.com/pricing) 참고

## 라이선스

- MeloTTS: MIT
- Mixkit 음악: 무료 사용 가능 (CC0)
