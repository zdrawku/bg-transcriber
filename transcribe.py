import whisper
import sys

model = whisper.load_model("small")  # or tiny, base, medium, large
result = model.transcribe(sys.argv[1], language="bg")

with open("transcription_bg.txt", "w", encoding="utf-8") as f:
    f.write(result["text"])

print("Transcription saved to transcription_bg.txt")
