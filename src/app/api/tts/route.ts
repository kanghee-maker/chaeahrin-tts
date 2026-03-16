import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "edge-tts-universal";

export const maxDuration = 60;

const KOREAN_VOICE = "ko-KR-SunHiNeural";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: "텍스트를 입력해주세요." },
        { status: 400 }
      );
    }

    if (trimmedText.length > 5000) {
      return NextResponse.json(
        { error: "텍스트는 5000자 이하여야 합니다." },
        { status: 400 }
      );
    }

    const tts = new EdgeTTS(trimmedText, KOREAN_VOICE, {
      rate: "+10%",
      volume: "+0%",
      pitch: "+0Hz",
    });

    const result = await tts.synthesize();
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename=tts.mp3",
      },
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "TTS 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
