import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useExamDetail, 
  useUserExamHistory,
  useStartPracticeSession,
  useStartFullTestSession 
} from '../../../hooks/Exam/useExamQueries';
import './ExamDetail.css';

const ExamDetail = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' or 'fulltest'
  const [selectedSections, setSelectedSections] = useState([]);
  const [timeLimit, setTimeLimit] = useState('');

  // API calls
  const { data: examData, isLoading, error } = useExamDetail(testId);
  const { data: userHistoryData } = useUserExamHistory({ testId });
  const startPracticeMutation = useStartPracticeSession();
  const startFullTestMutation = useStartFullTestSession();

  const exam = examData?.DT;
  const sections = exam?.sections || [];
  const userHistory = userHistoryData?.DT?.history || [];

  // Format duration helper
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Handle section selection
  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Handle practice button
  const handlePractice = async () => {
    if (selectedSections.length === 0) {
      alert('Vui lòng chọn ít nhất một phần thi');
      return;
    }

    try {
      const result = await startPracticeMutation.mutateAsync({
        testId,
        sectionIds: selectedSections,
        timeLimit: timeLimit ? parseInt(timeLimit) : null
      });

      if (result.EC === '0') {
        // Navigate to exam session page with selected sections as query param
        const sectionQuery = selectedSections && selectedSections.length > 0
          ? `?sectionIds=${selectedSections.join(',')}`
          : '';
        navigate(`/exam/${testId}/session/${result.DT.user_test_id}${sectionQuery}`);
      }
    } catch (error) {
      console.error('Error starting practice:', error);
    }
  };

  // Handle full test button
  const handleFullTest = async () => {
    try {
      const result = await startFullTestMutation.mutateAsync({ testId });

      if (result.EC === '0') {
        // Navigate to exam session page
        navigate(`/exam/${testId}/session/${result.DT.user_test_id}`);
      }
    } catch (error) {
      console.error('Error starting full test:', error);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format time helper
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="exam-detail-container loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin bài kiểm tra...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-detail-container error">
        <h3>Lỗi</h3>
        <p>Không thể tải thông tin bài kiểm tra: {error.message}</p>
        <button onClick={() => navigate('/exam')} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-detail-container empty">
        <h3>Không tìm thấy bài kiểm tra</h3>
        <p>Bài kiểm tra bạn đang tìm kiếm không tồn tại.</p>
        <button onClick={() => navigate('/exam')} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="exam-detail-container">
        {/* Header */}
      <div className="exam-header">
        <div className="exam-tags">
          <span className="tag tag-type">{exam.test_type}</span>
        </div>
        <h1 className="exam-title">
          {exam.title}
        </h1>
        
        <div className="exam-summary">
          <div className="summary-item">
            <span className="icon">⏱️</span>
            <span>Thời gian làm bài: {formatDuration(exam.total_duration || exam.duration)}</span>
          </div>
          <div className="summary-item">
            <span className="icon">📝</span>
            <span>{sections.length} phần thi</span>
          </div>
          <div className="summary-item">
            <span className="icon">❓</span>
            <span>{exam.questions_count || 'N/A'} câu hỏi</span>
          </div>
            </div>
          </div>
          
      {/* Test Results */}
      <div className="test-results">
        <h3>Kết quả làm bài của bạn:</h3>
        {userHistory.length > 0 ? (
          <div className="results-table">
            <div className="table-header">
              <div>Ngày làm</div>
              <div>Kết quả</div>
              <div>Thời gian làm bài</div>
              <div>Trạng thái</div>
            </div>
            {userHistory.map((test) => (
              <div key={test.user_test_id} className="table-row">
                <div className="date-cell">
                  <div>{formatDate(test.started_at)}</div>
              </div>
                <div>{test.score ? `${test.score}/100` : 'Chưa có điểm'}</div>
                <div>
                  {test.finished_at && test.started_at 
                    ? formatTime(Math.floor((new Date(test.finished_at) - new Date(test.started_at)) / 1000))
                    : 'Đang làm'
                  }
              </div>
                <div>
                  <span className={`status-badge status-${test.status}`}>
                    {test.status === 'completed' ? 'Hoàn thành' : 
                     test.status === 'in_progress' ? 'Đang làm' : 'Bỏ dở'}
                </span>
              </div>
            </div>
              ))}
            </div>
        ) : (
          <p className="no-results">Bạn chưa có kết quả làm bài nào cho đề thi này.</p>
            )}
          </div>

      {/* Main Tabs */}
      <div className="main-tabs">
        <button 
          className={`main-tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          Luyện tập
        </button>
        <button 
          className={`main-tab ${activeTab === 'fulltest' ? 'active' : ''}`}
          onClick={() => setActiveTab('fulltest')}
        >
          Làm full test
        </button>
        </div>

      {/* Tab Content */}
      {activeTab === 'practice' && (
        <div className="tab-content">
          {/* Pro Tips */}
          <div className="pro-tips">
            <div className="tips-icon">💡</div>
            <div className="tips-content">
              <strong>Pro tips:</strong> Hình thức luyện tập từng phần và chọn mức thời gian phù hợp sẽ giúp bạn tập trung vào giải đúng các câu hỏi thay vì phải chịu áp lực hoàn thành bài thi.
                  </div>
                </div>

          {/* Section Selection */}
          <div className="section-selection">
            <h3>Chọn phần thi bạn muốn làm</h3>
            <div className="sections-list">
              {sections.map((section, index) => (
                <div key={section.section_id} className="section-item">
                  <label className="section-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.section_id)}
                      onChange={() => handleSectionToggle(section.section_id)}
                    />
                    <span className="checkmark"></span>
                    <div className="section-info">
                      <div className="section-name">
                        {section.section_name} ({formatDuration(section.duration)})
                      </div>
                      </div>
                  </label>
                    </div>
                  ))}
                </div>
              </div>

          {/* Time Limit */}
          <div className="time-limit">
            <label>Giới hạn thời gian (Để trống để làm bài không giới hạn)</label>
            <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>
              <option value="">--- Chọn thời gian ---</option>
              <option value="15">15 phút</option>
              <option value="30">30 phút</option>
              <option value="45">45 phút</option>
              <option value="60">60 phút</option>
            </select>
          </div>

          {/* Practice Button */}
          <div className="practice-section">
            <button 
              className="practice-button"
              onClick={handlePractice}
              disabled={startPracticeMutation.isLoading}
            >
              {startPracticeMutation.isLoading ? 'Đang bắt đầu...' : 'LUYỆN TẬP'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'fulltest' && (
        <div className="tab-content">
          <div className="fulltest-info">
            <h3>Làm full test</h3>
            <p>Bạn sẽ làm tất cả {sections.length} phần thi với tổng thời gian {formatDuration(exam.total_duration || exam.duration)}.</p>
            <div className="fulltest-sections">
              {sections.map((section, index) => (
                <div key={section.section_id} className="fulltest-section-item">
                  <span className="section-order">{index + 1}.</span>
                  <span className="section-name">{section.section_name}</span>
                  <span className="section-duration">({formatDuration(section.duration)})</span>
            </div>
                ))}
          </div>
        </div>

          {/* Full Test Button */}
          <div className="practice-section">
          <button 
              className="practice-button"
              onClick={handleFullTest}
              disabled={startFullTestMutation.isLoading}
          >
              {startFullTestMutation.isLoading ? 'Đang bắt đầu...' : 'LÀM FULL TEST'}
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default ExamDetail;