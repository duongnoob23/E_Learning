import json
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import re

# ⚙️ Cấu hình DB
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "e_learnning6",
    "charset": "utf8mb4"
}

# 🧭 Mapping JSON → bảng MySQL
FIELD_MAPPING = {
    "question_id": "question_id",
    "question_number": "question_number",
    "question_text": "question_text",
    "audio_url": "audio_file",
    "image_url": "image_file",
    "transcript_clean": "transcript",
    "explanation_clean": "explanation",
    "reading_text": "reading_text"
}




# 📘 Kết nối MySQL
def get_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            print("✅ Đã kết nối MySQL!")
            return conn
    except Error as e:
        print("❌ Lỗi kết nối:", e)
        return None

JSON_FILE = "1212.json"  # 🔹 File JSON cần nhập
# 🔢 Xác định part_id
def get_part_id(question_number: int):
    if 1 <= question_number <= 6:
        return 120  
    elif 7 <= question_number <= 31:
        return 121
    elif 32 <= question_number <= 70:
        return 122
    elif 71 <= question_number <= 100:
        return 123
    elif 101 <= question_number <= 130:
        return 124
    elif 131 <= question_number <= 146:
        return 125
    elif 147 <= question_number <= 200:
        return 126
    return None


# 🧩 Hàm tách đáp án
def extract_choices_from_text(text):
    """Tách đáp án từ transcript_clean có dạng (A)...(B)..."""
    text = re.sub(r"\s+", " ", text.strip())
    pattern = r"\(([A-D])\)\s*(.*?)(?=\([A-D]\)|$)"
    return re.findall(pattern, text, re.DOTALL)


# 🧠 Hàm xử lý reading_text thông minh
def extract_reading_text(item):
    reading_html = item.get("reading_text")
    reading_clean = item.get("reading_text_clean")

    if reading_html and 'src="' in reading_html:
        match = re.search(r'src="([^"]+)"', reading_html)
        if match:
            return match.group(1).strip()

    # fallback sang reading_text_clean nếu không có ảnh
    if reading_clean:
        return reading_clean.strip()

    return None


# 🚀 Hàm chính
def insert_questions_and_choices():
    try:
        # --- Đọc file JSON ---
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict):
            data = [data]

        conn = get_connection()
        cursor = conn.cursor()

        inserted_q = 0
        inserted_c = 0

        # --- Lặp qua từng câu hỏi ---
        for item in data:
            mapped = {}

            # Ánh xạ JSON → DB
            for json_field, db_field in FIELD_MAPPING.items():
                value = item.get(json_field)
                if isinstance(value, list):
                    value = value[0] if len(value) > 0 else None

                # 🧠 Xử lý riêng cho reading_text
                if json_field == "reading_text":
                    value = extract_reading_text(item)

                mapped[db_field] = value

            # Xác định part_id
            qnum = int(mapped.get("question_number") or 0)
            mapped["part_id"] = get_part_id(qnum)

            # Thêm các trường phụ
            mapped["question_type"] = "MULTIPLE_CHOICE"
            mapped["grammar_notes"] = None
            mapped["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            mapped["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # --- INSERT INTO questions ---
            columns = ", ".join(mapped.keys())
            placeholders = ", ".join(["%s"] * len(mapped))
            sql = f"INSERT INTO questions ({columns}) VALUES ({placeholders})"
            cursor.execute(sql, tuple(mapped.values()))
            inserted_q += 1

            # --- Lấy ID của câu hỏi vừa chèn ---
            question_id = cursor.lastrowid
            correct_answer = (item.get("correct_answer") or "").strip().upper()

            # --- Tách đáp án ---
            transcript = item.get("transcript_clean") or ""
            choices = extract_choices_from_text(transcript)

            # Nếu không có, fallback sang answer_text
            if not choices and isinstance(item.get("answer_text"), list):
                choices = []
                for ans in item["answer_text"]:
                    ans = ans.strip()
                    match = re.match(r"([A-D])[\.\)]\s*(.*)", ans)
                    if match:
                        choices.append((match.group(1), match.group(2).strip()))

            if not choices:
                print(f"⚠️ Không tách được lựa chọn cho câu {mapped.get('question_number')}")
                continue

            # --- INSERT INTO choices ---
            for label, content in choices:
                is_correct = 1 if label == correct_answer else 0
                cursor.execute("""
                    INSERT INTO choices (question_id, choice_letter, choice_text, is_correct)
                    VALUES (%s, %s, %s, %s)
                """, (question_id, label, content.strip(), is_correct))
                inserted_c += 1

        conn.commit()
        print(f"✅ Đã chèn {inserted_q} câu hỏi và {inserted_c} lựa chọn thành công!")

    except Exception as e:
        print("⚠️ Lỗi:", e)
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()


# 🚀 Chạy chương trình
if __name__ == "__main__":
    insert_questions_and_choices()
