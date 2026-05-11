require("dotenv").config();
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

ffmpeg.setFfmpegPath(ffmpegPath);

const INPUT_FOLDER = process.env.INPUT_FOLDER || process.argv[2];
const WHISPER_MODEL = process.env.WHISPER_MODEL || "small";
const SUPPORTED_EXTENSIONS = [".m4a", ".mp4", ".mp3", ".wav", ".ogg", ".flac", ".aac"];

if (!INPUT_FOLDER) {
  console.error("❌ No input folder specified. Set INPUT_FOLDER in .env or pass it as an argument.");
  process.exit(1);
}

if (!fs.existsSync(INPUT_FOLDER)) {
  console.error(`❌ Folder not found: ${INPUT_FOLDER}`);
  process.exit(1);
}

// Convert any audio/video file to a 16kHz mono WAV for Whisper
function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("pcm_s16le")
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .save(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
}

// Transcribe a WAV file using local Python Whisper
function transcribeWithWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    const childEnv = {
      ...process.env,
      // Expose bundled ffmpeg binary directory so Whisper's internal load_audio can find it
      FFMPEG_BIN_DIR: path.dirname(ffmpegPath),
      // Force UTF-8 stdout so Cyrillic text isn't mangled by Windows cp1252
      PYTHONIOENCODING: "utf-8",
    };
    execFile("py", ["transcribe.py", audioPath, WHISPER_MODEL], { env: childEnv }, (err, stdout, stderr) => {
      if (err) {
        reject(stderr || err.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function processFile(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const outputTxt = path.join(INPUT_FOLDER, `${baseName}.txt`);
  const tempWav = path.join(INPUT_FOLDER, `_tmp_${baseName}.wav`);

  if (fs.existsSync(outputTxt)) {
    console.log(`  [skip] ${baseName}.txt already exists`);
    return;
  }

  try {
    console.log(`  [*] Converting: ${path.basename(filePath)}`);
    await convertToWav(filePath, tempWav);

    console.log(`  [*] Transcribing...`);
    const transcription = await transcribeWithWhisper(tempWav);

    fs.writeFileSync(outputTxt, transcription, "utf8");
    console.log(`  [✔] Saved: ${baseName}.txt`);
  } finally {
    if (fs.existsSync(tempWav)) fs.unlinkSync(tempWav);
  }
}

// Main flow
(async () => {
  const allFiles = fs.readdirSync(INPUT_FOLDER);

  // Clean up any leftover temp WAVs from a previous interrupted run
  allFiles
    .filter((f) => f.startsWith("_tmp_") && f.endsWith(".wav"))
    .forEach((f) => {
      fs.unlinkSync(path.join(INPUT_FOLDER, f));
      console.log(`[*] Cleaned up stale temp file: ${f}`);
    });

  const audioFiles = allFiles.filter(
    (f) => !f.startsWith("_tmp_") && SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase())
  );

  if (audioFiles.length === 0) {
    console.log(`⚠ No supported audio files found in: ${INPUT_FOLDER}`);
    console.log(`  Supported formats: ${SUPPORTED_EXTENSIONS.join(", ")}`);
    process.exit(0);
  }

  console.log(`\n[*] Found ${audioFiles.length} file(s) in: ${INPUT_FOLDER}`);
  console.log(`[*] Model: ${WHISPER_MODEL}\n`);

  let succeeded = 0;
  let failed = 0;

  for (const file of audioFiles) {
    const filePath = path.join(INPUT_FOLDER, file);
    console.log(`\n── ${file}`);
    try {
      await processFile(filePath);
      succeeded++;
    } catch (err) {
      console.error(`  ❌ Failed: ${err}`);
      failed++;
    }
  }

  console.log(`\n[✔] Done. ${succeeded} succeeded, ${failed} failed.`);
})();
