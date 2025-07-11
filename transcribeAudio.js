// For local whisper example install python first
// then 'py -m pip install -U openai-whisper'
// and you can directly go for the language export with 'whisper path\to\your\audio.wav --language bg' 


require("dotenv").config();
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

ffmpeg.setFfmpegPath('C:\\Users\\ZKolev\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin\\ffmpeg.exe');

const INPUT_VIDEO = "osnovni_ponqtiq_i_tipove_stroitelstwo.mp4";
const OUTPUT_AUDIO = "audio.wav";
const TRANSCRIPTION_FILE = "transcription_bg.txt";

// Step 1: Extract audio from video
function extractAudio(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
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

// Step 2: Transcribe using local Python Whisper
function transcribeWithWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    execFile("py", ["transcribe.py", audioPath], (err, stdout, stderr) => {
      if (err) {
        reject(stderr || err.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Main flow
(async () => {
  try {
    console.log("[*] Extracting audio...");
    await extractAudio(INPUT_VIDEO, OUTPUT_AUDIO);

    console.log("[*] Transcribing audio with local Whisper...");
    const transcription = await transcribeWithWhisper(OUTPUT_AUDIO);

    console.log("\n[✔] Bulgarian Transcription is being saved... \n");
    fs.writeFileSync(TRANSCRIPTION_FILE, transcription, "utf8");
    console.log("\n[✔] Saved to transcription_bg.txt");

    fs.unlinkSync(OUTPUT_AUDIO); // optional cleanup
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
