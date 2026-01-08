import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStartExamSession } from "../../../services/Assessment/assessmentMutations";
import "../AssessmentCSS/PartSelector.css";
import Comment from "./Comment.jsx";
const partList = [
  {
    id: 1,
    title: "Part 1",
    count: 6,
    tags: ["[Part 1] Tranh tả người", "[Part 1] Tranh tả cả người và vật"],
  },
  {
    id: 2,
    title: "Part 2",
    count: 25,
    tags: [
      "[Part 2] Câu hỏi WHAT",
      "[Part 2] Câu hỏi WHO",
      "[Part 2] Câu hỏi WHERE",
      "[Part 2] Câu hỏi WHEN",
      "[Part 2] Câu hỏi HOW",
      "[Part 2] Câu hỏi WHY",
      "[Part 2] Câu hỏi YES/NO",
      "[Part 2] Câu hỏi đuôi",
      "[Part 2] Câu hỏi lựa chọn",
      "[Part 2] Câu yêu cầu, đề nghị",
      "[Part 2] Câu trần thuật",
    ],
  },
  {
    id: 3,
    title: "Part 3",
    count: 39,
    tags: [
      "[Part 3] Câu hỏi về chủ đề, mục đích",
      "[Part 3] Câu hỏi về danh tính người nói",
      "[Part 3] Câu hỏi về chi tiết cuộc hội thoại",
      "[Part 3] Câu hỏi về hành động tương lai",
      "[Part 3] Câu hỏi kết hợp bảng biểu",
      "[Part 3] Câu hỏi về hàm ý câu nói",
      "[Part 3] Chủ đề: Company - General Office Work",
      "[Part 3] Chủ đề: Company - Business, Marketing",
      "[Part 3] Chủ đề: Company - Event, Project",
      "[Part 3] Chủ đề: Company - Facility",
      "[Part 3] Chủ đề: Shopping, Service",
      "[Part 3] Chủ đề: Order, delivery",
      "[Part 3] Chủ đề: Housing",
      "[Part 3] Câu hỏi về địa điểm hội thoại",
      "[Part 3] Câu hỏi về yêu cầu, gợi ý",
    ],
  },
  {
    id: 4,
    title: "Part 4",
    count: 30,
    tags: [
      "[Part 4] Câu hỏi về chủ đề, mục đích",
      "[Part 4] Câu hỏi về danh tính, địa điểm",
      "[Part 4] Câu hỏi về chi tiết",
      "[Part 4] Câu hỏi về hành động tương lai",
      "[Part 4] Câu hỏi kết hợp bảng biểu",
      "[Part 4] Câu hỏi về hàm ý câu nói",
      "[Part 4] Dạng bài: Telephone message - Tin nhắn thoại",
      "[Part 4] Dạng bài: Advertisement - Quảng cáo",
      "[Part 4] Dạng bài: Announcement - Thông báo",
      "[Part 4] Dạng bài: Talk - Bài phát biểu, diễn văn",
      "[Part 4] Dạng bài: Excerpt from a meeting - Trích dẫn từ buổi họp",
      "[Part 4] Câu hỏi yêu cầu, gợi ý",
    ],
  },
  {
    id: 5,
    title: "Part 5",
    count: 30,
    tags: [
      "[Part 5] Câu hỏi từ loại",
      "[Part 5] Câu hỏi ngữ pháp",
      "[Part 5] Câu hỏi từ vựng",
      "[Grammar] Danh từ",
      "[Grammar] Đại từ",
      "[Grammar] Tính từ",
      "[Grammar] Thì",
      "[Grammar] Trạng từ",
      "[Grammar] Động từ nguyên mẫu có to",
      "[Grammar] Động từ nguyên mẫu",
      "[Grammar] Phân từ và cấu trúc phân từ",
      "[Grammar] Giới từ",
      "[Grammar] Liên từ",
      "[Grammar] Mệnh đề quan hệ",
    ],
  },
  {
    id: 6,
    title: "Part 6",
    count: 16,
    tags: [
      "[Part 6] Câu hỏi từ loại",
      "[Part 6] Câu hỏi ngữ pháp",
      "[Part 6] Câu hỏi từ vựng",
      "[Part 6] Câu hỏi điền câu vào đoạn văn",
      "[Part 6] Hình thức: Thư điện tử/ thư tay (Email/ Letter)",
      "[Part 6] Hình thức: Quảng cáo (Advertisement)",
      "[Part 6] Hình thức: Thông báo/ văn bản hướng dẫn (Notice/ Announcement Information)",
      "[Part 6] Hình thức: Thông báo nội bộ (Memo)",
      "[Grammar] Danh từ",
      "[Grammar] Tính từ",
      "[Grammar] Thì",
      "[Grammar] Thể",
      "[Grammar] Trạng từ",
      "[Grammar] Danh động từ",
      "[Grammar] Động từ nguyên mẫu",
      "[Grammar] Giới từ",
      "[Grammar] Liên từ",
    ],
  },
  {
    id: 7,
    title: "Part 7",
    count: 54,
    tags: [
      "[Part 7] Câu hỏi tìm thông tin",
      "[Part 7] Câu hỏi tìm chi tiết sai",
      "[Part 7] Câu hỏi về chủ đề, mục đích",
      "[Part 7] Câu hỏi suy luận",
      "[Part 7] Câu hỏi điền câu",
      "[Part 7] Cấu trúc: Một đoạn",
      "[Part 7] Cấu trúc: Nhiều đoạn",
      "[Part 7] Dạng bài: Email/ Letter - Thư điện tử/ Thư tay",
      "[Part 7] Dạng bài: Form - Đơn từ, biểu mẫu",
      "[Part 7] Dạng bài: Article/ Review - Bài báo/ Bài đánh giá",
      "[Part 7] Dạng bài: Advertisement - Quảng cáo",
      "[Part 7] Dạng bài: Announcement/ Notice - Thông báo",
      "[Part 7] Dạng bài: Text message chain - Chuỗi tin nhắn",
      "[Part 7] Câu hỏi tìm từ đồng nghĩa",
      "[Part 7] Câu hỏi về hàm ý câu nói",
      "[Part 7] Dạng bài: List/ Menu - Danh sách/ Thực đơn",
    ],
  },
];

const PartSelector = (Props) => {
  const { data, testId } = Props;
  const [selectPart, setSelectPart] = useState([]);
  const navigate = useNavigate();

  const { mutateAsync: createStartExam, isPending: loadingStartExam } =
    useStartExamSession();

  const handleSelectPart = (id) => {
    if (selectPart.includes(id)) {
      // Nếu đã có -> bỏ ra
      const newSelectPart = selectPart.filter((s) => s !== id);
      setSelectPart(newSelectPart);
    } else {
      // Nếu chưa có -> thêm vào
      const newSelectPart = [...selectPart, id];
      setSelectPart(newSelectPart);
    }
  };

  const handleStartTest = async () => {
    const testId = Props?.testId;
    const session_type = "FULL_TEST";
    const time_limit_minutes = 120;
    const selected_parts = selectPart;
    if (selectPart.length === 0) {
      toast.warn("Vui lòng chọn phần thi");
      return;
    }

    const result = await createStartExam({
      test_id: testId,
      session_type,
      selected_parts,
      time_limit_minutes,
    });

    if (result && +result?.EC === 0) {
      // ✅ Truyền sessionData qua navigation
      navigate("/assessmentTest", {
        state: {
          sessionData: result.DT,
          partData: data,
        },
      });
    }
  };

  const _getPartFake = (id) => {
    const data = partList.find((p) => p.id === id);
    return data;
  };

  return (
    <>
      <div className="assessment-part">
        <div className="assessment-banner">
          Pro tips: Hình thức luyện tập từng phần và chọn mức thời gian phù
          hợp sẽ giúp bạn tập trung vào giải đúng các câu hỏi thay vì phải chịu
          áp lực hoàn thành bài thi.
        </div>

        {data &&
          data?.map((part, index) => {
            const fakePart = _getPartFake(index + 1);

            return (
              <div key={part.part_id} className="assessment-part__section">
                <label className="assessment-part__header">
                  <input
                    type="checkbox"
                    className="assessment-part__checkbox"
                    onClick={() => handleSelectPart(part.part_number)}
                  />
                  <span className="assessment-part__title">
                    {part?.part_name} ({part?.question_count} câu hỏi){" "}
                  </span>
                </label>
                <label className="assessment-part__header">
                  <span className="assessment-part__title">
                    {part?.description}
                  </span>
                </label>

                {/* ✅ Hiển thị tag nếu tồn tại trong partList */}
                {fakePart && (
                  <div className="assessment-part__tags">
                    {fakePart.tags.map((tag, i) => (
                      <span key={i} className="assessment-part__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {/* Giới hạn thời gian */}
        <div className="assessment-part__time">
          <label>Giới hạn thời gian (Để trống để làm bài không giới hạn)</label>
          <div className="assessment-part__time-inputs">
            <input
              type="number"
              placeholder="Giờ"
              min="0"
              className="assessment-part__input"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="Phút"
              min="0"
              max="59"
              className="assessment-part__input"
            />
          </div>
        </div>

        {/* Nút luyện tập */}
        <div className="assessment-part__actions">
          <button
            className="assessment-part__start-btn"
            onClick={() => handleStartTest()}
          >
            🎯 Bắt đầu luyện tập
          </button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
        }}
      ></div>
      <Comment testId={testId} />
    </>
  );
};

export default PartSelector;
