# Hướng dẫn Test TOEIC Speaking & Writing

## Cách 1: Mock API Response (Nhanh nhất để test giao diện)

### Bước 1: Mở file `assessmentApi.js`

Tìm function `getPartQuestions` và tạm thời thêm mock:

```javascript
getPartQuestions: async (partId) => {
  // TẠM THỜI: Mock data để test
  if (partId === "p_speaking" || partId === "test_speaking_part") {
    const { mockSpeakingQuestions } = await import("./TOEIC/mockTestData");
    return mockSpeakingQuestions;
  }
  if (partId === "p_writing" || partId === "test_writing_part") {
    const { mockWritingQuestions } = await import("./TOEIC/mockTestData");
    return mockWritingQuestions;
  }
  
  // Code gốc
  const response = await axiosInstance.get(`/exam/parts/${partId}/questions`);
  return response.data;
},
```

### Bước 2: Thêm test vào AssessmentList

Trong file `assessmentQueries.js`, tạm thời thêm mock test:

```javascript
export const useTests = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.assessment.list(filters),
    queryFn: async () => {
      const data = await assessmentApi.getTests(filters);
      
      // TẠM THỜI: Thêm mock tests
      const { mockSpeakingTest, mockWritingTest } = await import("../components/AssessmentTest/AssessmentTestJSX/TOEIC/mockTestData");
      
      if (data?.DT?.tests) {
        data.DT.tests.push(mockSpeakingTest, mockWritingTest);
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```

### Bước 3: Tạo session data khi click vào test

Trong `Detail.jsx` hoặc nơi start session, đảm bảo `skill_type` được set đúng:

```javascript
// Cho Speaking test
const sessionData = {
  test_id: "test_speaking_001",
  exam_type: "toeic",
  skill_type: "speaking", // Quan trọng!
  selected_parts: JSON.stringify([1]),
  // ...
};

// Cho Writing test
const sessionData = {
  test_id: "test_writing_001",
  exam_type: "toeic",
  skill_type: "writing", // Quan trọng!
  selected_parts: JSON.stringify([1]),
  // ...
};
```

## Cách 2: Thêm vào Database (Lâu dài)

1. Thêm 2 test mới vào bảng `tests`:
   - `test_id`: "test_speaking_001", `skill_type`: "speaking"
   - `test_id`: "test_writing_001", `skill_type`: "writing"

2. Thêm part cho mỗi test:
   - Speaking: `part_number`: 1, `part_id`: "p_speaking"
   - Writing: `part_number`: 1, `part_id`: "p_writing"

3. Thêm questions với format như trong `mockTestData.js`

## Kiểm tra

1. Vào trang Assessment List
2. Tìm "TOEIC Speaking Practice Test" hoặc "TOEIC Writing Practice Test"
3. Click vào để bắt đầu test
4. Kiểm tra giao diện:
   - Speaking: Text bên trái, Notes + Recorder bên phải
   - Writing: Email/Picture bên trái, Notes + Essay bên phải
   - Tabs navigation hoạt động đúng
   - Recording hoạt động (cần microphone permission)

## Lưu ý

- Để test recording, cần cấp quyền microphone trong browser
- Chrome/Edge hỗ trợ tốt nhất MediaRecorder
- Nếu không có microphone, có thể test giao diện bằng cách click vào nút Record (sẽ hiện lỗi permission)

