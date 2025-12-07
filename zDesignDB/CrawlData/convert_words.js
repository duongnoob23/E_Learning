const fs = require("fs");
const path = require("path");

// Thư mục chứa json gốc
const INPUT_DIR = "./output";
// Thư mục output
const OUTPUT_DIR = "./converted";

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

function normalize(entry) {
    return {
        word: entry.word || "",
        pos: entry.pos ? entry.pos.replace(/[()]/g, "").trim() : "",

        // Giữ 1 phiên âm
        phonetic: entry.phonetic_br || entry.ipa || "",

        // Giữ 1 audio (UK)
        audio: entry.audio_br || null,

        definitions: entry.definitions || [],
        examples_en: entry.examples || [],

        meaning_vi: entry.meaning_vi || "",
        examples_vi: entry.examples_vi || [],

        image_url: entry.image || null,
        source_url: entry.url || "",

        updated_at: entry.crawled_at || new Date().toISOString()
    };
}

function convertAll() {
    const files = fs.readdirSync(INPUT_DIR);

    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const rawPath = path.join(INPUT_DIR, file);
        const rawData = JSON.parse(fs.readFileSync(rawPath, "utf8"));

        let output = [];

        // File có thể là 1 object hoặc array
        if (Array.isArray(rawData)) {
            output = rawData.map(normalize);
        } else {
            output = [normalize(rawData)];
        }

        const outPath = path.join(OUTPUT_DIR, file);
        fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

        console.log(`✔ Converted: ${file}`);
    }
}

convertAll();
