const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Tìm đường dẫn ffmpeg và thêm vào PATH
 */
function getPathWithFFmpeg() {
    let newPath = process.env.PATH || "";
    
    // Tìm đường dẫn ffmpeg động
    let ffmpegDir = null;
    try {
        if (process.platform === "win32") {
            // Thử tìm ffmpeg bằng where.exe (Windows)
            const ffmpegPath = execSync("where.exe ffmpeg", { encoding: "utf8", timeout: 2000 }).trim();
            if (ffmpegPath) {
                ffmpegDir = path.dirname(ffmpegPath);
                console.log("[MultiPA] ✅ Found ffmpeg at:", ffmpegPath);
            }
        } else {
            // Linux/Mac: dùng which
            const ffmpegPath = execSync("which ffmpeg", { encoding: "utf8", timeout: 2000 }).trim();
            if (ffmpegPath) {
                ffmpegDir = path.dirname(ffmpegPath);
                console.log("[MultiPA] ✅ Found ffmpeg at:", ffmpegPath);
            }
        }
    } catch (error) {
        console.warn("[MultiPA] ⚠️  Could not find ffmpeg automatically:", error.message);
        // Thử các đường dẫn phổ biến trên Windows
        const commonPaths = [
            "C:\\Users\\Nauh\\AppData\\Local\\Microsoft\\WinGet\\Links",
            "C:\\ffmpeg\\bin",
            process.env.ProgramFiles + "\\ffmpeg\\bin",
        ];
        for (const commonPath of commonPaths) {
            if (fs.existsSync(commonPath) && fs.existsSync(path.join(commonPath, "ffmpeg.exe"))) {
                ffmpegDir = commonPath;
                console.log("[MultiPA] ✅ Found ffmpeg at common path:", commonPath);
                break;
            }
        }
    }
    
    // Thêm ffmpeg vào PATH nếu tìm thấy
    if (ffmpegDir && !newPath.includes(ffmpegDir)) {
        newPath = process.platform === "win32" 
            ? `${ffmpegDir};${newPath}` 
            : `${ffmpegDir}:${newPath}`;
        console.log("[MultiPA] ✅ Added ffmpeg directory to PATH");
    } else if (ffmpegDir) {
        console.log("[MultiPA] ✅ ffmpeg directory already in PATH");
    } else {
        console.warn("[MultiPA] ⚠️  ffmpeg not found - scoring may fail for audio files");
    }
    
    return newPath;
}

/**
 * Score response using MultiPA (Multi-task Pronunciation Assessment)
 * @param {string} inputData - audio path (SPEAKING) or text (WRITING)
 * @param {string} type - "SPEAKING" or "WRITING"
 * @param {string} language - language code (default: "en")
 * @param {string} questionText - nội dung câu hỏi (optional - để đánh giá content relevance)
 * @param {string} referenceAnswer - đáp án mẫu (optional)
 * @returns {Promise<Object>} - scoring result
 */
exports.scoreResponse = async (inputData, type = "SPEAKING", language = "en", questionText = null, referenceAnswer = null) => {
    return new Promise((resolve, reject) => {
        console.log("=== scoreResponse MultiPA Service ===");
        console.log("Type:", type);
        console.log("Language:", language);
        if (type === "SPEAKING") {
            console.log("Audio path:", inputData);
            // Kiểm tra file có tồn tại không
            if (!fs.existsSync(inputData)) {
                console.error("❌ Audio file does not exist:", inputData);
                return reject(new Error(`Audio file không tồn tại: ${inputData}`));
            }
            const stats = fs.statSync(inputData);
            console.log("Audio file size:", (stats.size / (1024 * 1024)).toFixed(2), "MB");
        } else {
            console.log("Text length:", inputData?.length || 0, "characters");
        }
        
        const pythonScript = path.join(__dirname, "../../ai/multiPA_score.py");
        console.log("Python script path:", pythonScript);
        
        // Kiểm tra Python script có tồn tại không
        if (!fs.existsSync(pythonScript)) {
            console.error("❌ Python script does not exist:", pythonScript);
            return reject(new Error(`Python script không tồn tại: ${pythonScript}`));
        }

        const input = JSON.stringify({
            audio_path: type === "SPEAKING" ? inputData : undefined,
            text: type === "WRITING" ? inputData : undefined,
            type,
            language,
            question_text: questionText || undefined,  // Câu hỏi để đánh giá content relevance
            reference_answer: referenceAnswer || undefined  // Đáp án mẫu (optional)
        });

        console.log("Calling Python with input:", JSON.parse(input));
        
        // Lấy PATH có ffmpeg
        const pathWithFFmpeg = getPathWithFFmpeg();
        
        const startTime = Date.now();
        const pyProcess = spawn("python", [pythonScript, input], {
            cwd: path.dirname(pythonScript), // Set working directory
            env: {
                ...process.env, // Giữ nguyên các biến môi trường khác
                PATH: pathWithFFmpeg, // Override PATH để bao gồm ffmpeg
            },
        });

        let output = "";
        let errorOutput = "";

        pyProcess.stdout.on("data", (data) => {
            const dataStr = data.toString();
            console.log("[MultiPA] Python stdout:", dataStr);
            output += dataStr;
        });

        pyProcess.stderr.on("data", (data) => {
            const dataStr = data.toString();
            console.error("[MultiPA] Python stderr:", dataStr);
            errorOutput += dataStr;
        });

        pyProcess.on("error", (error) => {
            const duration = Date.now() - startTime;
            console.error(`[MultiPA] ❌ Python process error after ${duration}ms:`, error);
            reject(new Error(`Lỗi khi chạy Python: ${error.message}`));
        });

        pyProcess.on("close", (code) => {
            const duration = Date.now() - startTime;
            console.log(`[MultiPA] Python process exited with code ${code} after ${duration}ms (${(duration/1000).toFixed(2)}s)`);
            
            if (code !== 0) {
                console.error("[MultiPA] Python error output:", errorOutput);
                return reject(new Error(errorOutput || `Python exited with code ${code}`));
            }

            try {
                // Parse multiple JSON lines if present
                const lines = output.trim().split('\n');
                let result = null;
                
                for (const line of lines) {
                    if (line.trim().startsWith('{')) {
                        try {
                            result = JSON.parse(line);
                            break;
                        } catch (parseErr) {
                            console.warn("[MultiPA] Failed to parse line:", line.substring(0, 100));
                        }
                    }
                }

                if (!result) {
                    console.error("[MultiPA] No valid JSON output. Raw output:", output);
                    return reject(new Error("No valid JSON output from Python"));
                }

                if (result.error) {
                    console.error("[MultiPA] Python returned error:", result.error);
                    return reject(new Error(result.error));
                }

                console.log("[MultiPA] ✅ Scoring successful. Score:", result.score);
                resolve(result);
            } catch (err) {
                console.error("[MultiPA] ❌ Parse error:", err);
                console.error("[MultiPA] Raw output:", output);
                reject(new Error("Failed to parse Python output: " + err.message));
            }
        });
    });
};

/**
 * Score speaking response using audio file
 * @param {string} audioPath - path to audio file
 * @param {string} language - language code
 * @param {string} questionText - nội dung câu hỏi (optional)
 * @param {string} referenceAnswer - đáp án mẫu (optional)
 * @returns {Promise<Object>} - speaking scores (pronunciation, fluency, prosody, relevance)
 */
exports.scoreSpeaking = async (audioPath, language = "en", questionText = null, referenceAnswer = null) => {
    return exports.scoreResponse(audioPath, "SPEAKING", language, questionText, referenceAnswer);
};

/**
 * Score writing response
 * @param {string} text - written text
 * @param {string} language - language code
 * @param {string} questionText - nội dung câu hỏi (optional)
 * @param {string} referenceAnswer - đáp án mẫu (optional)
 * @returns {Promise<Object>} - writing scores
 */
exports.scoreWriting = async (text, language = "en", questionText = null, referenceAnswer = null) => {
    return exports.scoreResponse(text, "WRITING", language, questionText, referenceAnswer);
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

