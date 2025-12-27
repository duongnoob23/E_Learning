const fs = require("fs");
const path = require("path");
const sequelize = require("../src/config/database");
const db = require("../src/models");

/**
 * Script để import các từ từ file JSON vào bảng words
 * 
 * Usage: node backend/scripts/importWordsFromJSON.js [topic_id] [folder_path]
 * 
 * Example:
 *   node backend/scripts/importWordsFromJSON.js 1 zDesignDB/CrawlData/simple
 */

// Mapping từ JSON sang database
const mapWordData = (jsonWord, topicId) => {
  // Normalize part of speech
  const normalizePOS = (pos) => {
    if (!pos) return null;
    const posLower = pos.toLowerCase().trim();
    
    // Map các dạng viết tắt và biến thể
    const posMap = {
      "n.": "noun",
      "v.": "verb",
      "adj.": "adjective",
      "adv.": "adverb",
      "prep.": "preposition",
      "conj.": "conjunction",
      "pron.": "pronoun",
      "interj.": "interjection",
      "indefinite article": "article",
      "definite article": "article",
      "article": "article",
    };
    
    return posMap[posLower] || posLower;
  };

  // Lấy meaning_vi, nếu không có thì dùng definition
  const meaningVi = jsonWord.meaning_vi && jsonWord.meaning_vi.trim() 
    ? jsonWord.meaning_vi.trim() 
    : (jsonWord.definition ? jsonWord.definition.trim() : "");

  // Nếu meaning_vi vẫn trống, bỏ qua từ này
  if (!meaningVi) {
    return null;
  }

  return {
    topic_id: topicId,
    word: jsonWord.word.trim(),
    part_of_speech: normalizePOS(jsonWord.pos),
    pronunciation: jsonWord.phonetic ? jsonWord.phonetic.trim() : null,
    audio_url: jsonWord.audio ? jsonWord.audio.trim() : null,
    meaning_vi: meaningVi,
    definition_en: jsonWord.definition ? jsonWord.definition.trim() : null,
    example_en: jsonWord.example_en ? jsonWord.example_en.trim() : null,
    example_vi: jsonWord.example_vi ? jsonWord.example_vi.trim() : null,
    image_url: jsonWord.image_url && jsonWord.image_url.trim() 
      ? jsonWord.image_url.trim() 
      : null,
    raw_source_url: jsonWord.source_url ? jsonWord.source_url.trim() : null,
    word_type: "system",
    is_active: 1,
  };
};

// Đọc và parse file JSON
const readJSONFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
};

// Import từ một file JSON
const importFromFile = async (filePath, topicId, Word) => {
  const words = readJSONFile(filePath);
  if (!words || !Array.isArray(words)) {
    console.error(`Invalid JSON format in ${filePath}`);
    return { success: 0, skipped: 0, errors: 1 };
  }

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errors = [];

  console.log(`\nProcessing ${filePath}... (${words.length} words)`);

  for (let i = 0; i < words.length; i++) {
    const jsonWord = words[i];
    
    try {
      // Map dữ liệu
      const wordData = mapWordData(jsonWord, topicId);
      
      // Skip nếu không có meaning_vi
      if (!wordData) {
        skippedCount++;
        continue;
      }

      // Kiểm tra từ đã tồn tại chưa (theo word và topic_id)
      const existingWord = await Word.findOne({
        where: {
          word: wordData.word,
          topic_id: topicId,
        },
      });

      if (existingWord) {
        // Update từ đã tồn tại
        await Word.update(wordData, {
          where: {
            word_id: existingWord.word_id,
          },
        });
        successCount++;
      } else {
        // Tạo từ mới
        await Word.create(wordData);
        successCount++;
      }

      // Log progress mỗi 100 từ
      if ((i + 1) % 100 === 0) {
        process.stdout.write(`  Processed ${i + 1}/${words.length} words...\r`);
      }
    } catch (error) {
      errorCount++;
      errors.push({
        word: jsonWord.word,
        error: error.message,
      });
      
      if (errorCount <= 10) {
        console.error(`\n  Error processing word "${jsonWord.word}":`, error.message);
      }
    }
  }

  return {
    success: successCount,
    skipped: skippedCount,
    errors: errorCount,
    errorDetails: errors,
  };
};

// Import tất cả file JSON trong thư mục
const importFromFolder = async (folderPath, topicId) => {
  try {
    // Kết nối database
    await sequelize.authenticate();
    console.log("✓ Database connection established");

    const Word = db.Word;

    // Đọc danh sách file trong thư mục
    const files = fs.readdirSync(folderPath);
    const jsonFiles = files.filter(
      (file) => file.endsWith(".json") && file !== "test.json"
    );

    if (jsonFiles.length === 0) {
      console.error(`No JSON files found in ${folderPath}`);
      return;
    }

    console.log(`Found ${jsonFiles.length} JSON files to process`);
    console.log(`Topic ID: ${topicId}`);

    let totalSuccess = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const allErrors = [];

    // Xử lý từng file
    for (const file of jsonFiles) {
      const filePath = path.join(folderPath, file);
      const result = await importFromFile(filePath, topicId, Word);
      
      totalSuccess += result.success;
      totalSkipped += result.skipped;
      totalErrors += result.errors;
      allErrors.push(...(result.errorDetails || []));
    }

    // Tổng kết
    console.log("\n" + "=".repeat(60));
    console.log("IMPORT SUMMARY");
    console.log("=".repeat(60));
    console.log(`✓ Successfully imported/updated: ${totalSuccess} words`);
    console.log(`⊘ Skipped (no meaning_vi): ${totalSkipped} words`);
    console.log(`✗ Errors: ${totalErrors} words`);
    
    if (allErrors.length > 0 && allErrors.length <= 20) {
      console.log("\nError details:");
      allErrors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. "${err.word}": ${err.error}`);
      });
    } else if (allErrors.length > 20) {
      console.log(`\nFirst 20 errors:`);
      allErrors.slice(0, 20).forEach((err, idx) => {
        console.log(`  ${idx + 1}. "${err.word}": ${err.error}`);
      });
      console.log(`  ... and ${allErrors.length - 20} more errors`);
    }

    console.log("=".repeat(60));
  } catch (error) {
    console.error("Fatal error:", error);
    throw error;
  } finally {
    await sequelize.close();
    console.log("\n✓ Database connection closed");
  }
};

// Main
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: node importWordsFromJSON.js <topic_id> [folder_path]");
    console.error("\nExample:");
    console.error("  node importWordsFromJSON.js 1 zDesignDB/CrawlData/simple");
    process.exit(1);
  }

  const topicId = parseInt(args[0]);
  const folderPath = args[1] || path.join(__dirname, "../../zDesignDB/CrawlData/simple");

  if (isNaN(topicId)) {
    console.error("Error: topic_id must be a number");
    process.exit(1);
  }

  if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder not found: ${folderPath}`);
    process.exit(1);
  }

  // Kiểm tra topic có tồn tại không
  try {
    await sequelize.authenticate();
    const Topic = db.Topic;
    const topic = await Topic.findByPk(topicId);
    
    if (!topic) {
      console.error(`Error: Topic with ID ${topicId} not found`);
      await sequelize.close();
      process.exit(1);
    }
    
    console.log(`✓ Topic found: "${topic.topic_name}" (ID: ${topicId})`);
    await sequelize.close();
  } catch (error) {
    console.error("Error checking topic:", error.message);
    process.exit(1);
  }

  // Import
  await importFromFolder(folderPath, topicId);
};

// Chạy script
main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});

