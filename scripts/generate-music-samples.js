/**
 * 배경 음악 샘플 생성 (10초, 소프트 앰비언트 톤)
 * public/music/ 폴더에 WAV 파일 생성
 * 더 나은 음악은 public/music/에 직접 MP3/WAV 추가 가능
 */
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;
const DURATION = 10;
const NUM_SAMPLES = SAMPLE_RATE * DURATION;

function createWavWithTone(freq, volume, filename, options = {}) {
  const { secondFreq = 0, secondAmp = 0 } = options;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const dataSize = NUM_SAMPLES * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);
  let pos = 44;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  header.copy(buffer, 0);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let sample = Math.sin(2 * Math.PI * freq * t) * volume * 0.25;
    if (secondFreq) {
      sample += Math.sin(2 * Math.PI * secondFreq * t) * secondAmp * 0.15;
    }
    const envelope = 0.5 + 0.5 * Math.sin(t * 0.3);
    sample *= envelope;
    const int16 = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
    buffer.writeInt16LE(int16, pos);
    pos += 2;
  }

  const dir = path.join(__dirname, "..", "public", "music");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
  console.log(`Created ${filename}`);
}

createWavWithTone(220, 0.6, "calm.wav", { secondFreq: 277, secondAmp: 0.4 });
createWavWithTone(330, 0.5, "happy.wav", { secondFreq: 440, secondAmp: 0.3 });
createWavWithTone(440, 0.45, "energetic.wav", { secondFreq: 554, secondAmp: 0.35 });
createWavWithTone(165, 0.4, "sad.wav", { secondFreq: 220, secondAmp: 0.25 });
createWavWithTone(277, 0.5, "neutral.wav", { secondFreq: 330, secondAmp: 0.3 });
