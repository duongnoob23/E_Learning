const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Gọi Python Whisper service để transcribe audio
 * @param {string} audioPath - đường dẫn file audio
 * @param {string} language - ngôn ngữ audio
 * @returns {Promise<string>} - transcription
 */
exports.transcribeAudio = async (audioPath, language = "en") => {
    return new Promise((resolve, reject) => {
        console.log("=== transcribeAudio Service ===");
        console.log("Audio path:", audioPath);
        console.log("Language:", language);
        
        // Kiểm tra file có tồn tại không
        if (!fs.existsSync(audioPath)) {
            console.error("❌ Audio file does not exist:", audioPath);
            return reject(new Error(`File không tồn tại: ${audioPath}`));
        }
        
        // Kiểm tra file size
        const stats = fs.statSync(audioPath);
        console.log("File size:", (stats.size / (1024 * 1024)).toFixed(2), "MB");
        
        const pythonScript = path.join(__dirname, "../../ai/whisper_transcribe.py");
        console.log("Python script path:", pythonScript);
        
        // Kiểm tra Python script có tồn tại không
        if (!fs.existsSync(pythonScript)) {
            console.error("❌ Python script does not exist:", pythonScript);
            return reject(new Error(`Python script không tồn tại: ${pythonScript}`));
        }
        
        // Normalize path cho Windows (chuyển backslash thành forward slash hoặc dùng path.resolve)
        const normalizedAudioPath = path.resolve(audioPath);
        console.log("Normalized audio path:", normalizedAudioPath);
        
        // Thử dùng python3 trước, nếu không có thì dùng python
        const pythonCommand = process.platform === "win32" ? "python" : "python3";
        console.log("Python command:", pythonCommand);
        console.log("Calling Python with:", [pythonScript, normalizedAudioPath, language]);
        
        // Tìm đường dẫn ffmpeg động
        let ffmpegDir = null;
        try {
            if (process.platform === "win32") {
                // Thử tìm ffmpeg bằng where.exe (Windows)
                const ffmpegPath = execSync("where.exe ffmpeg", { encoding: "utf8", timeout: 2000 }).trim();
                if (ffmpegPath) {
                    ffmpegDir = path.dirname(ffmpegPath);
                    console.log("✅ Found ffmpeg at:", ffmpegPath);
                    console.log("   Directory:", ffmpegDir);
                }
            } else {
                // Linux/Mac: dùng which
                const ffmpegPath = execSync("which ffmpeg", { encoding: "utf8", timeout: 2000 }).trim();
                if (ffmpegPath) {
                    ffmpegDir = path.dirname(ffmpegPath);
                    console.log("✅ Found ffmpeg at:", ffmpegPath);
                }
            }
        } catch (error) {
            console.warn("⚠️  Could not find ffmpeg automatically:", error.message);
            // Thử các đường dẫn phổ biến trên Windows
            const commonPaths = [
                "C:\\Users\\Nauh\\AppData\\Local\\Microsoft\\WinGet\\Links",
                "C:\\ffmpeg\\bin",
                process.env.ProgramFiles + "\\ffmpeg\\bin",
            ];
            for (const commonPath of commonPaths) {
                if (fs.existsSync(commonPath) && fs.existsSync(path.join(commonPath, "ffmpeg.exe"))) {
                    ffmpegDir = commonPath;
                    console.log("✅ Found ffmpeg at common path:", commonPath);
                    break;
                }
            }
        }
        
        // Lấy PATH hiện tại và thêm đường dẫn ffmpeg (nếu tìm thấy)
        let newPath = process.env.PATH || "";
        if (ffmpegDir && !newPath.includes(ffmpegDir)) {
            newPath = process.platform === "win32" 
                ? `${ffmpegDir};${newPath}` 
                : `${ffmpegDir}:${newPath}`;
            console.log("✅ Added ffmpeg directory to PATH");
        } else if (ffmpegDir) {
            console.log("✅ ffmpeg directory already in PATH");
        } else {
            console.warn("⚠️  ffmpeg not found - transcription may fail for some audio formats");
        }
        
        const startTime = Date.now();
        const pyProcess = spawn(pythonCommand, [pythonScript, normalizedAudioPath, language], {
            cwd: path.dirname(pythonScript), // Set working directory
            env: {
                ...process.env, // Giữ nguyên các biến môi trường khác
                PATH: newPath, // Override PATH để bao gồm ffmpeg
            },
        });

        let output = "";
        let errorOutput = "";

        pyProcess.stdout.on("data", (data) => {
            const dataStr = data.toString();
            console.log("Python stdout:", dataStr);
            output += dataStr;
        });

        pyProcess.stderr.on("data", (data) => {
            const dataStr = data.toString();
            console.error("Python stderr:", dataStr);
            errorOutput += dataStr;
        });

        pyProcess.on("error", (error) => {
            const duration = Date.now() - startTime;
            console.error(`❌ Python process error after ${duration}ms:`, error);
            reject(new Error(`Lỗi khi chạy Python: ${error.message}`));
        });

        pyProcess.on("close", (code) => {
            const duration = Date.now() - startTime;
            console.log(`Python process exited with code ${code} after ${duration}ms (${(duration/1000).toFixed(2)}s)`);
            console.log("Python output:", output);
            if (errorOutput) {
                console.error("Python error output:", errorOutput);
            }
            
            if (code !== 0) {
                return reject(new Error(errorOutput || `Python exited with code ${code}`));
            }
            try {
                const result = JSON.parse(output);
                if (result.error) {
                    return reject(new Error(result.error));
                }
                console.log("✅ Transcription successful:", result.transcription?.substring(0, 100) + "...");
                resolve(result.transcription);
            } catch (err) {
                console.error("❌ Parse error:", err);
                console.error("Raw output:", output);
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
