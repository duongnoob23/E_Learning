const { spawn } = require("child_process");
const path = require("path");

/**
 * Gọi Python Whisper service để transcribe audio
 * @param {string} audioPath - đường dẫn file audio
 * @param {string} language - ngôn ngữ audio
 * @returns {Promise<string>} - transcription
 */
exports.transcribeAudio = async (audioPath, language = "en") => {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, "../../ai/whisper_transcribe.py");

        const pyProcess = spawn("python", [pythonScript, audioPath, language]);

        let output = "";
        let errorOutput = "";

        pyProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pyProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        pyProcess.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(errorOutput || `Python exited with code ${code}`));
            }
            try {
                const result = JSON.parse(output);
                if (result.error) {
                    return reject(new Error(result.error));
                }
                resolve(result.transcription);
            } catch (err) {
                reject(new Error("Không parse được kết quả từ Python: " + err.message));
            }
        });
    });
};

/**
 * Transcribe nhiều file cùng lúc
 * @param {Array<{audioPath: string, language?: string}>} files
 * @returns {Promise<Array<string>>}
 */
exports.transcribeMultipleFiles = async (files) => {
    const promises = files.map(f => exports.transcribeAudio(f.audioPath, f.language || "en"));
    return Promise.all(promises);
};
