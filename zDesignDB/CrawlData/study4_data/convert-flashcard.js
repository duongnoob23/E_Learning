const fs = require('fs');

// Read input file
const inputData = JSON.parse(fs.readFileSync('list_45101-format.json', 'utf8'));

// Convert to flashcard format
const result = inputData.map(item => ({
  word: item.en || item.word || '',
  pronunciation: item.pronunciation || '',
  meaning_vi: item.vi || item.meaning_vi || '',
  meaning_en: item.meaning_en || '',
  part_of_speech: item.part_of_speech || 'noun',
  example_sentence: item.example || item.example_sentence || item.example_en || '',
  example_translation: item.example_translation || item.example_vi || '',
  image_url: item.image_url || '',
  audio_url: item.audio_url || ''
}));

// Write output file
fs.writeFileSync('file-flashcard.json', JSON.stringify(result, null, 2));
console.log(`Created file-flashcard.json with ${result.length} words`);

