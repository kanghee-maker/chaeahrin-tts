import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const res = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Wooselim-TTS/1.0",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch audio" },
        { status: res.status }
      );
    }

    const blob = await res.blob();
    const contentType = res.headers.get("Content-Type") || "audio/mpeg";
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Proxy audio error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
