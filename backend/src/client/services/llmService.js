const { spawn } = require("child_process");
const path = require("path");
exports.gradeByLLM = async ({ text, type, language = "en" }) => {
    return new Promise((resolve, reject) => {
        const pythonScript = path.resolve(__dirname, "../../ai/llm_grade.py");

        const pyProcess = spawn("python", [pythonScript, JSON.stringify({ text, type, language })], {
            env: { ...process.env } // không cần OPENAI_API_KEY nữa
        });

        let output = "";
        let errorOutput = "";

        pyProcess.stdout.on("data", (data) => output += data.toString());
        pyProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
            console.error("Python stderr:", data.toString());
        });

        pyProcess.on("close", (code) => {
            if (code !== 0) return reject(new Error(errorOutput || `Python exited với code ${code}`));
            try {
                const result = JSON.parse(output);
                resolve(result);
            } catch (err) {
                reject(new Error("Không parse được kết quả từ Python: " + err.message));
            }
        });
    });
};
