require("dotenv").config();
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath('C:\\Users\\ZKolev\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin\\ffmpeg.exe'); // Adjust path to your ffmpeg executable
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const INPUT_VIDEO = "osnovni_ponqtiq_i_tipove_stroitelstwo.mp4";
const OUTPUT_AUDIO = "audio.wav";

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

// Step 2: Transcribe audio using OpenAI Whisper API
async function transcribeAudio(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const form = new FormData();
  form.append("file", fileStream);
  form.append("model", "whisper-1");
  form.append("language", "bg"); // Bulgarian

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("Transcription failed:", error.response?.data || error.message);
    return null;
  }
}

// Main flow
(async () => {
  console.log("[*] Extracting audio...");
  await extractAudio(INPUT_VIDEO, OUTPUT_AUDIO);

  console.log("[*] Transcribing audio...");
  const transcription = await transcribeAudio(OUTPUT_AUDIO);

  if (transcription) {
    console.log("\n[✔] Bulgarian Transcription:\n");
    console.log(transcription);

    fs.writeFileSync("transcription_bg.txt", transcription, "utf8");
    console.log("\n[✔] Saved to transcription_bg.txt");
  }

  // Optional cleanup
  fs.unlinkSync(OUTPUT_AUDIO);
})();
