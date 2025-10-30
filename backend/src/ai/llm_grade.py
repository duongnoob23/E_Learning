import sys
import json
import re
from gpt4all import GPT4All

# Đường dẫn model đã tải sẵn
model_path = r"C:\gpt4all\gpt4all-falcon-q4_0.gguf"
model = GPT4All(model_path)

# --- Hàm làm sạch output trước khi parse JSON ---
def clean_json_output(text):
    # Bỏ phần comment kiểu # ...
    cleaned = re.sub(r'#.*', '', text)
    # Bỏ dấu ```json hoặc ``` trong output
    cleaned = cleaned.replace("```json", "").replace("```", "")
    # Cắt khoảng trắng đầu cuối
    cleaned = cleaned.strip()
    # Giữ lại nội dung nằm trong ngoặc nhọn nếu có
    match = re.search(r'\{.*\}', cleaned, re.DOTALL)
    if match:
        cleaned = match.group(0)
    return cleaned

# --- Hàm chấm điểm ---
def grade_exam(data):
    text = data.get("text", "")
    exam_type = data.get("type", "WRITING")
    language = data.get("language", "en")

    if not text:
        return {
            "score": None,
            "feedback": "Không có nội dung để chấm",
            "grammar": None,
            "vocabulary": None,
            "fluency": None
        }

    # Prompt yêu cầu LLM trả JSON thật
    prompt = f"""
You are an English teacher grading a student's {exam_type} test.
Language: {language}.
Student's answer: {text}

Return ONLY a valid JSON (no comments, no explanations, no markdown) in this format:
{{
  "score": float,
  "feedback": string,
  "grammar": float,
  "vocabulary": float,
  "fluency": float
}}
"""

    try:
        with model.chat_session():
            raw_response = model.generate(prompt, max_tokens=400)
            cleaned = clean_json_output(raw_response)

            try:
                return json.loads(cleaned)
            except json.JSONDecodeError:
                # Nếu model trả linh tinh, đưa toàn bộ vào feedback
                return {
                    "score": None,
                    "feedback": raw_response,
                    "grammar": None,
                    "vocabulary": None,
                    "fluency": None
                }

    except Exception as e:
        return {
            "score": None,
            "feedback": f"Lỗi khi chấm: {str(e)}",
            "grammar": None,
            "vocabulary": None,
            "fluency": None
        }

# --- In JSON an toàn ---
def safe_print_json(data):
    text = json.dumps(data, ensure_ascii=False)
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding))

# --- Main ---
def main():
    if len(sys.argv) < 2:
        safe_print_json({"error": "Thiếu argument JSON input"})
        sys.exit(1)
    try:
        data = json.loads(sys.argv[1])
    except Exception as e:
        safe_print_json({"error": f"JSON input không hợp lệ: {str(e)}"})
        sys.exit(1)

    result = grade_exam(data)
    safe_print_json(result)

if __name__ == "__main__":
    main()
