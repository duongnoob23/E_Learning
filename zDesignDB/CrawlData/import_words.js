const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const INPUT_DIR = "./simple";

// Hàm chuyển đổi ISO datetime sang MySQL datetime format
function toMySQLDateTime(isoString) {
    if (!isoString) return null;
    try {
        const date = new Date(isoString);
        // Format: YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (err) {
        return null;
    }
}

async function main() {
    const conn = await mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "123456",
        database: "elearn5",
        port: 3306
    });

    console.log("MySQL connected!");

    const files = fs.readdirSync(INPUT_DIR);

    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        let data;
        try {
            data = JSON.parse(fs.readFileSync(path.join(INPUT_DIR, file), "utf8"));
        } catch (err) {
            console.error(`❌ ERROR reading JSON file: ${file}`, err);
            continue;
        }

        for (const w of data) {
            try {
                // UPDATE trước
                const [updateResult] = await conn.execute(
                    `UPDATE words SET
                        part_of_speech = ?,
                        pronunciation = ?,
                        meaning_vi = ?,
                        definition_en = ?,
                        example_en = ?,
                        example_vi = ?,
                        image_url = ?,
                        audio_url = ?,
                        
                        updated_at = ?
                    WHERE word = ?`,
                    [
                        w.pos || null,
                        w.phonetic || null,
                        w.meaning_vi || "",
                        w.definition || "",
                        w.example_en || "",
                        w.example_vi || "",
                        w.image_url || null,
                        w.audio || null,
                       
                        toMySQLDateTime(w.updated_at) || toMySQLDateTime(new Date().toISOString()),
                        w.word
                    ]
                );

                if (updateResult.affectedRows > 0) {
                    console.log(`✔ Updated: ${w.word}`);
                    continue;
                }

                // INSERT fallback
                const [insertResult] = await conn.execute(
                    `INSERT INTO words
                        (topic_id, word, part_of_speech, pronunciation, meaning_vi, definition_en,
                         example_en, example_vi, image_url, audio_url, 
                         word_type, created_by, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        1,                       // topic_id (bắt buộc)
                        w.word,
                        w.pos || null,
                        w.phonetic || null,
                        w.meaning_vi || "",
                        w.definition || "",
                        w.example_en || "",
                        w.example_vi || "",
                        w.image_url || null,
                        w.audio || null,
                        
                        "system",                // word_type
                        null,                    // created_by
                        1,                       // is_active
                    ]
                );

                console.log(`➕ INSERTED: ${w.word}`);

            } catch (err) {
                console.error(`❌ SQL ERROR on word: ${w.word}`, err);
                continue;
            }
        }
    }

    await conn.end();
    console.log("🎉 DONE: All SIMPLE words imported (update + insert)!");
}

main().catch(err => {
    console.error("❌ FATAL ERROR:", err);
});
