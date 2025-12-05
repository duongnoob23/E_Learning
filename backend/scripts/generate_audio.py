#!/usr/bin/env python3
"""
Script để tạo file MP3 từ text bằng gTTS (Google Text-to-Speech)
Sử dụng: python generate_audio.py "word" "/path/to/output.mp3"
"""

import sys
import os

try:
    from gtts import gTTS
except ImportError:
    print("Error: gTTS not installed. Run: pip install gTTS", file=sys.stderr)
    sys.exit(1)


def generate_audio(text, output_path):
    """
    Tạo file MP3 từ text bằng gTTS
    
    Args:
        text (str): Text cần chuyển thành âm thanh
        output_path (str): Đường dẫn file output
    
    Returns:
        bool: True nếu thành công, False nếu thất bại
    """
    try:
        # Tạo thư mục nếu chưa tồn tại
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        # Tạo gTTS object với ngôn ngữ tiếng Anh
        tts = gTTS(text=text, lang='en', slow=False)
        
        # Lưu file MP3
        tts.save(output_path)
        
        print(f"Success: Audio file created at {output_path}", file=sys.stderr)
        return True
        
    except Exception as e:
        print(f"Error: Failed to generate audio - {str(e)}", file=sys.stderr)
        return False


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_audio.py <text> <output_path>", file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2]
    
    success = generate_audio(text, output_path)
    sys.exit(0 if success else 1)

