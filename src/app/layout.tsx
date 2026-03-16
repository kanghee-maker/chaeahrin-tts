import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "채아린 TTS - 한국어 음성 생성",
  description: "MeloTTS 기반 한국어 TTS 웹 서비스. 텍스트를 입력하면 음성 파일을 생성하고, 배경 음악과 믹싱하여 다운로드할 수 있습니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
