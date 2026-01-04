/**
 * Question Import Utilities
 * Prepared structure for future CSV/JSON import functionality
 * 
 * This file provides utilities for importing questions from external sources.
 * Currently prepared for future implementation.
 */

/**
 * Expected CSV format for Listening/Reading questions:
 * 
 * question_number,question_text,audio_file,image_file,transcript,explanation,choice_a,choice_b,choice_c,choice_d,correct_answer
 * 1,"What is this?","https://...","https://...","Transcript text","Explanation","Option A","Option B","Option C","Option D","A"
 * 
 * Expected JSON format:
 * [
 *   {
 *     "question_number": 1,
 *     "question_text": "What is this?",
 *     "audio_file": "https://...",
 *     "image_file": "https://...",
 *     "transcript": "Transcript text",
 *     "explanation": "Explanation",
 *     "choices": [
 *       { "choice_letter": "A", "choice_text": "Option A", "is_correct": true },
 *       { "choice_letter": "B", "choice_text": "Option B", "is_correct": false },
 *       { "choice_letter": "C", "choice_text": "Option C", "is_correct": false },
 *       { "choice_letter": "D", "choice_text": "Option D", "is_correct": false }
 *     ]
 *   }
 * ]
 */

/**
 * Parse CSV string to questions array
 * @param {string} csvText - CSV content as string
 * @returns {Array} Array of question objects
 */
export function parseCSVToQuestions(csvText) {
  // TODO: Implement CSV parsing
  // This is a placeholder for future implementation
  throw new Error("CSV import not yet implemented");
}

/**
 * Parse JSON string to questions array
 * @param {string} jsonText - JSON content as string
 * @returns {Array} Array of question objects
 */
export function parseJSONToQuestions(jsonText) {
  try {
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data)) {
      throw new Error("JSON must be an array of questions");
    }
    
    // Validate and normalize question structure
    return data.map((q, index) => ({
      id: q.id || `q_${Date.now()}_${index}`,
      question_number: q.question_number || index + 1,
      question_text: q.question_text || "",
      question_type: q.question_type || "MULTIPLE_CHOICE",
      audio_file: q.audio_file || "",
      image_file: q.image_file || "",
      transcript: q.transcript || "",
      explanation: q.explanation || "",
      choices: q.choices || [
        { choice_letter: "A", choice_text: "", is_correct: false },
        { choice_letter: "B", choice_text: "", is_correct: false },
        { choice_letter: "C", choice_text: "", is_correct: false },
        { choice_letter: "D", choice_text: "", is_correct: false },
      ],
    }));
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error.message}`);
  }
}

/**
 * Validate question structure
 * @param {Object} question - Question object to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateQuestion(question) {
  const errors = [];

  if (!question.question_text || question.question_text.trim().length === 0) {
    errors.push("Question text is required");
  }

  if (question.choices && question.choices.length > 0) {
    const hasCorrect = question.choices.some(c => c.is_correct);
    if (!hasCorrect) {
      errors.push("At least one choice must be marked as correct");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Export questions to JSON format
 * @param {Array} questions - Array of question objects
 * @returns {string} JSON string
 */
export function exportQuestionsToJSON(questions) {
  return JSON.stringify(questions, null, 2);
}

/**
 * Export questions to CSV format
 * @param {Array} questions - Array of question objects
 * @returns {string} CSV string
 */
export function exportQuestionsToCSV(questions) {
  // TODO: Implement CSV export
  // This is a placeholder for future implementation
  throw new Error("CSV export not yet implemented");
}

