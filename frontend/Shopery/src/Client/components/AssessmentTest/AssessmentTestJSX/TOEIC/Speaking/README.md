# TOEIC Speaking Component

## Cấu trúc

```
TOEIC/Speaking/
├── SpeakingPart.jsx          # Component chính
├── components/
│   ├── QuestionCard.jsx      # Hiển thị nội dung câu hỏi (trái)
│   ├── NotesAndRecorder.jsx  # Ghi chú + ghi âm (phải)
│   └── AudioPlayerSimple.jsx # Player audio
└── hooks/
    └── useAudioRecorder.js   # Hook quản lý MediaRecorder
```

## Cách sử dụng

Component sẽ tự động fetch questions từ API khi nhận `partData`.

## Dữ liệu mẫu để test

Để test giao diện, bạn cần có dữ liệu từ API với format:

```json
{
  "EC": "0",
  "DT": [
    {
      "question_id": "q_1",
      "question_number": 1,
      "part_number": 1,
      "part_id": "p_speaking",
      "type": "read-aloud",
      "content": {
        "text": "The city's annual summer festival will take place next Saturday and Sunday..."
      },
      "max_record_seconds": 45
    },
    {
      "question_id": "q_2",
      "question_number": 2,
      "part_number": 1,
      "part_id": "p_speaking",
      "type": "read-aloud",
      "content": {
        "text": "Could we have your attention, please?..."
      },
      "max_record_seconds": 45
    }
    // ... 5 câu nữa (tổng 7 câu)
  ]
}
```

## Test trong AssessmentList

Để test, bạn cần:

1. Tạo một test với `skill_type = "speaking"` trong database
2. Hoặc mock API response trong `assessmentApi.js`
3. Click vào test đó trong AssessmentList để vào trang test
