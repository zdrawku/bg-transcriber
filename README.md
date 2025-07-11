# BG Transcriber

A Node.js application that extracts audio from video files and transcribes them to Bulgarian text using OpenAI's Whisper model.

## Features

- Extract audio from video files (MP4, etc.)
- Convert audio to optimal format for transcription (WAV, 16kHz, mono)
- Transcribe audio to Bulgarian text using local Whisper installation
- Save transcription to text file
- Automatic cleanup of temporary files

## Prerequisites

Before running this application, ensure you have the following installed:

### Required Software

1. **Node.js** - Download from [nodejs.org](https://nodejs.org/)
2. **Python** - Download from [python.org](https://www.python.org/)
3. **FFmpeg** - Download from [ffmpeg.org](https://ffmpeg.org/)
4. **OpenAI Whisper** - Install via pip

### Installation Steps

1. **Install Python dependencies:**
   ```bash
   py -m pip install -U openai-whisper
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install FFmpeg:**
   - Download FFmpeg and note the installation path
   - Update the `ffmpeg.setFfmpegPath()` in the code with your FFmpeg path

## Configuration

1. **FFmpeg Path**: Update the FFmpeg path in `transcribeAudio.js`:
   ```javascript
   ffmpeg.setFfmpegPath('YOUR_FFMPEG_PATH_HERE');
   ```

2. **Input File**: Update the input video file name:
   ```javascript
   const INPUT_VIDEO = "your_video_file.mp4";
   ```

## Usage

1. Place your video file in the project directory
2. Update the `INPUT_VIDEO` constant with your video file name
3. Run the application:
   ```bash
   node transcribeAudio.js
   ```

## How It Works

1. **Audio Extraction**: Uses FFmpeg to extract audio from the video file
   - Converts to WAV format
   - Sets to mono channel
   - Optimizes to 16kHz sample rate

2. **Transcription**: Uses local Whisper installation to transcribe the audio
   - Specifically configured for Bulgarian language
   - Processes the audio through Python script

3. **Output**: Saves the transcription to `transcription_bg.txt`

## File Structure

```
bg-transcriber/
├── transcribeAudio.js          # Main application file
├── transcribe.py               # Python script for Whisper transcription
├── package.json                # Node.js dependencies
├── README.md                   # This file
├── your_video_file.mp4         # Input video file
└── transcription_bg.txt        # Output transcription (generated)
```

## Dependencies

### Node.js Packages
- `fluent-ffmpeg` - FFmpeg wrapper for Node.js
- `dotenv` - Environment variable management
- `axios` - HTTP client (for future API integrations)
- `form-data` - Form data handling
- `openai` - OpenAI API client (for future cloud integrations)

### Python Packages
- `openai-whisper` - OpenAI's Whisper speech-to-text model

## Example Output

The application will display progress and results in the console:

```
[*] Extracting audio...
[*] Transcribing audio with local Whisper...

[✔] Bulgarian Transcription:

Your transcribed text will appear here...

[✔] Saved to transcription_bg.txt
```

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Ensure FFmpeg is installed and the path is correctly set
2. **Python not found**: Ensure Python is installed and accessible via `py` command
3. **Whisper not installed**: Run `py -m pip install -U openai-whisper`
4. **Video file not found**: Ensure the video file exists in the project directory

### Error Messages

- `Error: Cannot find FFmpeg`: Update the FFmpeg path in the code
- `Error: Python script failed`: Check Python and Whisper installation
- `Error: No such file or directory`: Verify input video file exists

## Alternative Usage

For direct Whisper usage without Node.js:
```bash
whisper path\to\your\audio.wav --language bg
```

## License

ISC License

## Contributing

Feel free to submit issues and enhancement requests!