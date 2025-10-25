import json

def get_question_ids(json_file_path):
    try:
        # Đọc file JSON
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Lấy mảng các question_id
        question_ids = [item['question_id'] for item in data if 'question_id' in item]
        
        return question_ids
    
    except FileNotFoundError:
        print(f"Không tìm thấy file: {json_file_path}")
        return []
    except json.JSONDecodeError:
        print("Lỗi: File JSON không hợp lệ")
        return []
    except Exception as e:
        print(f"Đã xảy ra lỗi: {str(e)}")
        return []

# Ví dụ sử dụng
if __name__ == "__main__":
    # Đường dẫn tới file JSON
    json_file_path = "1212.json"  # Thay bằng đường dẫn file JSON của bạn
    
    # Gọi hàm và in kết quả
    result = get_question_ids(json_file_path)
    print("Danh sách question_id:", result)