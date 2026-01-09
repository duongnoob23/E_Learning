import { useState } from "react";

export const useDictionary = () => {
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

  return {
    isOpen,
    isMinimized,
    openDictionary,
    closeDictionary,
    toggleDictionary,
    minimizeDictionary,
    maximizeDictionary,
    toggleMinimize,
  };
};
