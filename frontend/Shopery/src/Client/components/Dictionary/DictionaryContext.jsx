import React, { createContext, useContext, useState } from "react";

const DictionaryContext = createContext();

export const useDictionaryContext = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionaryContext must be used within DictionaryProvider");
  }
  return context;
};

export const DictionaryProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const openDictionary = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeDictionary = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleDictionary = () => {
    if (isOpen) {
      closeDictionary();
    } else {
      openDictionary();
    }
  };

  const minimizeDictionary = () => {
    setIsMinimized(true);
  };

  const maximizeDictionary = () => {
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <DictionaryContext.Provider
      value={{
        isOpen,
        isMinimized,
        openDictionary,
        closeDictionary,
        toggleDictionary,
        minimizeDictionary,
        maximizeDictionary,
        toggleMinimize,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};
