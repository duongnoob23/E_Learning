const fs = require("fs");
const path = require("path");

// Function to analyze words and determine topic
function analyzeTopic(words) {
  const businessKeywords = [
    "accountant",
    "client",
    "conference",
    "meeting",
    "office",
    "business",
    "manager",
    "employee",
    "company",
    "corporate",
    "executive",
    "contract",
  ];
  const travelKeywords = [
    "airport",
    "airplane",
    "baggage",
    "hotel",
    "reservation",
    "flight",
    "ticket",
    "passenger",
    "travel",
    "trip",
    "journey",
    "destination",
  ];
  const generalKeywords = [
    "appliance",
    "assignment",
    "attendant",
    "bicycle",
    "chef",
    "clerk",
  ];

  let businessCount = 0;
  let travelCount = 0;

  words.forEach((word) => {
    const wordLower = word.word.toLowerCase();
    if (businessKeywords.some((kw) => wordLower.includes(kw))) businessCount++;
    if (travelKeywords.some((kw) => wordLower.includes(kw))) travelCount++;
  });

  if (businessCount > travelCount && businessCount > 2) {
    return {
      topic: "Business English",
      description:
        "Từ vựng tiếng Anh thương mại và kinh doanh thường gặp trong TOEIC",
    };
  } else if (travelCount > businessCount && travelCount > 2) {
    return {
      topic: "Travel & Transportation",
      description: "Từ vựng về du lịch và giao thông vận tải trong TOEIC",
    };
  } else {
    return {
      topic: "TOEIC General Vocabulary",
      description: "Bộ từ vựng TOEIC tổng hợp thường gặp trong kỳ thi",
    };
  }
}

// Get all format.json files in current directory
const files = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith("-format.json"));

console.log(`Found ${files.length} format files to convert\n`);

files.forEach((inputFile, index) => {
  try {
    // Read input file
    const inputData = JSON.parse(fs.readFileSync(inputFile, "utf8"));

    // Convert to flashcard format (same logic as convert-flashcard.js)
    const words = inputData.map((item) => ({
      word: item.en || item.word || "",
      pronunciation: item.pronunciation || "",
      meaning_vi: item.vi || item.meaning_vi || "",
      meaning_en: item.meaning_en || "",
      part_of_speech: item.part_of_speech || "noun",
      example_sentence:
        item.example || item.example_sentence || item.example_en || "",
      example_translation: item.example_translation || item.example_vi || "",
      image_url: item.image_url || "",
      audio_url: item.audio_url || "",
    }));

    // Analyze topic from words
    const metadata = analyzeTopic(words);

    // Create final result with metadata at the top
    const result = {
      topic: metadata.topic,
      description: metadata.description,
      total_words: words.length,
      words: words,
    };

    // Generate output filename
    // list_45102-format.json -> file-flashcard-45102.json
    // Or if no match, use index
    const match = inputFile.match(/list_(\d+)-format\.json/);
    const outputFile = match
      ? `file-flashcard-${match[1]}.json`
      : `file-flashcard-${index + 1}.json`;

    // Write output file
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.log(
      `✓ ${inputFile} → ${outputFile} (${result.total_words} words, Topic: ${metadata.topic})`
    );
  } catch (error) {
    console.error(`✗ Error processing ${inputFile}:`, error.message);
  }
});

console.log(`\n✅ Conversion complete!`);
