export default function DictionaryResult({
  data,
  type = "en-vi",
  onWordSelect,
}) {
  if (!data) return null;

  const playAudio = (audioUrl, e) => {
    e?.stopPropagation();
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  };

  // Nếu có danh sách words (search-as-you-type)
  if (data.words && Array.isArray(data.words)) {
    return (
      <div className="dict-result dict-result-list">
        {data.words.length === 0 ? (
          <p className="no-results">Không tìm thấy từ nào</p>
        ) : (
          <div className="words-list">
            {data.words.map((wordItem, index) => (
              <div
                key={index}
                className="word-item"
                onClick={() => onWordSelect && onWordSelect(wordItem)}
              >
                <div className="word-header-row">
                  <div className="word-main">
                    <span className="word-text">{wordItem.word}</span>
                    {wordItem.phonetic && (
                      <span className="word-phonetic">{wordItem.phonetic}</span>
                    )}
                    {wordItem.audio && (
                      <button
                        className="audio-btn-small"
                        onClick={(e) => playAudio(wordItem.audio, e)}
                        title="Phát âm"
                      >
                        AV
                      </button>
                    )}
                  </div>
                </div>
                <div className="word-meaning">
                  {wordItem.partOfSpeech && (
                    <span className="word-pos">{wordItem.partOfSpeech}:</span>
                  )}
                  <span className="word-meaning-text">{wordItem.meaning}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Hiển thị chi tiết 1 từ (khi click vào từ trong list)
  return (
    <div className="dict-result">
      <div className="dict-word-header">
        <div>
          <h3>{data.word}</h3>
          {data.phonetic && (
            <p className="phonetic">
              {data.phonetic}
              {data.audio && (
                <button
                  className="audio-btn"
                  onClick={() => playAudio(data.audio)}
                  title="Phát âm"
                ></button>
              )}
            </p>
          )}
        </div>
        {data.image && (
          <img
            src={data.image}
            alt={data.word}
            className="dict-word-image"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>

      {/* English definition (nếu có) */}
      {data.definitionEn && (
        <div className="definition-en">
          <b>Definition:</b> {data.definitionEn}
        </div>
      )}

      {/* Hiển thị meanings */}
      {data.meanings && data.meanings.length > 0 && (
        <div className="meanings">
          {data.meanings.map((m, i) => (
            <div key={i} className="meaning-item">
              {m.partOfSpeech && (
                <b className="part-of-speech">{m.partOfSpeech}</b>
              )}
              <ul>
                {m.definitions.map((d, j) => (
                  <li key={j}>
                    <span className="definition-text">{d.definition}</span>
                    {d.example && (
                      <div className="example">
                        <span className="example-label">Example:</span>
                        <span className="example-en">"{d.example}"</span>
                        {d.exampleVi && (
                          <span className="example-vi">"{d.exampleVi}"</span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
