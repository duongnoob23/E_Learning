# API Phân Tích Kết Quả Theo Tag

## Endpoint
```
GET /api/exam-sessions/{session_id}/result-by-tags
```

## Mô tả
API này trả về kết quả phân tích chi tiết theo từng tag/phân loại câu hỏi của một phiên thi đã hoàn thành.

## Authentication
- Yêu cầu JWT token trong header Authorization
- User chỉ có thể xem kết quả của phiên thi của chính mình

## Parameters
- `session_id` (path parameter): ID của phiên thi đã hoàn thành

## Response Format

### Success Response (EC: "0")
```json
{
  "EM": "Lấy kết quả phân tích theo tag thành công",
  "EC": "0",
  "DT": {
    "session_info": {
      "session_id": 123,
      "test_id": 1,
      "total_score": 85,
      "start_time": "2024-01-15T10:00:00.000Z",
      "end_time": "2024-01-15T12:00:00.000Z",
      "duration_seconds": 7200
    },
    "overall_statistics": {
      "total_questions": 100,
      "total_correct": 85,
      "total_wrong": 12,
      "total_skipped": 3,
      "overall_accuracy": "85.00"
    },
    "tag_analysis": [
      {
        "tag_name": "[Grammar] Liên từ",
        "tag_description": "Câu hỏi về liên từ trong tiếng Anh",
        "total_questions": 5,
        "correct_answers": 3,
        "wrong_answers": 2,
        "skipped_answers": 0,
        "accuracy_rate": "60.00",
        "question_list": [
          {
            "question_id": 101,
            "question_number": 15,
            "question_text": "Choose the correct conjunction to complete the sentence...",
            "is_correct": true,
            "selected_choice_id": 405
          },
          {
            "question_id": 102,
            "question_number": 23,
            "question_text": "Which conjunction best fits in the blank...",
            "is_correct": false,
            "selected_choice_id": 408
          }
        ]
      },
      {
        "tag_name": "[Part 6] Câu hỏi từ loại",
        "tag_description": "Câu hỏi về từ loại trong Part 6",
        "total_questions": 8,
        "correct_answers": 7,
        "wrong_answers": 1,
        "skipped_answers": 0,
        "accuracy_rate": "87.50",
        "question_list": [...]
      }
    ]
  }
}
```

### Error Responses

#### Session không tồn tại hoặc chưa hoàn thành (EC: "2")
```json
{
  "EM": "Không tìm thấy phiên thi hoặc phiên thi chưa hoàn thành",
  "EC": "2",
  "DT": null
}
```

#### Không có câu trả lời (EC: "2")
```json
{
  "EM": "Không tìm thấy câu trả lời",
  "EC": "2",
  "DT": null
}
```

#### Lỗi server (EC: "1")
```json
{
  "EM": "Lỗi server khi lấy kết quả phân tích theo tag",
  "EC": "1",
  "DT": null
}
```

## Cách sử dụng

### 1. Frontend Integration
```javascript
// Gọi API để lấy kết quả phân tích theo tag
const getResultByTags = async (sessionId) => {
  try {
    const response = await fetch(`/api/exam-sessions/${sessionId}/result-by-tags`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.EC === "0") {
      // Hiển thị kết quả phân tích
      displayTagAnalysis(data.DT);
    } else {
      console.error(data.EM);
    }
  } catch (error) {
    console.error('Error fetching tag analysis:', error);
  }
};

// Hiển thị kết quả phân tích
const displayTagAnalysis = (data) => {
  const { session_info, overall_statistics, tag_analysis } = data;
  
  // Hiển thị thông tin tổng quan
  console.log('Overall Accuracy:', overall_statistics.overall_accuracy + '%');
  
  // Hiển thị phân tích theo từng tag
  tag_analysis.forEach(tag => {
    console.log(`${tag.tag_name}: ${tag.accuracy_rate}% (${tag.correct_answers}/${tag.total_questions})`);
  });
};
```

### 2. Hiển thị dạng bảng (như trong hình)
```javascript
const renderTagTable = (tagAnalysis) => {
  const tableHTML = `
    <table class="tag-analysis-table">
      <thead>
        <tr>
          <th>Phân loại câu hỏi</th>
          <th>Số câu đúng</th>
          <th>Số câu sai</th>
          <th>Số câu bỏ qua</th>
          <th>Độ chính xác</th>
          <th>Danh sách câu hỏi</th>
        </tr>
      </thead>
      <tbody>
        ${tagAnalysis.map(tag => `
          <tr>
            <td>${tag.tag_name}</td>
            <td class="correct">${tag.correct_answers}</td>
            <td class="wrong">${tag.wrong_answers}</td>
            <td class="skipped">${tag.skipped_answers}</td>
            <td class="accuracy">${tag.accuracy_rate}%</td>
            <td>
              ${tag.question_list.map(q => `
                <span class="question-badge ${q.is_correct ? 'correct' : 'wrong'}">
                  ${q.question_number}
                </span>
              `).join('')}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  document.getElementById('tag-analysis-container').innerHTML = tableHTML;
};
```

## Database Requirements

Để API này hoạt động, cần đảm bảo:

1. **Bảng exam_tags** có dữ liệu tag/phân loại câu hỏi
2. **Bảng question_tags** có liên kết giữa câu hỏi và tag
3. **Phiên thi** phải có status = 'COMPLETED'
4. **Câu trả lời** phải có is_correct được tính toán đúng

## Notes

- API chỉ trả về kết quả của phiên thi đã hoàn thành
- Mỗi câu hỏi có thể thuộc nhiều tag khác nhau
- Accuracy rate được tính theo công thức: (correct_answers / total_questions) * 100
- Question text được cắt ngắn để tối ưu performance
- Kết quả được sắp xếp theo tên tag (alphabetical order)
