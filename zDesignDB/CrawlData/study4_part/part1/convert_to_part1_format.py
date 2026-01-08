import json
import re
import os

def parse_transcript(transcript_text):
    """
    Parse transcript từ format "(A) text.(B) text.(C) text.(D) text."
    thành object {A: "text", B: "text", C: "text", D: "text"}
    """
    transcript_obj = {}
    # Pattern để match (A), (B), (C), (D) và nội dung sau đó
    pattern = r'\(([A-D])\)\s*([^\(]+?)(?=\([A-D]\)|$)'
    matches = re.findall(pattern, transcript_text)
    
    for letter, text in matches:
        # Clean text: remove leading/trailing whitespace, remove trailing period if exists
        text = text.strip()
        if text.endswith('.'):
            text = text[:-1]
        transcript_obj[letter] = text.strip()
    
    return transcript_obj

def parse_explanation(explanation_text):
    """
    Parse explanation để tách phần dịch nghĩa từng đáp án và phần note
    """
    explanation_obj = {}
    
    # Tìm vị trí kết thúc của phần dịch nghĩa (sau đáp án D)
    # Tìm tất cả các đáp án A, B, C, D
    answer_pattern = r'[\(]?([A-D])[\))]\s*([^\(\)]+?)(?=[\(]?[A-D][\))]|Nhìn|→|Chọn|Do đó|Từ đó|Do vậy|$)'
    matches = list(re.finditer(answer_pattern, explanation_text))
    
    # Parse từng đáp án
    for match in matches:
        letter = match.group(1)
        text = match.group(2).strip()
        # Remove trailing period if exists
        if text.endswith('.'):
            text = text[:-1]
        text = text.strip()
        if text:
            explanation_obj[letter] = text
    
    # Tìm phần note - phần sau đáp án D cuối cùng
    note_text = None
    if matches:
        # Lấy vị trí kết thúc của đáp án D cuối cùng
        last_match_end = matches[-1].end()
        # Lấy phần còn lại sau đáp án D
        remaining_text = explanation_text[last_match_end:].strip()
        
        # Tìm phần note trong remaining_text
        # Pattern 1: "Nhìn vào ... → chọn đáp án X" hoặc "Nhìn vào ... -> chọn đáp án X"
        note_match = re.search(r'(Nhìn vào[^→]*[→-]>\s*[^\.]+)', remaining_text, re.IGNORECASE)
        if note_match:
            note_text = note_match.group(1).strip()
        # Pattern 2: "→ chọn đáp án X" hoặc "-> chọn đáp án X"
        elif re.search(r'[→-]>\s*', remaining_text, re.IGNORECASE):
            note_match = re.search(r'[→-]>\s*([^\.]+)', remaining_text, re.IGNORECASE)
            if note_match:
                note_text = note_match.group(1).strip()
                if re.match(r'^[A-D]$', note_text):
                    note_text = f"Chọn đáp án {note_text}"
        # Pattern 3: "Chọn X" hoặc "chọn đáp án X"
        elif re.search(r'Chọn', remaining_text, re.IGNORECASE):
            note_match = re.search(r'Chọn\s+(?:đáp\s+án\s+)?([A-D])', remaining_text, re.IGNORECASE)
            if note_match:
                note_text = f"Chọn đáp án {note_match.group(1)}"
        # Pattern 4: "Do đó chọn X" hoặc "Từ đó chọn X" hoặc "Do vậy chọn X"
        elif re.search(r'(?:Do đó|Từ đó|Do vậy)', remaining_text, re.IGNORECASE):
            note_match = re.search(r'(?:Do đó|Từ đó|Do vậy)\s+([^\.]+)', remaining_text, re.IGNORECASE)
            if note_match:
                note_text = note_match.group(1).strip()
                if not re.search(r'chọn', note_text, re.IGNORECASE):
                    note_text = f"Chọn {note_text}"
        else:
            # Nếu không tìm thấy pattern cụ thể, lấy toàn bộ remaining_text nếu nó ngắn (< 100 ký tự)
            if len(remaining_text) < 100 and remaining_text:
                note_text = remaining_text.strip()
    
    # Clean note text
    if note_text:
        note_text = note_text.strip()
        # Remove trailing period if exists
        if note_text.endswith('.'):
            note_text = note_text[:-1]
        note_text = note_text.strip()
        # Đảm bảo format nhất quán
        if not re.search(r'chọn\s+đáp\s+án', note_text, re.IGNORECASE):
            if re.match(r'^[A-D]$', note_text):
                note_text = f"Chọn đáp án {note_text}"
        # Capitalize first letter
        if note_text:
            note_text = note_text[0].upper() + note_text[1:] if len(note_text) > 1 else note_text.upper()
            explanation_obj['note'] = note_text
    
    return explanation_obj

def convert_image_path(image_path):
    """
    Convert relative image path sang full URL
    """
    if not image_path:
        return ""
    
    if image_path.startswith('http'):
        return image_path
    
    if image_path.startswith('/'):
        return f"https://study4.com{image_path}"
    
    return f"https://study4.com/media/{image_path}"

def convert_question(old_question, question_index, activity_id):
    """
    Convert một question từ format cũ sang format mới
    """
    new_question = {
        "question_id": f"p1_q{question_index + 1}",
        "question_number": int(old_question.get("qnum", question_index + 1)),
    }
    
    # Image
    images = old_question.get("images", [])
    if images and len(images) > 0:
        new_question["image_file"] = convert_image_path(images[0])
    else:
        new_question["image_file"] = ""
    
    # Audio
    audio = old_question.get("audio", "")
    new_question["audio_file"] = audio if audio else ""
    
    # Correct choice
    new_question["correct_choice"] = old_question.get("correct", "")
    
    # Transcript
    transcript_text = old_question.get("transcript", "")
    new_question["transcript"] = parse_transcript(transcript_text)
    
    # Explanation
    explanation_text = old_question.get("explanation", "")
    new_question["explanation"] = parse_explanation(explanation_text)
    
    return new_question

def convert_file(input_file, output_file):
    """
    Convert một file từ format cũ sang format mới
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data.get("questions", [])
    converted_questions = []
    
    for index, question in enumerate(questions):
        converted_question = convert_question(question, index, data.get("activity_id"))
        converted_questions.append(converted_question)
    
    # Write output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(converted_questions, f, ensure_ascii=False, indent=2)
    
    print(f"Converted {len(converted_questions)} questions from {input_file} to {output_file}")

def main():
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Files to convert
    files_to_convert = [
        ("activity_7313.json", "file-part1-7313.json"),
        ("activity_7314.json", "file-part1-7314.json"),
        ("activity_7315.json", "file-part1-7315.json"),
    ]
    
    for input_file, output_file in files_to_convert:
        input_path = os.path.join(script_dir, input_file)
        output_path = os.path.join(script_dir, output_file)
        
        if os.path.exists(input_path):
            convert_file(input_path, output_path)
        else:
            print(f"File not found: {input_path}")

if __name__ == "__main__":
    main()

