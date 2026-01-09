import React from "react";
import { FiBook } from "react-icons/fi";
import { useDictionaryContext } from "./DictionaryContext";
import "./FloatingDictionaryButton.css";

const FloatingDictionaryButton = () => {
  const dictionary = useDictionaryContext();

  return (
    <button
      className="floating-dictionary-btn"
      onClick={dictionary.openDictionary}
      title="Từ điển Anh-Việt"
    >
      <FiBook className="floating-dictionary-icon" />
      <span className="floating-dictionary-label">Từ điển</span>
    </button>
  );
};

export default FloatingDictionaryButton;
