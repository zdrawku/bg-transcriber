# BG Transcriber

A Node.js application that extracts audio from video files and transcribes them to Bulgarian text using OpenAI's Whisper model.

## Features

- Extract audio from video files (MP4, etc.)
- Convert audio to optimal format for transcription (WAV, 16kHz, mono)
- Transcribe audio to Bulgarian text using local Whisper installation
- Save transcription to text file
- Automatic cleanup of temporary files

## Prerequisites

1. **Node.js** - Download from [nodejs.org](https://nodejs.org/)
2. **Python** - Download from [python.org](https://www.python.org/)
   - FFmpeg is bundled automatically via `ffmpeg-static` — no manual install needed

## Installation

1. **Install Python dependencies:**
   ```bash
   py -m pip install -r requirements.txt
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Configure your environment:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `INPUT_FOLDER` to the folder containing your audio files.

## Configuration

All configuration is done via the `.env` file (copy from `.env.example`):

```env
# Path to the folder containing your audio files
INPUT_FOLDER=some_path

# Whisper model size: tiny, base, small, medium, large
# Larger models are more accurate but slower
WHISPER_MODEL=large
```

## Usage

Run against the folder configured in `.env`:

```bash
npm start
```

Or pass the folder path directly as an argument (overrides `.env`):

```bash
node transcribeAudio.js "your_folder_with_files_here"
```

## How It Works

1. **Folder Scan**: Reads all supported audio/video files from `INPUT_FOLDER`
   - Supported formats: `.m4a`, `.mp3`, `.mp4`, `.wav`, `.ogg`, `.flac`, `.aac`
   - Files that already have a matching `.txt` transcript are skipped automatically

2. **Audio Conversion**: Uses FFmpeg (bundled via `ffmpeg-static`) to convert each file to a temporary WAV
   - Mono channel, 16kHz sample rate — optimal for Whisper
   - Temp file is deleted after transcription

3. **Transcription**: Calls `transcribe.py` which runs the local Whisper model
   - Specifically configured for Bulgarian language
   - Model size is configurable via `WHISPER_MODEL`

4. **Output**: Each audio file gets a matching `.txt` transcript saved in the same folder
   - e.g. `session1.m4a` → `session1.txt`

## File Structure

```
bg-transcriber/
├── transcribeAudio.js          # Main application file
├── transcribe.py               # Python script for Whisper transcription
├── package.json                # Node.js dependencies
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
├── .env                        # Your local config (not committed)
└── README.md                   # This file

# Transcripts are saved alongside the source audio files:
D:\folder\folder\
├── session1.m4a
├── session1.txt                # generated transcript
├── session2.m4a
└── session2.txt                # generated transcript
```

## Dependencies

### Node.js Packages
- `fluent-ffmpeg` - FFmpeg wrapper for Node.js
- `ffmpeg-static` - Bundled FFmpeg binary (no system install required)
- `dotenv` - Environment variable management

### Python Packages
- `openai-whisper` - OpenAI's Whisper speech-to-text model

## Example Output

```
[*] Found 3 file(s) in: D:\folder\folder

── session1.m4a
  [*] Converting: session1.m4a
  [*] Transcribing...
  [✔] Saved: session1.txt

── session2.m4a
  [skip] session2.txt already exists

── session3.m4a
  [*] Converting: session3.m4a
  [*] Transcribing...
  [✔] Saved: session3.txt

[✔] Done. 2 succeeded, 0 failed.
```

## Troubleshooting

1. **Python not found**: Ensure Python is installed and accessible via `py` command
2. **Whisper not installed**: Run `py -m pip install -r requirements.txt`
3. **Folder not found**: Verify `INPUT_FOLDER` is set correctly in `.env`
4. **No files found**: Check that the folder contains supported audio formats (`.m4a`, `.mp3`, `.mp4`, etc.)
5. **Slow transcription**: Try a smaller model (`WHISPER_MODEL=tiny` or `base`) in `.env`

## Alternative Usage

For direct Whisper usage without Node.js:
```bash
whisper path\to\your\audio.wav --language bg --model small
```

## License

ISC License

## Contributing

Feel free to submit issues and enhancement requests!