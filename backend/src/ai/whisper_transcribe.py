import whisper
import sys
import json
import os
import subprocess
import shutil

# Kiểm tra ffmpeg có sẵn không (Whisper cần ffmpeg để xử lý nhiều format audio)
def check_ffmpeg():
    """Kiểm tra xem ffmpeg có được cài đặt và có trong PATH không"""
    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path:
        print(f"✅ FFmpeg found at: {ffmpeg_path}", file=sys.stderr)
        # Kiểm tra version
        try:
            result = subprocess.run(
                ["ffmpeg", "-version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                version_line = result.stdout.split('\n')[0]
                print(f"   Version: {version_line}", file=sys.stderr)
                return True
        except Exception as e:
            print(f"⚠️  FFmpeg found but cannot run: {e}", file=sys.stderr)
    else:
        print("❌ FFmpeg not found in PATH", file=sys.stderr)
        print("   Whisper cần ffmpeg để xử lý các file audio như .m4a, .mp3, .mp4", file=sys.stderr)
        print("   Vui lòng cài đặt ffmpeg: https://ffmpeg.org/download.html", file=sys.stderr)
    return False

# Sử dụng model nhẹ hơn để tăng tốc độ
# "base" nhanh hơn "large" nhiều lần (từ vài phút xuống vài giây)
# Nếu cần độ chính xác cao hơn, có thể dùng "medium" hoặc "small"
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "base")  # Có thể set env var để đổi model

# Kiểm tra ffmpeg khi script khởi động
FFMPEG_AVAILABLE = check_ffmpeg()

# Load model 1 lần khi Python khởi động
try:
    print(f"🔄 Loading Whisper model '{MODEL_SIZE}'...", file=sys.stderr)
    model = whisper.load_model(MODEL_SIZE)
    print(f"✅ Whisper model '{MODEL_SIZE}' loaded successfully", file=sys.stderr)
except Exception as e:
    print(json.dumps({"error": f"Không load được model: {str(e)}"}))
    sys.exit(1)

def transcribe_file(audio_path, language):
    print(f"📁 Checking file: {audio_path}", file=sys.stderr)
    
    # Normalize path cho Windows
    audio_path = os.path.normpath(audio_path)
    print(f"📁 Normalized path: {audio_path}", file=sys.stderr)
    
    if not os.path.exists(audio_path):
        print(f"❌ File does not exist: {audio_path}", file=sys.stderr)
        return {"error": f"File {audio_path} không tồn tại"}
    
    # Kiểm tra file size
    file_size = os.path.getsize(audio_path)
    print(f"📊 File size: {file_size / (1024 * 1024):.2f} MB", file=sys.stderr)
    
    # Kiểm tra file extension
    file_ext = os.path.splitext(audio_path)[1].lower()
    print(f"📄 File extension: {file_ext}", file=sys.stderr)
    
    # Cảnh báo nếu không có ffmpeg và file không phải .wav
    if not FFMPEG_AVAILABLE and file_ext not in ['.wav', '.flac']:
        print(f"⚠️  Warning: FFmpeg không có sẵn và file là {file_ext}", file=sys.stderr)
        print(f"   Whisper có thể không xử lý được format này", file=sys.stderr)
    
    try:
        print(f"🔄 Starting transcription (language: {language}, model: {MODEL_SIZE})...", file=sys.stderr)
        print(f"   Using ffmpeg: {FFMPEG_AVAILABLE}", file=sys.stderr)
        import time
        start_time = time.time()
        
        # Thử transcribe với verbose để xem log chi tiết
        result = model.transcribe(
            audio_path,
            language=language,
            verbose=False  # Set True để xem log chi tiết của Whisper
        )
        
        elapsed_time = time.time() - start_time
        transcription = result.get("text", "")
        print(f"✅ Transcription completed in {elapsed_time:.2f}s: {len(transcription)} characters", file=sys.stderr)
        if transcription:
            print(f"   Preview: {transcription[:100]}...", file=sys.stderr)
        return {"transcription": transcription}
    except FileNotFoundError as e:
        error_msg = str(e)
        print(f"❌ FileNotFoundError: {error_msg}", file=sys.stderr)
        if "ffmpeg" in error_msg.lower() or "The system cannot find the file specified" in error_msg:
            print(f"💡 Solution: Cài đặt ffmpeg và thêm vào PATH", file=sys.stderr)
            print(f"   Download: https://ffmpeg.org/download.html", file=sys.stderr)
            print(f"   Hoặc: choco install ffmpeg (nếu dùng Chocolatey)", file=sys.stderr)
            return {"error": "FFmpeg không được tìm thấy. Vui lòng cài đặt ffmpeg để xử lý file audio."}
        return {"error": f"FileNotFoundError: {error_msg}"}
    except Exception as e:
        print(f"❌ Transcription error: {str(e)}", file=sys.stderr)
        print(f"   Error type: {type(e).__name__}", file=sys.stderr)
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}", file=sys.stderr)
        return {"error": str(e)}

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Thiếu arguments: python whisper_transcribe.py <audioPath> <language>"}))
        sys.exit(1)

    audio_path = sys.argv[1]
    language = sys.argv[2]
    
    print(f"🚀 Starting transcription process...", file=sys.stderr)
    print(f"   Audio path: {audio_path}", file=sys.stderr)
    print(f"   Language: {language}", file=sys.stderr)
    print(f"   Model: {MODEL_SIZE}", file=sys.stderr)
    print(f"   FFmpeg available: {FFMPEG_AVAILABLE}", file=sys.stderr)

    result = transcribe_file(audio_path, language)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
