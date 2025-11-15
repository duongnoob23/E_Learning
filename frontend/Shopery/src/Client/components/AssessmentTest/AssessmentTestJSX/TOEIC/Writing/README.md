# TOEIC Writing Component

## Cấu trúc

```
TOEIC/Writing/
└── WritingPart.jsx          # Component chính (bao gồm QuestionContent và NotesAndEssay)
```

## Cách sử dụng

Component sẽ tự động fetch questions từ API khi nhận `partData`.

## Dữ liệu mẫu để test

Để test giao diện, bạn cần có dữ liệu từ API với format:

### Questions 1-5 (Describe Picture):
```json
{
  "question_id": "q_1",
  "question_number": 1,
  "part_number": 1,
  "type": "describe-picture",
  "content": {
    "image_file": "https://example.com/image.jpg"
  }
}
```

### Questions 6-7 (Respond to Email):
```json
{
  "question_id": "q_6",
  "question_number": 6,
  "part_number": 1,
  "type": "respond-email",
  "content": {
    "email": {
      "from": "update@dailyjobseeker.com",
      "to": "Anna Billings",
      "subject": "Daily Jobseeker update",
      "sent": "March 14, 20-",
      "body": "Dear Daily Jobseeker subscriber,\n\nHere is the most recent job opening:..."
    },
    "directions": "Respond to the e-mail as if you are interested in applying for the position..."
  }
}
```

### Question 8 (Write Essay):
```json
{
  "question_id": "q_8",
  "question_number": 8,
  "part_number": 1,
  "type": "write-essay",
  "content": {
    "text": "Write an essay about..."
  }
}
```

## Test trong AssessmentList

Để test, bạn cần:
1. Tạo một test với `skill_type = "writing"` trong database
2. Hoặc mock API response trong `assessmentApi.js`
3. Click vào test đó trong AssessmentList để vào trang test

