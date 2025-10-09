import React, { useState } from "react";
import "../AssessmentCSS/AssessmentComment.css";

export default function AssessmentComment() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "study4",
      date: "Tháng sáu 10, 2025",
      text: `STUDY4 hiện đã có group cộng đồng chia sẻ kinh nghiệm luyện thi TOEIC cũng như hỗ trợ học viên trên Facebook, mọi người cùng tham gia nhé ^^: https://www.facebook.com/groups/517057750992723`,
      replies: [],
      isPinned: true,
    },
    {
      id: 2,
      author: "taotharouot68",
      date: "Tháng 10. 04, 2025",
      text: "đề khá lỏ, p2 phải nghe lại vài lần nhưng vẫn đc 910",
      replies: [],
    },
    {
      id: 3,
      author: "lingyun2302",
      date: "Tháng 9. 25, 2025",
      text: "Câu 5 củ chuối vậy trời, đáp án B và D đều hợp lý mà.",
      replies: [
        {
          id: 31,
          author: "tuancong309",
          date: "Tháng 10. 03, 2025",
          text: "Cơ bản là tay ông chỉ chạm vào thôi nhưng chưa chắc đã di chuyển được...",
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    if (replyingTo) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: Date.now(),
                    author: "Bạn",
                    date: "Vừa xong",
                    text: newComment,
                  },
                ],
              }
            : c
        )
      );
    } else {
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          author: "Bạn",
          date: "Vừa xong",
          text: newComment,
          replies: [],
        },
      ]);
    }
    setNewComment("");
    setReplyingTo(null);
  };

  const handleReply = (id) => {
    setReplyingTo(id);
  };

  return (
    <div className="comment">
      <div className="comment__form">
        <input
          className="comment__input"
          type="text"
          placeholder="Chia sẻ cảm nghĩ của bạn ..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="comment__button" onClick={handleAddComment}>
          Gửi
        </button>
      </div>

      <div className="comment__list">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`comment__item ${
              comment.isPinned ? "comment__item--pinned" : ""
            }`}
          >
            <div className="comment__header">
              <div className="comment__author">{comment.author}</div>
              <div className="comment__date">{comment.date}</div>
            </div>
            <div className="comment__text">{comment.text}</div>
            <div className="comment__actions">
              <button
                className="comment__reply-btn"
                onClick={() => handleReply(comment.id)}
              >
                Trả lời
              </button>
            </div>

            {/* Reply list */}
            {comment.replies.length > 0 && (
              <div className="comment__replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="comment__reply">
                    <div className="comment__header">
                      <div className="comment__author">{reply.author}</div>
                      <div className="comment__date">{reply.date}</div>
                    </div>
                    <div className="comment__text">{reply.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="comment__more">Xem thêm</button>
    </div>
  );
}
