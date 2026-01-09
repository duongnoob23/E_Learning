import "./LessonExercise.css";

export default function VocabularyListExercise({ exerciseData }) {
  const words = exerciseData?.words || [];
  const topicId = exerciseData?.topic_id;

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  };

  return (
    <div className="exercise-vocabulary-list">
      <div className="vocabulary-header">
        <h4>📝 Danh sách từ vựng</h4>
        {exerciseData?.level && (
          <span className="level-badge">{exerciseData.level}</span>
        )}
      </div>

      {words.length === 0 ? (
        <div className="exercise-empty">
          {topicId ? (
            <p>Đang tải từ vựng từ topic {topicId}...</p>
          ) : (
            <p>Chưa có từ vựng nào.</p>
          )}
        </div>
      ) : (
        <div className="vocabulary-grid">
          {words.map((word, idx) => (
            <div key={word.word_id || idx} className="vocabulary-card">
              <div className="vocab-word-header">
                <span className="vocab-word">{word.word}</span>
                {word.phonetic && (
                  <span className="vocab-phonetic">
                    {word.phonetic}
                    {word.audio && (
                      <button
                        className="vocab-audio-btn"
                        onClick={() => playAudio(word.audio)}
                        title="Phát âm"
                      ></button>
                    )}
                  </span>
                )}
              </div>
              <div className="vocab-meaning">
                {word.partOfSpeech && (
                  <span className="vocab-pos">{word.partOfSpeech}:</span>
                )}
                <span>{word.meaning}</span>
              </div>
              {word.example && (
                <div className="vocab-example">
                  <em>"{word.example}"</em>
                  {word.exampleVi && <em> - "{word.exampleVi}"</em>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
