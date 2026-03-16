import { NextRequest, NextResponse } from "next/server";

export type MoodType = "calm" | "happy" | "energetic" | "sad" | "neutral";

// Mixkit & Pixabay 무료 음악 (CC0/무료 사용 가능)
const MUSIC_BY_MOOD: Record<MoodType, { url: string; name: string }[]> = {
  calm: [
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
      name: "평화로운 풍경",
    },
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-ambient-forest-442.mp3",
      name: "잔잔한 숲",
    },
  ],
  happy: [
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3",
      name: "밝은 멜로디",
    },
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-gathering-in-the-sun-444.mp3",
      name: "기분 좋은 날",
    },
  ],
  energetic: [
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
      name: "업비트 음악",
    },
  ],
  sad: [
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-emotional-piano-2060.mp3",
      name: "감성적인 피아노",
    },
  ],
  neutral: [
    {
      url: "https://cdn.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
      name: "중립 배경음",
    },
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
