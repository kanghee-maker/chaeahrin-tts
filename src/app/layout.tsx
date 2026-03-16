import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우세림의 TTS 생성기",
  description: "우세림의 TTS 생성기 - Microsoft Edge TTS 기반 무료 한국어 음성 생성, 배경 음악 믹싱",
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
