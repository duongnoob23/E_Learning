const { spawn } = require("child_process");
const path = require("path");

/**
 * Score response using MultiPA (Multi-task Pronunciation Assessment)
 * @param {string} inputData - audio path (SPEAKING) or text (WRITING)
 * @param {string} type - "SPEAKING" or "WRITING"
 * @param {string} language - language code (default: "en")
 * @returns {Promise<Object>} - scoring result
 */
exports.scoreResponse = async (inputData, type = "SPEAKING", language = "en") => {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, "../../ai/multiPA_score.py");

        const input = JSON.stringify({
            audio_path: type === "SPEAKING" ? inputData : undefined,
            text: type === "WRITING" ? inputData : undefined,
            type,
            language
        });

        const pyProcess = spawn("python", [pythonScript, input]);

        let output = "";
        let errorOutput = "";

        pyProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pyProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
            console.error("Python stderr:", data.toString());
        });

        pyProcess.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(errorOutput || `Python exited with code ${code}`));
            }

            try {
                // Parse multiple JSON lines if present
                const lines = output.trim().split('\n');
                let result = null;
                
                for (const line of lines) {
                    if (line.trim().startsWith('{')) {
                        result = JSON.parse(line);
                        break;
                    }
                }

                if (!result) {
                    return reject(new Error("No valid JSON output from Python"));
                }

                if (result.error) {
                    return reject(new Error(result.error));
                }

                resolve(result);
            } catch (err) {
                reject(new Error("Failed to parse Python output: " + err.message));
            }
        });

        pyProcess.on("error", (err) => {
            reject(new Error("Failed to spawn Python process: " + err.message));
        });
    });
};

/**
 * Score speaking response using audio file
 * @param {string} audioPath - path to audio file
 * @param {string} language - language code
 * @returns {Promise<Object>} - speaking scores (pronunciation, fluency, prosody)
 */
exports.scoreSpeaking = async (audioPath, language = "en") => {
    return exports.scoreResponse(audioPath, "SPEAKING", language);
};

/**
 * Score writing response
 * @param {string} text - written text
 * @param {string} language - language code
 * @returns {Promise<Object>} - writing scores
 */
exports.scoreWriting = async (text, language = "en") => {
    return exports.scoreResponse(text, "WRITING", language);
};

/**
 * Score multiple audio files in batch
 * @param {Array<{audio_path: string, language?: string}>} audioFiles
 * @returns {Promise<Array<Object>>} - array of scoring results
 */
exports.scoreMultiple = async (audioFiles) => {
    const promises = audioFiles.map(f =>
        exports.scoreResponse(f.audio_path, "SPEAKING", f.language || "en")
    );
    return Promise.all(promises);
};

