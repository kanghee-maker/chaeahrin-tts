import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 60;

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

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN 환경 변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const replicate = new Replicate({ auth: apiToken });

    const output = await replicate.run(
      "cjwbw/melotts:2e4d356f3715d98c183ef097ce2cf410def83ca9fbbdd5f8a32ba056123e6a6f",
      {
        input: {
          text: trimmedText,
          language: "KR",
          speaker: "",
          speed: 1.2,
        },
      }
    );

    let audioUrl: string | undefined;
    if (typeof output === "string") {
      audioUrl = output;
    } else {
      const out = output as { url?: string | (() => string) };
      audioUrl = typeof out?.url === "function" ? out.url() : out?.url;
    }

    if (!audioUrl) {
      return NextResponse.json(
        { error: "TTS 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ audioUrl });
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
