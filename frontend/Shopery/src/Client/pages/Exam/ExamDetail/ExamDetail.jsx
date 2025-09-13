// Exam Detail Page - Chi tiết bài thi
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ExamDetail.css";

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - trong thực tế sẽ gọi API
    const mockExam = {
      id: parseInt(id),
      title: "TOEIC Practice Test 001",
      type: "toeic",
      duration: 120,
      description: "Complete TOEIC practice test with listening and reading sections. This test is designed to help you prepare for the actual TOEIC exam by providing realistic questions and timing.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      difficulty: "Intermediate",
      questions: 200,
      tags: ["TOEIC", "Practice", "Vocabulary"],
      instructions: [
        "You will have 120 minutes to complete this test",
        "The test consists of 2 sections: Listening and Reading",
        "Each section has multiple parts with different question types",
        "You can navigate between questions freely",
        "Your answers will be saved automatically",
        "You can pause and resume the test at any time"
      ],
      requirements: [
        "Stable internet connection",
        "Audio device for listening section",
        "Quiet environment for concentration",
        "No external help or resources allowed"
      ],
      isCompleted: false,
      bestScore: null,
      attempts: 0,
    };

    const mockSections = [
      {
        id: 1,
        name: "Listening",
        duration: 45,
        questions: 100,
        description: "Listen to conversations and talks, then answer questions",
        parts: [
          { name: "Part 1: Photos", questions: 6, description: "Look at photos and choose the best description" },
          { name: "Part 2: Question-Response", questions: 25, description: "Listen to questions and choose the best response" },
          { name: "Part 3: Conversations", questions: 39, description: "Listen to conversations and answer questions" },
          { name: "Part 4: Talks", questions: 30, description: "Listen to talks and answer questions" }
        ]
      },
      {
        id: 2,
        name: "Reading",
        duration: 75,
        questions: 100,
        description: "Read passages and answer comprehension questions",
        parts: [
          { name: "Part 5: Incomplete Sentences", questions: 30, description: "Choose the best word or phrase to complete sentences" },
          { name: "Part 6: Text Completion", questions: 16, description: "Complete texts by choosing the best words" },
          { name: "Part 7: Reading Comprehension", questions: 54, description: "Read passages and answer questions" }
        ]
      }
    ];

    setExam(mockExam);
    setSections(mockSections);
    setLoading(false);
  }, [id]);

  const getTypeColor = (type) => {
    switch (type) {
      case "toeic": return "#1F2937";
      case "ielts": return "#059669";
      case "toefl": return "#DC2626";
      default: return "#6B7280";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "#10B981";
      case "Intermediate": return "#F59E0B";
      case "Advanced": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStartTest = () => {
    navigate(`/exam/${id}/take`);
  };

  if (loading) {
    return (
      <div className="exam-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading exam details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="exam-detail-error">
        <h2>Exam not found</h2>
        <p>The exam you're looking for doesn't exist.</p>
        <Link to="/exam" className="btn-primary">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="exam-detail">
      <div className="exam-detail__container">
        {/* Header */}
        <div className="exam-detail__header">
          <div className="exam-detail__image">
            <img src={exam.image} alt={exam.title} />
            <div className="exam-detail__type" style={{ backgroundColor: getTypeColor(exam.type) }}>
              {exam.type.toUpperCase()}
            </div>
          </div>
          
          <div className="exam-detail__info">
            <h1 className="exam-detail__title">{exam.title}</h1>
            <p className="exam-detail__description">{exam.description}</p>
            
            <div className="exam-detail__meta">
              <div className="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{formatDuration(exam.duration)}</span>
              </div>
              <div className="meta-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{exam.questions} questions</span>
              </div>
              <div className="meta-item">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(exam.difficulty) }}
                >
                  {exam.difficulty}
                </span>
              </div>
            </div>

            <div className="exam-detail__tags">
              {exam.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>

            {exam.isCompleted && (
              <div className="exam-detail__score">
                <div className="score-item">
                  <span className="score-label">Best Score:</span>
                  <span className="score-value">{exam.bestScore}</span>
                </div>
                <div className="score-item">
                  <span className="score-label">Attempts:</span>
                  <span className="score-value">{exam.attempts}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="exam-detail__sections">
          <h2 className="sections-title">Test Sections</h2>
          <div className="sections-grid">
            {sections.map((section) => (
              <div key={section.id} className="section-card">
                <div className="section-card__header">
                  <h3 className="section-card__title">{section.name}</h3>
                  <div className="section-card__meta">
                    <span className="duration">{formatDuration(section.duration)}</span>
                    <span className="questions">{section.questions} questions</span>
                  </div>
                </div>
                <p className="section-card__description">{section.description}</p>
                
                <div className="section-card__parts">
                  {section.parts.map((part, index) => (
                    <div key={index} className="part-item">
                      <div className="part-info">
                        <span className="part-name">{part.name}</span>
                        <span className="part-questions">{part.questions} questions</span>
                      </div>
                      <p className="part-description">{part.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="exam-detail__instructions">
          <h2 className="instructions-title">Instructions</h2>
          <div className="instructions-grid">
            <div className="instruction-section">
              <h3>Test Guidelines</h3>
              <ul>
                {exam.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            <div className="instruction-section">
              <h3>Requirements</h3>
              <ul>
                {exam.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="exam-detail__actions">
          <button 
            className="btn-primary btn-large"
            onClick={handleStartTest}
          >
            {exam.isCompleted ? "Retake Test" : "Start Test"}
          </button>
          <Link to="/exam" className="btn-secondary btn-large">
            Back to Exams
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
