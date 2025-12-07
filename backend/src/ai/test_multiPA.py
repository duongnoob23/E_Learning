"""
Test script cho multiPA_score.py
Chạy: python test_multiPA.py
"""
import json
import sys
import os

# Import function từ multiPA_score
sys.path.insert(0, os.path.dirname(__file__))
from multiPA_score import score_writing, score_speaking_audio

def test_writing():
    """Test chấm điểm Writing"""
    print("=" * 50)
    print("TEST WRITING SCORING")
    print("=" * 50)
    
    test_text = "This is a test essay. I am learning English every day. It is very important to practice writing skills."
    
    try:
        result = score_writing(test_text, "en")
        print("\n✅ Kết quả:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return True
    except Exception as e:
        print(f"\n❌ Lỗi: {str(e)}")
        return False

def test_speaking():
    """Test chấm điểm Speaking (cần file audio)"""
    print("\n" + "=" * 50)
    print("TEST SPEAKING SCORING")
    print("=" * 50)
    print("⚠️  Cần file audio để test Speaking")
    print("   Ví dụ: python test_multiPA.py --audio path/to/audio.wav")
    return None

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--audio":
        if len(sys.argv) < 3:
            print("❌ Thiếu đường dẫn file audio")
            print("Usage: python test_multiPA.py --audio path/to/audio.wav")
            sys.exit(1)
        audio_path = sys.argv[2]
        try:
            result = score_speaking_audio(audio_path, "en")
            print(json.dumps(result, indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"❌ Lỗi: {str(e)}")
    else:
        # Test Writing
        success = test_writing()
        test_speaking()
        
        if success:
            print("\n" + "=" * 50)
            print("✅ TEST HOÀN TẤT!")
            print("=" * 50)
        else:
            print("\n" + "=" * 50)
            print("❌ TEST THẤT BẠI!")
            print("=" * 50)
            sys.exit(1)

