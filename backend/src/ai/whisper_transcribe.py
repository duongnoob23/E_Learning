import whisper
import sys
import json
import os

# Load model 1 lần khi Python khởi động
try:
    model = whisper.load_model("large")
except Exception as e:
    print(json.dumps({"error": f"Không load được model: {str(e)}"}))
    sys.exit(1)

def transcribe_file(audio_path, language):
    if not os.path.exists(audio_path):
        return {"error": f"File {audio_path} không tồn tại"}
    try:
        result = model.transcribe(audio_path, language=language)
        transcription = result.get("text", "")
        return {"transcription": transcription}
    except Exception as e:
        return {"error": str(e)}

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Thiếu arguments: python whisper_transcribe.py <audioPath> <language>"}))
        sys.exit(1)

    audio_path = sys.argv[1]
    language = sys.argv[2]

    result = transcribe_file(audio_path, language)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
