import json
import mysql.connector
import re

# --- Cấu hình DB ---
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="e_learnning6",
    charset="utf8mb4"
)
print("✅ Đã kết nối MySQL!")
cursor = db.cursor()

# --- Đọc file JSON ---
with open("224.json", "r", encoding="utf-8") as f:
    data = json.load(f)

count = 0

def extract_choices_from_text(text):
    """Tách đáp án từ transcript_clean có dạng (A)...(B)..."""
    text = re.sub(r"\s+", " ", text.strip())
    pattern = r"\(([A-D])\)\s*(.*?)(?=\([A-D]\)|$)"
    return re.findall(pattern, text, re.DOTALL)

for q in data:
    question_id = q.get("question_id")
    correct_answer = q.get("correct_answer", "").strip().upper()

    # --- 1️⃣ Tách từ transcript_clean ---
    transcript = q.get("transcript_clean") or ""
    choices = extract_choices_from_text(transcript)

    # --- 2️⃣ Nếu không có → fallback qua answer_text ---
    if not choices and isinstance(q.get("answer_text"), list):
        choices = []
        for ans in q["answer_text"]:
            ans = ans.strip()
            match = re.match(r"([A-D])[\.\)]\s*(.*)", ans)
            if match:
                choices.append((match.group(1), match.group(2).strip()))

    # --- 3️⃣ Nếu vẫn không có ---
    if not choices:
        print(f"⚠️ Không tách được lựa chọn cho câu {question_id}")
        continue

    # --- 4️⃣ Chèn vào DB ---
    for label, content in choices:
        is_correct = 1 if label == correct_answer else 0
        choice_letter = label
        choice_text = content.strip()

        cursor.execute("""
            INSERT INTO choices (question_id, choice_letter, choice_text, is_correct)
            VALUES (%s, %s, %s, %s)
        """, (question_id, choice_letter, choice_text, is_correct))
        count += 1

db.commit()
cursor.close()
db.close()

print(f"✅ Đã chèn {count} dòng vào bảng choices!")
