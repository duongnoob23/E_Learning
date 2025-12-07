// Test.jsx - Trang test các loại bài tập
import React, { useState } from "react";
import LessonStudio from "../../components/Lesson/Creators/LessonStudio";
import { renderLessonComponent } from "../../components/Lesson/LessonComponentMapper";
import "./Test.css";

// Dữ liệu fake cho từng loại bài tập
const TEST_LESSONS = [
  {
    lesson_id: 1,
    title: "Danh sách từ mới: Cảm xúc",
    description: "Học các từ vựng về cảm xúc",
    lesson_type: "vocabulary_list",
    lesson_data: {
      type: "vocabulary_list",
      display_mode: "flashcard",
      words: [
        {
          word_id: 1,
          en: "happy",
          vi: "vui mừng",
          image_url:
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "happy"
          )}`,
          example: "I am happy today",
        },
        {
          word_id: 2,
          en: "sad",
          vi: "buồn",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "sad"
          )}`,
          example: "She looks sad",
        },
        {
          word_id: 3,
          en: "angry",
          vi: "giận",
          image_url:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "angry"
          )}`,
          example: "He is angry",
        },
        {
          word_id: 4,
          en: "excited",
          vi: "hào hứng",
          image_url:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "excited"
          )}`,
          example: "We are excited",
        },
      ],
      settings: {
        auto_play: true,
        show_translation: false,
      },
    },
  },
  {
    lesson_id: 2,
    title: "Tìm cặp: Cảm xúc",
    description: "Ghép cặp hình ảnh với từ tiếng Anh",
    lesson_type: "vocabulary_matching",
    lesson_data: {
      type: "vocabulary_matching",
      questions: [
        {
          pairs: [
            {
              pair_id: 1,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
                text: "vui mừng",
              },
              right: { type: "text", text: "happy" },
            },
            {
              pair_id: 2,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                text: "buồn",
              },
              right: { type: "text", text: "sad" },
            },
            {
              pair_id: 3,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
                text: "giận",
              },
              right: { type: "text", text: "angry" },
            },
            {
              pair_id: 4,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
                text: "hào hứng",
              },
              right: { type: "text", text: "excited" },
            },
            {
              pair_id: 5,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                text: "bình tĩnh",
              },
              right: { type: "text", text: "calm" },
            },
            {
              pair_id: 6,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                text: "ngạc nhiên",
              },
              right: { type: "text", text: "surprised" },
            },
            {
              pair_id: 7,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
                text: "sợ",
              },
              right: { type: "text", text: "scared" },
            },
            {
              pair_id: 8,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
                text: "mệt",
              },
              right: { type: "text", text: "tired" },
            },
          ],
        },
        {
          pairs: [
            {
              pair_id: 1,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                text: "xinh, đẹp",
              },
              right: { type: "text", text: "beautiful" },
            },
            {
              pair_id: 2,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                text: "giàu có",
              },
              right: { type: "text", text: "rich" },
            },
            {
              pair_id: 3,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
                text: "thú vị",
              },
              right: { type: "text", text: "interesting" },
            },
            {
              pair_id: 4,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
                text: "thân thiện",
              },
              right: { type: "text", text: "friendly" },
            },
            {
              pair_id: 5,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                text: "điên khùng",
              },
              right: { type: "text", text: "crazy" },
            },
            {
              pair_id: 6,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
                text: "nhàm chán",
              },
              right: { type: "text", text: "boring" },
            },
            {
              pair_id: 7,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
                text: "buồn",
              },
              right: { type: "text", text: "sad" },
            },
            {
              pair_id: 8,
              left: {
                type: "image_vi",
                image:
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
                text: "vui mừng",
              },
              right: { type: "text", text: "happy" },
            },
          ],
        },
      ],
    },
  },
  {
    lesson_id: 3,
    title: "Dịch nghĩa: Cảm xúc",
    description: "Nhập từ tiếng Anh tương ứng",
    lesson_type: "vocabulary_translation",
    lesson_data: {
      type: "vocabulary_translation",
      questions: [
        {
          vi_text: "vui mừng",
          image_url:
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
          correct_answer: "happy",
        },
        {
          vi_text: "buồn",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          correct_answer: "sad",
        },
        {
          vi_text: "giận",
          image_url:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
          correct_answer: "angry",
        },
        {
          vi_text: "hào hứng",
          image_url:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
          correct_answer: "excited",
        },
        {
          vi_text: "bình tĩnh",
          image_url:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
          correct_answer: "calm",
        },
        {
          vi_text: "ngạc nhiên",
          image_url:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
          correct_answer: "surprised",
        },
        {
          vi_text: "sợ",
          image_url:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop",
          correct_answer: "scared",
        },
        {
          vi_text: "mệt",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
          correct_answer: "tired",
        },
      ],
    },
  },
  {
    lesson_id: 4,
    title: "Trắc nghiệm: Cảm xúc",
    description: "Chọn đáp án đúng",
    lesson_type: "vocabulary_quiz",
    lesson_data: {
      type: "vocabulary_quiz",
      shuffle_choices: true,
      questions: [
        {
          en: "famous",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "famous"
          )}`,
          choices: [
            {
              id: 1,
              image_url:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
              vi: "buồn",
              is_correct: false,
            },
            {
              id: 2,
              image_url:
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
              vi: "bực bội",
              is_correct: false,
            },
            {
              id: 3,
              image_url:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
              vi: "nhàm chán",
              is_correct: false,
            },
            {
              id: 4,
              image_url:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
              vi: "nổi tiếng",
              is_correct: true,
            },
          ],
        },
        {
          en: "happy",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "happy"
          )}`,
          choices: [
            {
              id: 1,
              image_url:
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
              vi: "vui mừng",
              is_correct: true,
            },
            {
              id: 2,
              image_url:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
              vi: "buồn",
              is_correct: false,
            },
            {
              id: 3,
              image_url:
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
              vi: "giận",
              is_correct: false,
            },
            {
              id: 4,
              image_url:
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
              vi: "hào hứng",
              is_correct: false,
            },
          ],
        },
        {
          en: "sad",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "sad"
          )}`,
          choices: [
            {
              id: 1,
              image_url:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
              vi: "buồn",
              is_correct: true,
            },
            {
              id: 2,
              image_url:
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
              vi: "vui mừng",
              is_correct: false,
            },
            {
              id: 3,
              image_url:
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
              vi: "giận",
              is_correct: false,
            },
            {
              id: 4,
              image_url:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
              vi: "ngạc nhiên",
              is_correct: false,
            },
          ],
        },
        {
          vi: "vui mừng",
          image_url:
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop",
          choices: [
            { id: 1, en: "happy", is_correct: true },
            { id: 2, en: "sad", is_correct: false },
            { id: 3, en: "angry", is_correct: false },
            { id: 4, en: "excited", is_correct: false },
          ],
        },
        {
          en: "angry",
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "angry"
          )}`,
          choices: [
            { id: 1, vi: "giận", is_correct: true },
            { id: 2, vi: "vui mừng", is_correct: false },
            { id: 3, vi: "buồn", is_correct: false },
            { id: 4, vi: "sợ", is_correct: false },
          ],
        },
      ],
    },
  },
  {
    lesson_id: 5,
    title: "Nghe từ vựng: Cảm xúc",
    description: "Nghe và chọn đáp án đúng",
    lesson_type: "vocabulary_listening",
    lesson_data: {
      type: "vocabulary_listening",
      questions: [
        {
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "happy"
          )}`,
          grid: {
            rows: 3,
            cols: 3,
            cells: [
              {
                id: 1,
                image_url:
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
                vi_text: "vui mừng",
                is_correct: true,
                position: { row: 0, col: 0 },
              },
              {
                id: 2,
                image_url:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                vi_text: "buồn",
                is_correct: false,
                position: { row: 0, col: 1 },
              },
              {
                id: 3,
                image_url:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
                vi_text: "giận",
                is_correct: false,
                position: { row: 0, col: 2 },
              },
              {
                id: 4,
                image_url:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
                vi_text: "hào hứng",
                is_correct: false,
                position: { row: 1, col: 0 },
              },
              {
                id: 5,
                image_url:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                vi_text: "bình tĩnh",
                is_correct: false,
                position: { row: 1, col: 1 },
              },
              {
                id: 6,
                image_url:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                vi_text: "ngạc nhiên",
                is_correct: false,
                position: { row: 1, col: 2 },
              },
              {
                id: 7,
                image_url:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
                vi_text: "sợ",
                is_correct: false,
                position: { row: 2, col: 0 },
              },
              {
                id: 8,
                image_url:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
                vi_text: "mệt",
                is_correct: false,
                position: { row: 2, col: 1 },
              },
              {
                id: 9,
                image_url:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
                vi_text: "lo lắng",
                is_correct: false,
                position: { row: 2, col: 2 },
              },
            ],
          },
          play_count: 3,
        },
        {
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "sad"
          )}`,
          grid: {
            rows: 3,
            cols: 3,
            cells: [
              {
                id: 1,
                image_url:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                vi_text: "buồn",
                is_correct: true,
                position: { row: 0, col: 0 },
              },
              {
                id: 2,
                image_url:
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
                vi_text: "vui mừng",
                is_correct: false,
                position: { row: 0, col: 1 },
              },
              {
                id: 3,
                image_url:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
                vi_text: "giận",
                is_correct: false,
                position: { row: 0, col: 2 },
              },
              {
                id: 4,
                image_url:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
                vi_text: "hào hứng",
                is_correct: false,
                position: { row: 1, col: 0 },
              },
              {
                id: 5,
                image_url:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                vi_text: "bình tĩnh",
                is_correct: false,
                position: { row: 1, col: 1 },
              },
              {
                id: 6,
                image_url:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                vi_text: "ngạc nhiên",
                is_correct: false,
                position: { row: 1, col: 2 },
              },
              {
                id: 7,
                image_url:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
                vi_text: "sợ",
                is_correct: false,
                position: { row: 2, col: 0 },
              },
              {
                id: 8,
                image_url:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
                vi_text: "mệt",
                is_correct: false,
                position: { row: 2, col: 1 },
              },
              {
                id: 9,
                image_url:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
                vi_text: "lo lắng",
                is_correct: false,
                position: { row: 2, col: 2 },
              },
            ],
          },
          play_count: 3,
        },
        {
          audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
            "angry"
          )}`,
          grid: {
            rows: 3,
            cols: 3,
            cells: [
              {
                id: 1,
                image_url:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
                vi_text: "giận",
                is_correct: true,
                position: { row: 0, col: 0 },
              },
              {
                id: 2,
                image_url:
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop",
                vi_text: "vui mừng",
                is_correct: false,
                position: { row: 0, col: 1 },
              },
              {
                id: 3,
                image_url:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                vi_text: "buồn",
                is_correct: false,
                position: { row: 0, col: 2 },
              },
              {
                id: 4,
                image_url:
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
                vi_text: "hào hứng",
                is_correct: false,
                position: { row: 1, col: 0 },
              },
              {
                id: 5,
                image_url:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
                vi_text: "bình tĩnh",
                is_correct: false,
                position: { row: 1, col: 1 },
              },
              {
                id: 6,
                image_url:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
                vi_text: "ngạc nhiên",
                is_correct: false,
                position: { row: 1, col: 2 },
              },
              {
                id: 7,
                image_url:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop",
                vi_text: "sợ",
                is_correct: false,
                position: { row: 2, col: 0 },
              },
              {
                id: 8,
                image_url:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
                vi_text: "mệt",
                is_correct: false,
                position: { row: 2, col: 1 },
              },
              {
                id: 9,
                image_url:
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
                vi_text: "lo lắng",
                is_correct: false,
                position: { row: 2, col: 2 },
              },
            ],
          },
          play_count: 3,
        },
      ],
    },
  },
  {
    lesson_id: 6,
    title: "Chọn ảnh: Cảm xúc",
    description: "Nghe và chọn ảnh đúng",
    lesson_type: "vocabulary_image_choice",
    lesson_data: {
      type: "vocabulary_image_choice",
      question: {
        en: "happy",
        audio_url: `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(
          "happy"
        )}`,
      },
      images: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop",
          is_correct: true,
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
          is_correct: false,
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
          is_correct: false,
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
          is_correct: false,
        },
      ],
      layout: "grid",
    },
  },
  {
    lesson_id: 7,
    title: "Hoàn thiện câu: Cảm xúc",
    description: "Kéo thả từ để hoàn thiện câu",
    lesson_type: "vocabulary_sentence_completion",
    lesson_data: {
      type: "vocabulary_sentence_completion",
      questions: [
        {
          vi_text: "đừng cắn nhiều hơn bạn có thể nhai",
          sentence_template:
            "don't {blank1} {blank2} {blank3} {blank4} {blank5} {blank6} chew",
          shuffled_words: [
            { id: 1, text: "bite" },
            { id: 2, text: "off" },
            { id: 3, text: "more" },
            { id: 4, text: "than" },
            { id: 5, text: "you" },
            { id: 6, text: "can" },
          ],
          blanks: [
            { id: "blank1", correct_word_id: 1 },
            { id: "blank2", correct_word_id: 2 },
            { id: "blank3", correct_word_id: 3 },
            { id: "blank4", correct_word_id: 4 },
            { id: "blank5", correct_word_id: 5 },
            { id: "blank6", correct_word_id: 6 },
          ],
        },
        {
          vi_text: "Tôi vui mừng vì hôm nay trời nắng",
          sentence_template: "I am {blank1} because today is {blank2}",
          shuffled_words: [
            { id: 1, text: "happy" },
            { id: 2, text: "sunny" },
            { id: 3, text: "sad" },
            { id: 4, text: "rainy" },
          ],
          blanks: [
            { id: "blank1", correct_word_id: 1 },
            { id: "blank2", correct_word_id: 2 },
          ],
        },
        {
          vi_text: "Cô ấy rất thông minh và xinh đẹp",
          sentence_template: "She is very {blank1} and {blank2}",
          shuffled_words: [
            { id: 1, text: "smart" },
            { id: 2, text: "beautiful" },
            { id: 3, text: "tall" },
            { id: 4, text: "kind" },
          ],
          blanks: [
            { id: "blank1", correct_word_id: 1 },
            { id: "blank2", correct_word_id: 2 },
          ],
        },
      ],
    },
  },
  {
    lesson_id: 8,
    title: "Lý thuyết: Zero Conditional",
    description: "Tìm hiểu về Zero Conditional",
    lesson_type: "grammar_theory",
    lesson_data: {
      type: "grammar_theory",
      sections: [
        {
          title: "Định nghĩa",
          content:
            "<p>Zero Conditional được dùng để diễn tả một sự thật hiển nhiên, một quy luật tự nhiên, hoặc một thói quen luôn luôn đúng.</p>",
          order: 1,
        },
        {
          title: "Cấu trúc",
          content:
            "<p><strong>Cấu trúc:</strong> If + Present Simple, Present Simple</p><p>Ví dụ: If you heat water to 100°C, it boils.</p>",
          order: 2,
        },
        {
          title: "Cách dùng",
          content:
            "<ul><li>Diễn tả sự thật hiển nhiên</li><li>Diễn tả quy luật tự nhiên</li><li>Diễn tả thói quen</li></ul>",
          order: 3,
        },
        {
          title: "Ví dụ",
          content:
            "<ul><li>If you heat water to 100°C, it boils.</li><li>If people don't sleep enough, they get tired.</li><li>If it rains, the ground gets wet.</li></ul>",
          order: 4,
        },
      ],
      examples: [
        {
          en: "If you heat water to 100°C, it boils.",
          vi: "Nếu bạn đun nước đến 100°C, nó sôi.",
        },
        {
          en: "If people don't sleep enough, they get tired.",
          vi: "Nếu người ta không ngủ đủ, họ sẽ mệt mỏi.",
        },
      ],
    },
  },
];

const Test = () => {
  const [selectedLesson, setSelectedLesson] = useState(TEST_LESSONS[0]);
  const [activeTab, setActiveTab] = useState("lesson"); // "lesson" hoặc "studio"

  return (
    <div className="test-page">
      <div className="test-page__container">
        <h1 className="test-page__title">Test Các Loại Bài Tập</h1>
        <p className="test-page__subtitle">
          Chọn một loại bài tập bên dưới để xem giao diện
        </p>

        {/* Tab Navigation */}
        <div className="test-page__tabs">
          <button
            className={`test-page__tab ${
              activeTab === "lesson" ? "active" : ""
            }`}
            onClick={() => setActiveTab("lesson")}
          >
            📚 Bài Tập
          </button>
          <button
            className={`test-page__tab ${
              activeTab === "studio" ? "active" : ""
            }`}
            onClick={() => setActiveTab("studio")}
          >
            ✏️ Lesson Studio
          </button>
        </div>

        {activeTab === "studio" ? (
          <div className="test-page__studio">
            <LessonStudio
              lessonType={selectedLesson.lesson_type}
              initialData={selectedLesson.lesson_data}
              onSave={(data) => {
                console.log("Saved lesson data:", data);
                alert("Lesson data đã được lưu! (Check console)");
              }}
            />
          </div>
        ) : (
          <div className="test-page__layout">
            {/* Sidebar - Danh sách bài tập */}
            <aside className="test-page__sidebar">
              <h3 className="test-page__sidebar-title">Danh sách bài tập</h3>
              <div className="test-page__lesson-list">
                {TEST_LESSONS.map((lesson) => (
                  <button
                    key={lesson.lesson_id}
                    className={`test-page__lesson-item ${
                      selectedLesson.lesson_id === lesson.lesson_id
                        ? "test-page__lesson-item--active"
                        : ""
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <span className="test-page__lesson-icon">
                      {lesson.lesson_type === "vocabulary_list" && "📚"}
                      {lesson.lesson_type === "vocabulary_matching" && "🔗"}
                      {lesson.lesson_type === "vocabulary_translation" && "✍️"}
                      {lesson.lesson_type === "vocabulary_quiz" && "❓"}
                      {lesson.lesson_type === "vocabulary_listening" && "🎧"}
                      {lesson.lesson_type === "vocabulary_image_choice" && "🖼️"}
                      {lesson.lesson_type ===
                        "vocabulary_sentence_completion" && "📝"}
                      {lesson.lesson_type === "grammar_theory" && "📖"}
                    </span>
                    <div className="test-page__lesson-info">
                      <span className="test-page__lesson-name">
                        {lesson.title}
                      </span>
                      <span className="test-page__lesson-type">
                        {lesson.lesson_type.replace("_", " ")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Content - Hiển thị bài tập */}
            <main className="test-page__main">
              <div className="test-page__lesson-header">
                <h2 className="test-page__lesson-title">
                  {selectedLesson.title}
                </h2>
                <p className="test-page__lesson-description">
                  {selectedLesson.description}
                </p>
              </div>

              <div className="test-page__lesson-content">
                {renderLessonComponent(selectedLesson)}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
