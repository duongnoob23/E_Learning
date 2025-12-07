import { useEffect, useState } from "react";
import { useDictionary } from "../../services/Dictionary/useDictionary";
import { useWordDetail } from "../../services/Dictionary/useWordDetail";
import DictionaryTabs from "./DictionaryTabs";
import DictionarySearch from "./DictionarySearch";
import DictionaryResult from "./DictionaryResult";
import "./dictionary.css";

export default function DictionaryWidget() {
  const [word, setWord] = useState("");
  const [debouncedWord, setDebouncedWord] = useState("");
  const [selectedWord, setSelectedWord] = useState(null); // Từ được chọn để xem chi tiết
  const [type, setType] = useState("en-vi");
  const [open, setOpen] = useState(false); // ✅ đóng mở bằng nút

  // Debounce word - chỉ tra từ sau khi user ngừng gõ 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWord(word);
      setSelectedWord(null); // Reset selected word khi search mới
    }, 500); // Delay 500ms

    return () => clearTimeout(timer);
  }, [word]);

  // ✅ tra khi bôi đen chữ (tra ngay, không debounce)
  useEffect(() => {
    const onSelect = () => {
      const text = window.getSelection()?.toString().trim();
      if (text) {
        setWord(text);
        setDebouncedWord(text); // Tra ngay lập tức khi bôi đen
        setSelectedWord(null); // Reset selected word
        setOpen(true);
      }
    };
    document.addEventListener("mouseup", onSelect);
    return () => document.removeEventListener("mouseup", onSelect);
  }, []);

  // Query cho search list
  const { data: searchData, isLoading: searchLoading, error: searchError, isError: searchIsError } = useDictionary(debouncedWord, type);
  
  // Query cho word detail (khi có selectedWord)
  const { data: detailData, isLoading: detailLoading, error: detailError, isError: detailIsError } = useWordDetail(selectedWord, type);

  // Sử dụng detailData nếu có selectedWord, ngược lại dùng searchData
  const displayData = selectedWord ? detailData : searchData;
  const isLoading = selectedWord ? detailLoading : searchLoading;
  const error = selectedWord ? detailError : searchError;
  const isError = selectedWord ? detailIsError : searchIsError;

  return (
    <>
      {/* ✅ FLOAT BUTTON – LUÔN HIỆN */}
      <button
        className="dict-floating-btn"
        onClick={() => setOpen(true)}
        title="Mở từ điển"
      >
        📘
      </button>

      {/* ✅ PANEL – LUÔN RENDER */}
      <div className={`dictionary-widget ${open ? "open" : ""}`}>
        <div className="dict-header">
          <span className="dict-title">Từ điển</span>
          <button 
            className="dict-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Đóng từ điển"
          >
            ✕
          </button>
        </div>

        <DictionaryTabs value={type} onChange={setType} />
        <DictionarySearch value={word} onChange={setWord} />

        {/* Nút back khi đang xem chi tiết */}
        {selectedWord && (
          <button
            className="dict-back-btn"
            onClick={() => {
              setSelectedWord(null);
              setWord(selectedWord); // Giữ từ trong search box
            }}
          >
            ← Quay lại
          </button>
        )}

        {isLoading && <p className="status">Đang tra...</p>}
        {isError && (
          <p className="status error">
            {error?.message || "Không tìm thấy từ trong từ điển"}
          </p>
        )}
        {displayData && !isLoading && !isError && (
          <DictionaryResult 
            data={displayData} 
            type={type}
            onWordSelect={(wordItem) => {
              // Khi click vào từ trong list, hiển thị chi tiết
              setSelectedWord(wordItem.word);
            }}
          />
        )}
      </div>
    </>
  );
}
