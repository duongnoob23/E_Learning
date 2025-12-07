const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const INPUT_DIR = "./simple";

async function main() {
    const conn = await mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "123456",
        database: "e_learnning6",
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
                        raw_source_url = ?,
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
                        w.source_url || null,
                        w.updated_at || new Date().toISOString(),
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
                         example_en, example_vi, image_url, audio_url, raw_source_url,
                         word_type, created_by, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                        w.source_url || null,
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
