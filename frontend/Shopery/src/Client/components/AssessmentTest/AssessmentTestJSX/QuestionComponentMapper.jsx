// components/AssessmentTest/AssessmentTestJSX/QuestionComponentMapper.js

import { lazy } from "react";

// Mapping table: examType → skill → part → component
const COMPONENT_MAP = {
  toeic: {
    // TOEIC Listening (Part 1-4)
    listening: {
      part1: lazy(() => import("./TOEIC/Listening/Part1")),
      part2: lazy(() => import("./TOEIC/Listening/Part2")),
      part3: lazy(() => import("./TOEIC/Listening/Part3")),
      part4: lazy(() => import("./TOEIC/Listening/Part4")),
    },
    // TOEIC Reading (Part 5-7)
    reading: {
      part5: lazy(() => import("./TOEIC/Reading/Part5")),
      part6: lazy(() => import("./TOEIC/Reading/Part6")),
      part7: lazy(() => import("./TOEIC/Reading/Part7")),
    },
    // TOEIC Speaking (5 parts: part1: 2 câu, part2: 2 câu, part3-5: mỗi part 1 câu)
    speaking: {
      part1: lazy(() => import("./TOEIC/Speaking/Part1")),
      part2: lazy(() => import("./TOEIC/Speaking/Part2")),
      part3: lazy(() => import("./TOEIC/Speaking/Part3")),
      part4: lazy(() => import("./TOEIC/Speaking/Part4")),
      part5: lazy(() => import("./TOEIC/Speaking/Part5")),
    },
    // TOEIC Writing (3 parts: part1: 5 câu, part2: 2 câu, part3: 1 câu)
    writing: {
      part1: lazy(() => import("./TOEIC/Writing/Part1")),
      part2: lazy(() => import("./TOEIC/Writing/Part2")),
      part3: lazy(() => import("./TOEIC/Writing/Part3")),
    },
    // TOEIC Speaking + Writing (backward compatibility)
    speaking_writing: {
      part1: lazy(() => import("./TOEIC/Speaking/SpeakingPart")),
      part2: lazy(() => import("./TOEIC/Speaking/SpeakingPart")),
      part3: lazy(() => import("./TOEIC/Speaking/SpeakingPart")),
      part4: lazy(() => import("./TOEIC/Speaking/SpeakingPart")),
      part5: lazy(() => import("./TOEIC/Speaking/SpeakingPart")),
    },
    // ✅ Hỗ trợ backward compatibility: listening_reading (tự động map)
    listening_reading: {
      part1: lazy(() => import("./TOEIC/Listening/Part1")),
      part2: lazy(() => import("./TOEIC/Listening/Part2")),
      part3: lazy(() => import("./TOEIC/Listening/Part3")),
      part4: lazy(() => import("./TOEIC/Listening/Part4")),
      part5: lazy(() => import("./TOEIC/Reading/Part5")),
      part6: lazy(() => import("./TOEIC/Reading/Part6")),
      part7: lazy(() => import("./TOEIC/Reading/Part7")),
    },
  },
  ielts: {
    // IELTS Listening (sẽ thêm sau)
    listening: {
      // part1: lazy(() => import("./IELTS/Listening/Part1")),
      // ...
    },
    // IELTS Reading (sẽ thêm sau)
    reading: {
      // part1: lazy(() => import("./IELTS/Reading/Part1")),
      // ...
    },
    // ✅ Hỗ trợ backward compatibility
    listening_reading: {
      // part1: lazy(() => import("./IELTS/Listening/Part1")),
      // ...
    },
  },
};

/**
 * Lấy component tương ứng với examType, skill, part
 * @param {string} examType - 'toeic', 'ielts', ...
 * @param {string} skill - 'listening_reading', 'speaking_writing', ...
 * @param {number} part - 1, 2, 3, ...
 * @returns {React.LazyComponent} Component hoặc null
 */

export const getQuestionComponent = (examType, skill, part) => {
  const partKey = `part${part}`;
  const component = COMPONENT_MAP[examType]?.[skill]?.[partKey];

  if (!component) {
    console.error(`Component not found: ${examType}/${skill}/${partKey}`);
    // Fallback về Part1 nếu không tìm thấy
    return COMPONENT_MAP.toeic?.listening_reading?.part1;
  }

  return component;
};

/**
 * Lấy danh sách parts của một exam/skill
 * @param {string} examType
 * @param {string} skill
 * @returns {string[]} Array of part keys ['part1', 'part2', ...]
 */

export const getExamParts = (examType, skill) => {
  const parts = COMPONENT_MAP[examType]?.[skill];
  return parts ? Object.keys(parts) : [];
};

export default COMPONENT_MAP;
