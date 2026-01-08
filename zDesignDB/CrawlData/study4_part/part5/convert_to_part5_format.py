import json
import re
import os

def parse_answers(answers_list):
    """
    Parse answers từ format ["A. text", "B. text", ...]
    thành array [{label: "A", text: "text"}, ...]
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
    Parse explanation để tách analysis, translation, và explanation
    Format Part 5:
    - "Đáp án đúng: X\n Giải thích: ...\n Dịch nghĩa cả câu: ...\n Từ vựng: ..."
    """
    result = {
        "analysis": "",
        "translation": "",
        "explanation": ""
    }
    
    # Tìm đáp án đúng
    correct_match = re.search(r'Đáp án đúng:\s*([A-D])', explanation_text, re.IGNORECASE)
    correct_answer = correct_match.group(1) if correct_match else ""
    
    # Tìm phần "Giải thích:"
    analysis_match = re.search(r'Giải thích:\s*(.+?)(?=Dịch nghĩa cả câu|Từ vựng|→\s*chọn|$)', explanation_text, re.IGNORECASE | re.DOTALL)
    if analysis_match:
        analysis = analysis_match.group(1).strip()
        # Loại bỏ "→ chọn đáp án X" nếu có
        analysis = re.sub(r'→\s*chọn\s+đáp\s+án\s+[A-D]', '', analysis, flags=re.IGNORECASE)
        analysis = analysis.strip()
        result["analysis"] = analysis
    
    # Tìm phần "Dịch nghĩa cả câu:"
    # Có thể không có khoảng trắng trước "Dịch nghĩa cả câu"
    translation_match = re.search(r'Dịch nghĩa cả câu:\s*(.+?)(?=Từ vựng|$)', explanation_text, re.IGNORECASE | re.DOTALL)
    if translation_match:
        translation = translation_match.group(1).strip()
        result["translation"] = translation
    else:
        # Thử tìm không có dấu hai chấm
        translation_match = re.search(r'Dịch nghĩa cả câu\s*(.+?)(?=Từ vựng|$)', explanation_text, re.IGNORECASE | re.DOTALL)
        if translation_match:
            translation = translation_match.group(1).strip()
            result["translation"] = translation
    
    # Tạo explanation: "Đáp án đúng: X. answer"
    if correct_answer:
        # Tìm text của đáp án đúng từ explanation (nếu có)
        answer_text = ""
        # Tìm trong phần "Giải thích:" hoặc sau "→ chọn đáp án"
        answer_pattern = rf'{correct_answer}\.\s*([^A-D]+?)(?=[A-D]\.|→|Dịch|Giải|$)'
        answer_match = re.search(answer_pattern, explanation_text)
        if answer_match:
            answer_text = answer_match.group(1).strip()
            # Remove trailing period if exists
            if answer_text.endswith('.'):
                answer_text = answer_text[:-1]
        
        if answer_text:
            result["explanation"] = f"Đáp án đúng: {correct_answer}. {answer_text}."
        else:
            result["explanation"] = f"Đáp án đúng: {correct_answer}."
    
    return result

def convert_question(old_question, question_index, activity_id):
    """
    Convert một question từ format cũ sang format mới (Part 5)
    """
    new_question = {
        "question_id": f"p5_q{question_index + 1}",
        "question_number": int(old_question.get("qnum", question_index + 1)),
    }
    
    # Question text
    new_question["questionText"] = old_question.get("question_text", "")
    
    # Options (parse từ answers)
    answers = old_question.get("answers", [])
    new_question["options"] = parse_answers(answers)
    
    # Correct answer
    new_question["correctAnswer"] = old_question.get("correct", "")
    
    # Parse explanation để lấy translation, analysis, explanation
    explanation_text = old_question.get("explanation", "")
    parsed = parse_explanation(explanation_text)
    
    new_question["translation"] = parsed["translation"]
    new_question["analysis"] = parsed["analysis"]
    new_question["explanation"] = parsed["explanation"]
    
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
            output_filename = f"file-part5-{activity_num}.json"
            output_path = os.path.join(script_dir, output_filename)
            convert_file(input_path, output_path)

if __name__ == "__main__":
    main()

