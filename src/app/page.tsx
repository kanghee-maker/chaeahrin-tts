import TtsGenerator from "./components/TtsGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            채아린 TTS
          </h1>
          <p className="text-gray-600">
            MeloTTS 기반 한국어 음성 생성 · 배경 음악 믹싱
          </p>
        </div>
        <TtsGenerator />
      </main>
    </div>
  );
}
