import json
import re
import os

def parse_transcript(transcript_text):
    """
    Parse transcript từ format "Question text?(A) Answer A.(B) Answer B.(C) Answer C."
    thành object {A: "Answer A", B: "Answer B", C: "Answer C"}
    """
    transcript_obj = {}
    # Pattern để match (A), (B), (C) và nội dung sau đó
    pattern = r'\(([A-C])\)\s*([^\(]+?)(?=\([A-C]\)|$)'
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
    Part 2 chỉ có 3 đáp án (A, B, C)
    """
    explanation_obj = {}
    
    # Tìm vị trí kết thúc của phần dịch nghĩa (sau đáp án C)
    # Tìm tất cả các đáp án A, B, C
    answer_pattern = r'[\(]?([A-C])[\))]\s*([^\(\)]+?)(?=[\(]?[A-C][\))]|Dựa|→|Chọn|Do đó|Từ đó|Do vậy|Vì|$)'
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
    
    # Tìm phần note - phần sau đáp án C cuối cùng
    note_text = None
    if matches:
        # Lấy vị trí kết thúc của đáp án C cuối cùng
        last_match_end = matches[-1].end()
        # Lấy phần còn lại sau đáp án C
        remaining_text = explanation_text[last_match_end:].strip()
        
        # Lấy toàn bộ phần note (có thể có ngoặc đơn)
        # Tìm từ "Dựa vào" hoặc "Vì" hoặc "→" đến hết
        if remaining_text:
            # Pattern 1: Bắt đầu từ "Dựa vào" hoặc "Vì"
            note_match = re.search(r'(Dựa vào|Vì).*', remaining_text, re.IGNORECASE)
            if note_match:
                note_text = remaining_text[note_match.start():].strip()
            # Pattern 2: Bắt đầu từ "→" hoặc "->"
            elif re.search(r'[→-]>', remaining_text):
                note_match = re.search(r'[→-]>.*', remaining_text)
                if note_match:
                    note_text = remaining_text[note_match.start():].strip()
            # Pattern 3: Bắt đầu từ "Chọn"
            elif re.search(r'Chọn', remaining_text, re.IGNORECASE):
                note_match = re.search(r'Chọn.*', remaining_text, re.IGNORECASE)
                if note_match:
                    note_text = remaining_text[note_match.start():].strip()
            else:
                # Lấy toàn bộ remaining_text
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
            if re.match(r'^[A-C]$', note_text):
                note_text = f"Chọn đáp án {note_text}"
        # Capitalize first letter
        if note_text:
            note_text = note_text[0].upper() + note_text[1:] if len(note_text) > 1 else note_text.upper()
            explanation_obj['note'] = note_text
    
    return explanation_obj

def convert_question(old_question, question_index, activity_id):
    """
    Convert một question từ format cũ sang format mới (Part 2)
    """
    new_question = {
        "question_id": f"p2_q{question_index + 1}",
        "question_number": int(old_question.get("qnum", question_index + 1)),
    }
    
    # Part 2 không có image
    # Audio
    audio = old_question.get("audio", "")
    new_question["audio_file"] = audio if audio else ""
    
    # Correct choice
    new_question["correct_choice"] = old_question.get("correct", "")
    
    # Transcript (chỉ có 3 đáp án A, B, C)
    transcript_text = old_question.get("transcript", "")
    new_question["transcript"] = parse_transcript(transcript_text)
    
    # Explanation (chỉ có 3 đáp án A, B, C)
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
    
    # Find all activity_*.json files
    import glob
    input_files = glob.glob(os.path.join(script_dir, "activity_*.json"))
    
    # Convert each file
    for input_path in sorted(input_files):
        input_filename = os.path.basename(input_path)
        # Extract activity number
        activity_match = re.search(r'activity_(\d+)\.json', input_filename)
        if activity_match:
            activity_num = activity_match.group(1)
            output_filename = f"file-part2-{activity_num}.json"
            output_path = os.path.join(script_dir, output_filename)
            convert_file(input_path, output_path)

if __name__ == "__main__":
    main()

