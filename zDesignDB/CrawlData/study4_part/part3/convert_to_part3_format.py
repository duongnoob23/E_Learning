import json
import re
import os

def parse_answers(answers_list):
    """
    Parse answers từ format ["A. A motorcycle", "B. A mobile phone", ...]
    thành array [{label: "A", text: "A motorcycle"}, ...]
    """
    options = []
    for answer in answers_list:
        # Pattern: "A. text" hoặc "A text"
        match = re.match(r'^([A-D])\.?\s*(.+)$', answer.strip())
        if match:
            label = match.group(1)
            text = match.group(2).strip()
            # Remove trailing period if exists
            if text.endswith('.'):
                text = text[:-1]
            options.append({
                "label": label,
                "text": text
            })
    return options

def parse_explanation(explanation_text):
    """
    Parse explanation để tách phần dịch nghĩa từng đáp án và phần note
    Part 3 có 4 đáp án (A, B, C, D)
    Format: "A. text" hoặc "A. text => note" hoặc "A. text, chọn."
    """
    explanation_obj = {}
    
    # Loại bỏ phần đầu "Đáp án đúng: X" nếu có
    explanation_text = re.sub(r'Đáp án đúng:\s*[A-D]\s*', '', explanation_text, flags=re.IGNORECASE)
    explanation_text = explanation_text.strip()
    
    # Tìm tất cả các đáp án A, B, C, D
    # Pattern: "A. text" hoặc "A text" (có thể có => hoặc , hoặc . ở cuối)
    # Tìm từ đầu dòng hoặc sau ký tự khác
    # Pattern 1: "A. text" (có dấu chấm và khoảng trắng)
    answer_pattern = r'([A-D])\.\s+([^A-D]+?)(?=[A-D]\.|→|$)'
    matches = list(re.finditer(answer_pattern, explanation_text))
    
    # Pattern 2: "A. text" nhưng không có khoảng trắng sau dấu chấm, hoặc "Atext" (không có dấu chấm)
    if not matches or len(matches) < 4:
        # Thử pattern: "A. text" hoặc "A text" (có thể không có khoảng trắng)
        answer_pattern = r'([A-D])\.?\s*([^A-D]+?)(?=[A-D]\.?\s*|→|$)'
        matches = list(re.finditer(answer_pattern, explanation_text))
    
    # Pattern 3: "Atext" (không có dấu chấm và khoảng trắng) - chỉ khi text kết thúc bằng chữ cái và đáp án tiếp theo bắt đầu bằng chữ cái
    if not matches or len(matches) < 4:
        # Tìm pattern: chữ cái A-D, sau đó là text, sau đó là chữ cái A-D (không có dấu chấm)
        answer_pattern = r'([A-D])([^A-D]+?)(?=[A-D](?:\.|$|→))'
        matches = list(re.finditer(answer_pattern, explanation_text))
    
    # Parse từng đáp án
    note_parts = []
    for match in matches:
        letter = match.group(1)
        text = match.group(2).strip()
        
        # Tách phần text và note nếu có "=>"
        if '=>' in text:
            parts = text.split('=>', 1)
            text = parts[0].strip()
            note_part = parts[1].strip()
            note_parts.append(note_part)
        elif ',' in text and ('chọn' in text.lower() or 'loại' in text.lower()):
            # Nếu có dấu phẩy và từ "chọn" hoặc "loại", có thể là note
            parts = text.rsplit(',', 1)
            if len(parts) == 2 and ('chọn' in parts[1].lower() or 'loại' in parts[1].lower()):
                text = parts[0].strip()
                note_parts.append(parts[1].strip())
        
        # Remove trailing period, comma if exists
        text = text.rstrip('.,')
        text = text.strip()
        if text:
            explanation_obj[letter] = text
    
    # Tìm phần note
    note_text = None
    
    # Pattern 1: Nếu có note trong note_parts, lấy phần đầu tiên (thường là của đáp án đúng)
    if note_parts:
        note_text = note_parts[0]
    
    # Pattern 2: Tìm phần sau "=>" trong explanation (nếu chưa có note)
    if not note_text and '=>' in explanation_text:
        # Tìm tất cả các phần sau "=>"
        arrow_parts = re.findall(r'=>\s*([^=>]+)', explanation_text)
        if arrow_parts:
            note_text = arrow_parts[0].strip()
    
    # Pattern 3: Tìm phần câu hỏi và giải thích ở đầu
    if not note_text:
        # Tìm phần có "?" và phần sau đó
        question_match = re.search(r'([^?]+\?)\s*(.+)', explanation_text)
        if question_match:
            note_text = question_match.group(2).strip()
            # Loại bỏ các đáp án đã parse
            for letter in ['A', 'B', 'C', 'D']:
                if letter in explanation_obj:
                    pattern = rf'{letter}\.\s*{re.escape(explanation_obj[letter])}'
                    note_text = re.sub(pattern, '', note_text, flags=re.IGNORECASE)
            note_text = note_text.strip()
    
    # Pattern 4: Lấy phần cuối cùng nếu có từ khóa giải thích
    if not note_text:
        # Tìm phần có chứa từ khóa giải thích ở cuối
        keywords = ['chọn', 'loại', 'đúng', 'sai', 'vì', 'dựa', 'bài nghe', 'từ khoá']
        for keyword in keywords:
            if keyword in explanation_text.lower():
                # Tìm vị trí của keyword
                idx = explanation_text.lower().find(keyword)
                if idx > 0:
                    # Lấy phần từ keyword đến hết (nhưng loại bỏ các đáp án)
                    potential_note = explanation_text[idx:].strip()
                    # Loại bỏ các đáp án đã parse
                    for letter in ['A', 'B', 'C', 'D']:
                        if letter in explanation_obj:
                            pattern = rf'{letter}\.\s*{re.escape(explanation_obj[letter])}'
                            potential_note = re.sub(pattern, '', potential_note, flags=re.IGNORECASE)
                    potential_note = potential_note.strip()
                    if potential_note and len(potential_note) > 10:
                        note_text = potential_note
                        break
    
    # Clean note text
    if note_text:
        note_text = note_text.strip()
        # Remove trailing period if exists
        if note_text.endswith('.'):
            note_text = note_text[:-1]
        note_text = note_text.strip()
        # Capitalize first letter
        if note_text:
            note_text = note_text[0].upper() + note_text[1:] if len(note_text) > 1 else note_text.upper()
            explanation_obj['note'] = note_text
    
    return explanation_obj

def convert_audio_path(audio_path):
    """
    Convert audio path sang full URL nếu cần
    """
    if not audio_path:
        return ""
    
    if audio_path.startswith('http'):
        return audio_path
    
    if audio_path.startswith('/'):
        return f"https://study4.com{audio_path}"
    
    return f"https://study4.com/media/{audio_path}"

def convert_image_path(image_path):
    """
    Convert image path sang full URL nếu cần
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
    Convert một question từ format cũ sang format mới (Part 3)
    """
    new_question = {
        "question_id": f"p3_q{question_index + 1}",
        "question_number": int(old_question.get("qnum", question_index + 1)),
    }
    
    # Audio
    audio = old_question.get("audio", "")
    new_question["audio_file"] = convert_audio_path(audio) if audio else ""
    
    # Question text
    new_question["questionText"] = old_question.get("question_text", "")
    
    # Options (parse từ answers)
    answers = old_question.get("answers", [])
    new_question["options"] = parse_answers(answers)
    
    # Correct answer
    new_question["correctAnswer"] = old_question.get("correct", "")
    
    # Transcript (string)
    new_question["transcript"] = old_question.get("transcript", "")
    
    # Translation (string)
    new_question["translation"] = old_question.get("translation", "")
    
    # Explanation (parse từ explanation string)
    explanation_text = old_question.get("explanation", "")
    new_question["explanation"] = parse_explanation(explanation_text)
    
    # Image (optional)
    images = old_question.get("images", [])
    if images and len(images) > 0:
        new_question["image_file"] = convert_image_path(images[0])
    # Không thêm image_file nếu không có image
    
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
            output_filename = f"file-part3-{activity_num}.json"
            output_path = os.path.join(script_dir, output_filename)
            convert_file(input_path, output_path)

if __name__ == "__main__":
    main()

