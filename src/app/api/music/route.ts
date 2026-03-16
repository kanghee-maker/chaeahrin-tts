import { NextRequest, NextResponse } from "next/server";

export type MoodType = "calm" | "happy" | "energetic" | "sad" | "neutral";

// public/music/ 내 로컬 샘플 (scripts/generate-music-samples.js로 생성)
const MUSIC_BY_MOOD: Record<MoodType, { url: string; name: string }[]> = {
  calm: [
    { url: "/music/calm.wav", name: "평화로운 톤" },
    { url: "/music/neutral.wav", name: "잔잔한 앰비언트" },
  ],
  happy: [
    { url: "/music/happy.wav", name: "밝은 멜로디" },
    { url: "/music/energetic.wav", name: "기분 좋은 톤" },
  ],
  energetic: [
    { url: "/music/energetic.wav", name: "활기찬 톤" },
    { url: "/music/happy.wav", name: "업비트" },
  ],
  sad: [
    { url: "/music/sad.wav", name: "감성적인 톤" },
    { url: "/music/calm.wav", name: "잔잔한" },
  ],
  neutral: [
    { url: "/music/neutral.wav", name: "중립 배경음" },
    { url: "/music/calm.wav", name: "부드러운" },
  ],
};

const MOOD_KEYWORDS: Record<MoodType, string[]> = {
  calm: ["평화", "잔잔", "고요", "조용", "휴식", "명상", "calm", "peace"],
  happy: ["기쁘", "행복", "즐거", "신나", "웃", "happy", "joy", "fun"],
  energetic: ["열정", "에너지", "활기", "동기", "힘", "energy", "power"],
  sad: ["슬프", "우울", "아쉽", "그리", "눈물", "sad", "sorrow"],
  neutral: [],
};

function detectMoodFromText(text: string): MoodType {
  const lowerText = text.toLowerCase();

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (mood === "neutral") continue;
    if (keywords.some((kw) => lowerText.includes(kw))) {
      return mood as MoodType;
    }
  }

  return "neutral";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mood = (searchParams.get("mood") || "neutral") as MoodType;
  const text = searchParams.get("text") || "";

  const validMoods: MoodType[] = ["calm", "happy", "energetic", "sad", "neutral"];
  const resolvedMood = validMoods.includes(mood)
    ? mood
    : text
      ? detectMoodFromText(text)
      : "neutral";

  const tracks = MUSIC_BY_MOOD[resolvedMood] || MUSIC_BY_MOOD.neutral;

  return NextResponse.json({
    mood: resolvedMood,
    tracks,
  });
}
