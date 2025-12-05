import React, { useState } from "react";
import {
  useAddComment,
  useCreateDiscussion,
} from "../../../services/Assessment/assessmentMutations";
import { useDiscussions } from "../../../services/Assessment/assessmentQueries";
import "../AssessmentCSS/Comment.css";

// Component hiển thị 1 comment đơn giản (không đệ quy)
function CommentItem({ comment, onReply, discussionId }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const addCommentMutation = useAddComment();

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(discussionId, null, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        <div className="avatar-circle">
          {comment.user?.full_name?.charAt(0)?.toUpperCase() ||
            comment.user?.username?.charAt(0)?.toUpperCase() ||
            "U"}
        </div>
      </div>

      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">
            {comment.user?.full_name || comment.user?.username || "Người dùng"}
          </span>
          <span className="comment-date">
            {new Date(comment.created_at).toLocaleDateString("vi-VN", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="comment-content">{comment.content}</div>

        <div className="comment-actions">
          <div
            className="comment-reply-btn"
            onClick={() => setShowReplyBox((prev) => !prev)}
          >
            {showReplyBox ? "Hủy" : "Trả lời"}
          </div>
        </div>

        {showReplyBox && (
          <div className="reply-box slide-in">
            <textarea
              placeholder="Chia sẻ cảm nghĩ của bạn..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            ></textarea>
            <div className="reply-actions">
              <button
                className="reply-cancel-btn"
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText("");
                }}
              >
                Hủy
              </button>
              <button
                className="reply-submit-btn"
                onClick={handleReply}
                disabled={!replyText.trim() || addCommentMutation.isPending}
              >
                {addCommentMutation.isPending ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Discussion(Props) {
  const [newDiscussion, setNewDiscussion] = useState("");
  const [showReplyBox, setShowReplyBox] = useState({});
  const [replyText, setReplyText] = useState({});
  const { testId } = Props;

  // Queries và Mutations
  const {
    data: discussionsData,
    isLoading,
    error,
    refetch,
  } = useDiscussions(testId);

  const createDiscussionMutation = useCreateDiscussion();
  const addCommentMutation = useAddComment();

  // Xử lý tạo discussion mới
  const handleCreateDiscussion = () => {
    if (!newDiscussion.trim()) return;

    createDiscussionMutation.mutate(
      {
        test_id: testId,
        title: "Thảo luận mới",
        content: newDiscussion,
      },
      {
        onSuccess: () => {
          setNewDiscussion("");
        },
      }
    );
  };

  // Xử lý thêm comment vào discussion
  const handleAddComment = (discussionId, parentCommentId, content) => {
    addCommentMutation.mutate(
      {
        discussionId,
        commentData: {
          content,
          parent_comment_id: null, // Luôn null vì chỉ có 1 cấp
        },
      },
      {
        onSuccess: () => {
          // Reset reply box cho discussion này
          setShowReplyBox((prev) => ({ ...prev, [discussionId]: false }));
          setReplyText((prev) => ({ ...prev, [discussionId]: "" }));
        },
      }
    );
  };

  // Toggle reply box cho discussion
  const toggleReplyBox = (discussionId) => {
    setShowReplyBox((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  // Handle reply text change
  const handleReplyTextChange = (discussionId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [discussionId]: value,
    }));
  };

  // Submit reply cho discussion
  const handleSubmitReply = (discussionId) => {
    const content = replyText[discussionId];
    if (!content?.trim()) return;
    handleAddComment(discussionId, null, content);
  };

  if (isLoading) {
    return (
      <div className="discussion-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thảo luận...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discussion-container">
        <div className="error-message">
          <p>Có lỗi xảy ra khi tải thảo luận</p>
          <button onClick={() => refetch()}>Thử lại</button>
        </div>
      </div>
    );
  }

  const discussions = discussionsData?.DT?.discussions || [];

  return (
    <div className="discussion-container">
      <div className="discussion-header">
        <h3>💬 Thảo luận ({discussions.length})</h3>
        <p>Chia sẻ ý kiến và thảo luận về đề thi này</p>
      </div>

      {/* Ô nhập thảo luận mới */}
      <div className="discussion-input">
        <div className="input-wrapper">
          <textarea
            placeholder="Chia sẻ cảm nghĩ của bạn về đề thi này..."
            value={newDiscussion}
            onChange={(e) => setNewDiscussion(e.target.value)}
            rows={3}
          ></textarea>
          <div className="input-actions">
            <button
              className="discussion-submit-btn"
              onClick={handleCreateDiscussion}
              disabled={
                !newDiscussion.trim() || createDiscussionMutation.isPending
              }
            >
              {createDiscussionMutation.isPending
                ? "Đang gửi..."
                : "Gửi thảo luận"}
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách discussions */}
      <div className="discussion-list">
        {discussions.length === 0 ? (
          <div className="no-discussion">
            <div className="no-discussion-icon">💭</div>
            <p>Chưa có thảo luận nào.</p>
            <p>Hãy là người đầu tiên chia sẻ ý kiến!</p>
          </div>
        ) : (
          discussions.map((discussion) => (
            <div
              key={discussion.test_discussion_id}
              className="discussion-item"
            >
              {/* Discussion chính */}
              <div className="discussion-main">
                <div className="comment-avatar">
                  <div className="avatar-circle">
                    {discussion.user?.full_name?.charAt(0)?.toUpperCase() ||
                      discussion.user?.username?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                </div>

                <div className="discussion-body">
                  <div className="discussion-header">
                    <span className="discussion-author">
                      {discussion.user?.full_name ||
                        discussion.user?.username ||
                        "Người dùng"}
                    </span>
                    <span className="discussion-date">
                      {new Date(discussion.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  <div className="discussion-content">{discussion.content}</div>

                  <div className="discussion-actions">
                    {/* <div className="comment-count">
                      💬 {discussion.comments?.length || 0} bình luận
                    </div> */}
                    <div
                      className="discussion-reply-btn"
                      onClick={() =>
                        toggleReplyBox(discussion.test_discussion_id)
                      }
                    >
                      {showReplyBox[discussion.test_discussion_id]
                        ? "Hủy"
                        : "Trả lời"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply box cho discussion */}
              {showReplyBox[discussion.test_discussion_id] && (
                <div className="discussion-reply-box slide-in">
                  <div className="reply-avatar">
                    <div className="avatar-circle">U</div>
                  </div>
                  <div className="reply-content">
                    <textarea
                      placeholder="Chia sẻ cảm nghĩ của bạn..."
                      value={replyText[discussion.test_discussion_id] || ""}
                      onChange={(e) =>
                        handleReplyTextChange(
                          discussion.test_discussion_id,
                          e.target.value
                        )
                      }
                      rows={3}
                    ></textarea>
                    <div className="reply-actions">
                      <button
                        className="reply-cancel-btn"
                        onClick={() => {
                          setShowReplyBox((prev) => ({
                            ...prev,
                            [discussion.test_discussion_id]: false,
                          }));
                          setReplyText((prev) => ({
                            ...prev,
                            [discussion.test_discussion_id]: "",
                          }));
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="reply-submit-btn"
                        onClick={() =>
                          handleSubmitReply(discussion.test_discussion_id)
                        }
                        disabled={
                          !replyText[discussion.test_discussion_id]?.trim() ||
                          addCommentMutation.isPending
                        }
                      >
                        {addCommentMutation.isPending ? "Đang gửi..." : "Gửi"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Danh sách comments của discussion */}
              <div className="comments-section">
                {discussion.comments && discussion.comments.length > 0 ? (
                  discussion.comments.map((comment) => (
                    <CommentItem
                      key={comment.test_comment_id}
                      comment={comment}
                      onReply={handleAddComment}
                      discussionId={discussion.test_discussion_id}
                    />
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
