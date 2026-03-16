"use client";

import { useState, useCallback } from "react";

type MoodType = "calm" | "happy" | "energetic" | "sad" | "neutral";

interface MusicTrack {
  url: string;
  name: string;
}

export default function TtsGenerator() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mixing, setMixing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsUrl, setTtsUrl] = useState<string | null>(null);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodType>("neutral");
  const [musicVolume, setMusicVolume] = useState(0.3);

  const generateTts = useCallback(async () => {
    if (!text.trim()) {
      setError("텍스트를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    if (ttsUrl?.startsWith("blob:")) URL.revokeObjectURL(ttsUrl);
    setTtsUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "TTS 생성에 실패했습니다.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setTtsUrl(url);

      const musicRes = await fetch(
        `/api/music?text=${encodeURIComponent(text)}&mood=${selectedMood}`
      );
      const musicData = await musicRes.json();
      setMusicTracks(musicData.tracks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [text, selectedMood]);

  const mixAndDownload = useCallback(
    async (musicUrl: string) => {
      if (!ttsUrl) return;

      setMixing(true);
      setError(null);

      try {
        const [ttsResponse, musicResponse] = await Promise.all([
          fetch(ttsUrl),
          fetch(musicUrl),
        ]);

        if (!ttsResponse.ok || !musicResponse.ok) {
          throw new Error("오디오를 불러올 수 없습니다.");
        }

        const ttsBlob = await ttsResponse.blob();
        const musicBlob = await musicResponse.blob();

        const ttsArrayBuffer = await ttsBlob.arrayBuffer();
        const musicArrayBuffer = await musicBlob.arrayBuffer();

        const audioContext = new AudioContext();

        const [ttsBuffer, musicBuffer] = await Promise.all([
          audioContext.decodeAudioData(ttsArrayBuffer.slice(0)),
          audioContext.decodeAudioData(musicArrayBuffer.slice(0)),
        ]);

        const duration = Math.max(ttsBuffer.duration, musicBuffer.duration);
        const sampleRate = ttsBuffer.sampleRate;
        const numChannels = Math.max(ttsBuffer.numberOfChannels, 2);

        const offlineContext = new OfflineAudioContext(
          numChannels,
          duration * sampleRate,
          sampleRate
        );

        const ttsSource = offlineContext.createBufferSource();
        ttsSource.buffer = ttsBuffer;
        ttsSource.connect(offlineContext.destination);
        ttsSource.start(0);

        const musicSource = offlineContext.createBufferSource();
        musicSource.buffer = musicBuffer;
        const musicGain = offlineContext.createGain();
        musicGain.gain.value = musicVolume;
        musicSource.connect(musicGain);
        musicGain.connect(offlineContext.destination);
        musicSource.start(0);
        musicSource.loop = true;

        const renderedBuffer = await offlineContext.startRendering();

        const wavBlob = audioBufferToWav(renderedBuffer);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tts-with-music-${Date.now()}.wav`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "믹싱에 실패했습니다.");
      } finally {
        setMixing(false);
      }
    },
    [ttsUrl, musicVolume]
  );

  const downloadTtsOnly = useCallback(() => {
    if (!ttsUrl) return;
    const a = document.createElement("a");
    a.href = ttsUrl;
    a.download = `tts-${Date.now()}.wav`;
    a.target = "_blank";
    a.click();
  }, [ttsUrl]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <label
          htmlFor="tts-text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          읽을 텍스트
        </label>
        <textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="한국어 텍스트를 입력하세요..."
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          maxLength={5000}
        />
        <p className="mt-1 text-sm text-gray-500">{text.length} / 5000자</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          배경 음악 분위기
        </label>
        <div className="flex flex-wrap gap-2">
          {(["neutral", "calm", "happy", "energetic", "sad"] as MoodType[]).map(
            (mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMood === mood
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {
                  {
                    neutral: "자동",
                    calm: "평화로운",
                    happy: "밝은",
                    energetic: "활기찬",
                    sad: "감성적인",
                  }[mood]
                }
              </button>
            )
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={generateTts}
        disabled={loading}
        className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "음성 생성 중..." : "음성 생성하기"}
      </button>

      {ttsUrl && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">생성된 음성</h3>

          <div className="flex items-center gap-4">
            <audio controls src={ttsUrl} className="flex-1 max-w-full" />
            <button
              type="button"
              onClick={downloadTtsOnly}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
            >
              TTS만 다운로드
            </button>
          </div>

          {musicTracks.length > 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배경 음악 볼륨: {Math.round(musicVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  배경 음악과 믹싱하여 다운로드
                </h4>
                <div className="flex flex-wrap gap-2">
                  {musicTracks.map((track, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => mixAndDownload(track.url)}
                      disabled={mixing}
                      className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {mixing ? "믹싱 중..." : track.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);
  let pos = 0;

  const writeString = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(pos++, str.charCodeAt(i));
    }
  };

  writeString("RIFF");
  view.setUint32(pos, bufferLength - 8, true);
  pos += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(pos, 16, true);
  pos += 4;
  view.setUint16(pos, format, true);
  pos += 2;
  view.setUint16(pos, numChannels, true);
  pos += 2;
  view.setUint32(pos, sampleRate, true);
  pos += 4;
  view.setUint32(pos, sampleRate * blockAlign, true);
  pos += 4;
  view.setUint16(pos, blockAlign, true);
  pos += 2;
  view.setUint16(pos, bitDepth, true);
  pos += 2;
  writeString("data");
  view.setUint32(pos, dataLength, true);
  pos += 4;

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  const dataStart = 44;
  for (let i = 0; i < buffer.length; i++) {
    const samplePos = dataStart + i * blockAlign;
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(samplePos + c * bytesPerSample, int16, true);
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
