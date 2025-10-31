// src/Admin/features/courses/components/partConfig.js
export const TOEIC_PARTS = [
  {
    key: "P1",
    number: 1,
    title: "Part 1 — Photographs",
    type: "listening",
    expectedMax: 6,
    choiceCount: 4,
    requires: { image: true, audio: false, passage: false },
  },
  {
    key: "P2",
    number: 2,
    title: "Part 2 — Question–Response",
    type: "listening",
    expectedMax: 25,
    choiceCount: 3,
    requires: { image: false, audio: true, passage: false },
  },
  {
    key: "P3",
    number: 3,
    title: "Part 3 — Conversations",
    type: "listening",
    expectedMax: 39,
    choiceCount: 4,
    requires: { image: false, audio: true, passage: false },
  },
  {
    key: "P4",
    number: 4,
    title: "Part 4 — Short Talks",
    type: "listening",
    expectedMax: 30,
    choiceCount: 4,
    requires: { image: false, audio: true, passage: false },
  },
  {
    key: "P5",
    number: 5,
    title: "Part 5 — Incomplete Sentences",
    type: "reading",
    expectedMax: 30,
    choiceCount: 4,
    requires: { image: false, audio: false, passage: false },
  },
  {
    key: "P6",
    number: 6,
    title: "Part 6 — Text Completion",
    type: "reading",
    expectedMax: 16,
    choiceCount: 4,
    requires: { image: false, audio: false, passage: true },
  },
  {
    key: "P7",
    number: 7,
    title: "Part 7 — Reading Comprehension",
    type: "reading",
    expectedMax: 54,
    choiceCount: 4,
    requires: { image: false, audio: false, passage: true },
  },
];

export const READING_PART_KEYS = ["P5", "P6", "P7"];
export const LISTENING_PART_KEYS = ["P1", "P2", "P3", "P4"];
