import json
import mysql.connector
from mysql.connector import Error
from datetime import datetime

# ⚙️ Cấu hình DB
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "e_learnning6"
}

JSON_FILE = "224.json"  # file JSON của bạn

# 🧭 Mapping JSON → bảng MySQL
FIELD_MAPPING = {
    "question_id": "question_id",
    "question_number": "question_number",
    "question_text": "question_text",
    "audio_url": "audio_file",
    "image_url": "image_file",
    "transcript_clean": "transcript",
    "explanation_clean": "explanation",
    "reading_text_clean": "reading_text"
}


def get_connection():
    """Kết nối MySQL"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            print("✅ Đã kết nối MySQL!")
            return conn
    except Error as e:
        print("❌ Lỗi kết nối:", e)
        return None


def get_part_id(question_number: int):
    """Xác định part_id theo số câu (bắt đầu từ 15)"""
    if 1 <= question_number <= 6:
        return 15  # Part 1
    elif 7 <= question_number <= 31:
        return 16  # Part 2
    elif 32 <= question_number <= 70:
        return 17  # Part 3
    elif 71 <= question_number <= 100:
        return 18  # Part 4
    elif 101 <= question_number <= 130:
        return 19  # Part 5
    elif 131 <= question_number <= 146:
        return 20  # Part 6
    elif 147 <= question_number <= 200:
        return 21  # Part 7
    return None


def insert_questions():
    try:
        # Đọc JSON
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Nếu file là 1 object duy nhất → chuyển thành list
        if isinstance(data, dict):
            data = [data]

        conn = get_connection()
        cursor = conn.cursor()

        count = 0
        for item in data:
            mapped = {}

            # Ánh xạ JSON sang cột DB
            for json_field, db_field in FIELD_MAPPING.items():
                value = item.get(json_field)
                if isinstance(value, list):
                    value = value[0] if len(value) > 0 else None
                mapped[db_field] = value

            # Tự động xác định part_id theo số câu
            qnum = int(mapped.get("question_number") or 0)
            mapped["part_id"] = get_part_id(qnum)

            # Gán giá trị mặc định
            mapped["question_type"] = "MULTIPLE_CHOICE"
            mapped["grammar_notes"] = None
            mapped["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            mapped["updated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Tạo câu lệnh SQL insert
            columns = ", ".join(mapped.keys())
            placeholders = ", ".join(["%s"] * len(mapped))
            sql = f"INSERT INTO questions ({columns}) VALUES ({placeholders})"
            cursor.execute(sql, tuple(mapped.values()))
            count += 1

        conn.commit()
        print(f"✅ Đã chèn {count} bản ghi vào bảng questions!")

    except Exception as e:
        print("⚠️ Lỗi:", e)
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()


if __name__ == "__main__":
    insert_questions()
