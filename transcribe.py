import os
import sys

# Prepend bundled ffmpeg dir to PATH so Whisper's internal load_audio can find it
ffmpeg_bin_dir = os.environ.get("FFMPEG_BIN_DIR")
if ffmpeg_bin_dir:
    os.environ["PATH"] = ffmpeg_bin_dir + os.pathsep + os.environ.get("PATH", "")

import whisper

audio_path = sys.argv[1]
model_name = sys.argv[2] if len(sys.argv) > 2 else "small"

model = whisper.load_model(model_name)
result = model.transcribe(audio_path, language="bg")

print(result["text"])
