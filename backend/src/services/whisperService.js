/**
 * Whisper Service - Interface to communicate with Python Whisper API
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class WhisperService {
    constructor() {
        this.baseURL = process.env.WHISPER_SERVICE_URL || 'http://localhost:5001';
        this.timeout = parseInt(process.env.WHISPER_TIMEOUT) || 60000; // 60 seconds
    }

    /**
     * Check if Whisper service is healthy
     */
    async healthCheck() {
        try {
            const response = await axios.get(`${this.baseURL}/health`, {
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error('Whisper service health check failed:', error.message);
            throw new Error('Whisper service is not available');
        }
    }

    /**
     * Transcribe audio file using Whisper service
     * @param {string} audioFilePath - Path to the audio file
     * @param {string} language - Optional language code (e.g., 'en', 'vi')
     * @param {string} task - 'transcribe' or 'translate'
     * @returns {Promise<Object>} Transcription result
     */
    async transcribeAudio(audioFilePath, language = null, task = 'transcribe') {
        try {
            // Check if file exists
            if (!fs.existsSync(audioFilePath)) {
                throw new Error(`Audio file not found: ${audioFilePath}`);
            }

            // Create form data
            const form = new FormData();
            form.append('audio_file', fs.createReadStream(audioFilePath));
            
            if (language) {
                form.append('language', language);
            }
            
            form.append('task', task);

            // Make request to Whisper service
            const response = await axios.post(`${this.baseURL}/transcribe`, form, {
                headers: {
                    ...form.getHeaders(),
                },
                timeout: this.timeout,
                maxContentLength: 50 * 1024 * 1024, // 50MB
                maxBodyLength: 50 * 1024 * 1024
            });

            return response.data;

        } catch (error) {
            console.error('Whisper transcription error:', error.message);
            
            if (error.response) {
                // Server responded with error status
                const errorData = error.response.data;
                throw new Error(errorData.error || 'Transcription failed');
            } else if (error.code === 'ECONNREFUSED') {
                throw new Error('Whisper service is not running');
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Transcription timeout - file may be too large');
            } else {
                throw new Error(`Transcription failed: ${error.message}`);
            }
        }
    }

    /**
     * Get available Whisper models
     */
    async getAvailableModels() {
        try {
            const response = await axios.get(`${this.baseURL}/models`, {
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get Whisper models:', error.message);
            throw new Error('Failed to get available models');
        }
    }

    /**
     * Get supported languages
     */
    async getSupportedLanguages() {
        try {
            const response = await axios.get(`${this.baseURL}/languages`, {
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get supported languages:', error.message);
            throw new Error('Failed to get supported languages');
        }
    }

    /**
     * Process speaking response with error handling and retries
     * @param {string} audioFilePath - Path to audio file
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} Processing result
     */
    async processSpeakingResponse(audioFilePath, options = {}) {
        const {
            language = null,
            task = 'transcribe',
            maxRetries = 2,
            retryDelay = 1000
        } = options;

        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Transcription attempt ${attempt}/${maxRetries} for file: ${path.basename(audioFilePath)}`);
                
                const result = await this.transcribeAudio(audioFilePath, language, task);
                
                if (result.success) {
                    console.log(`Transcription successful on attempt ${attempt}`);
                    return {
                        success: true,
                        transcription: result.transcription,
                        language_detected: result.language_detected,
                        confidence_score: result.confidence_score,
                        duration_seconds: result.file_info?.size_mb ? 
                            this.estimateDuration(result.file_info.size_mb) : null,
                        processing_time: result.processing_time_seconds,
                        segments: result.segments || [],
                        model_used: result.model_used,
                        attempt: attempt
                    };
                } else {
                    throw new Error(result.error || 'Transcription failed');
                }

            } catch (error) {
                lastError = error;
                console.error(`Transcription attempt ${attempt} failed:`, error.message);
                
                if (attempt < maxRetries) {
                    console.log(`Retrying in ${retryDelay}ms...`);
                    await this.delay(retryDelay);
                    retryDelay *= 2; // Exponential backoff
                }
            }
        }

        // All attempts failed
        return {
            success: false,
            error: lastError.message,
            attempts: maxRetries
        };
    }

    /**
     * Estimate audio duration from file size (rough approximation)
     * @param {number} fileSizeMB - File size in MB
     * @returns {number} Estimated duration in seconds
     */
    estimateDuration(fileSizeMB) {
        // Rough estimation: 1MB ≈ 60 seconds for typical speech audio
        return Math.round(fileSizeMB * 60);
    }

    /**
     * Delay utility for retries
     * @param {number} ms - Milliseconds to delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Validate audio file before processing
     * @param {string} filePath - Path to audio file
     * @returns {Object} Validation result
     */
    validateAudioFile(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                return { valid: false, error: 'File does not exist' };
            }

            const stats = fs.statSync(filePath);
            const fileSizeMB = stats.size / (1024 * 1024);
            
            if (fileSizeMB > 25) {
                return { valid: false, error: 'File size exceeds 25MB limit' };
            }

            const ext = path.extname(filePath).toLowerCase();
            const allowedExtensions = ['.wav', '.mp3', '.mp4', '.m4a', '.webm', '.ogg'];
            
            if (!allowedExtensions.includes(ext)) {
                return { 
                    valid: false, 
                    error: `Unsupported file format. Allowed: ${allowedExtensions.join(', ')}` 
                };
            }

            return { 
                valid: true, 
                size_mb: fileSizeMB,
                extension: ext 
            };

        } catch (error) {
            return { valid: false, error: `File validation error: ${error.message}` };
        }
    }
}

module.exports = new WhisperService();
