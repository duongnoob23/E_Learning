# Whisper Speech-to-Text Service

Flask API service for processing audio files using OpenAI Whisper for the E-Learning Speaking Exam feature.

## Features

- Speech-to-text transcription using OpenAI Whisper
- Support for multiple audio formats (wav, mp3, mp4, m4a, webm, ogg)
- Language detection and multi-language support
- Confidence scoring
- RESTful API with JSON responses
- CORS enabled for web integration
- File size limits and security measures

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- (Optional) CUDA-compatible GPU for faster processing

### Setup

1. **Create virtual environment:**
```bash
cd whisper_service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Create uploads directory:**
```bash
mkdir uploads
```

## Usage

### Start the service

```bash
python app.py
```

The service will start on `http://localhost:5001` by default.

### Environment Variables

- `WHISPER_MODEL`: Model size (tiny, base, small, medium, large) - default: 'base'
- `PORT`: Service port - default: 5001
- `DEBUG`: Enable debug mode - default: False

Example:
```bash
export WHISPER_MODEL=small
export PORT=5001
export DEBUG=true
python app.py
```

## API Endpoints

### 1. Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "whisper-speech-to-text",
  "model": "base",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00"
}
```

### 2. Transcribe Audio
```
POST /transcribe
```

Form data:
- `audio_file`: Audio file (required)
- `language`: Language code (optional, e.g., 'en', 'vi')
- `task`: 'transcribe' or 'translate' (optional, default: 'transcribe')

Response:
```json
{
  "success": true,
  "transcription": "Hello, this is a test recording.",
  "language_detected": "en",
  "confidence_score": 0.95,
  "segments": [
    {
      "start": 0.0,
      "end": 3.5,
      "text": "Hello, this is a test recording."
    }
  ],
  "processing_time_seconds": 2.3,
  "file_info": {
    "size_bytes": 245760,
    "size_mb": 0.23
  },
  "model_used": "base",
  "task": "transcribe",
  "timestamp": "2024-01-01T12:00:00"
}
```

### 3. Available Models
```
GET /models
```

### 4. Supported Languages
```
GET /languages
```

## Model Sizes and Performance

| Model | Size | Speed | Accuracy |
|-------|------|-------|----------|
| tiny  | 39 MB | Fastest | Good |
| base  | 74 MB | Fast | Better |
| small | 244 MB | Medium | Good |
| medium| 769 MB | Slow | Very Good |
| large | 1550 MB | Slowest | Best |

## Integration with Node.js

Example Node.js code to call the service:

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function transcribeAudio(audioFilePath, language = null) {
  const form = new FormData();
  form.append('audio_file', fs.createReadStream(audioFilePath));
  
  if (language) {
    form.append('language', language);
  }
  
  try {
    const response = await axios.post('http://localhost:5001/transcribe', form, {
      headers: form.getHeaders(),
      timeout: 60000 // 60 seconds timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Transcription error:', error.message);
    throw error;
  }
}
```

## Security Considerations

- File size limited to 25MB
- Only specific audio formats allowed
- Temporary files are automatically cleaned up
- Secure filename handling
- CORS configured for web integration

## Troubleshooting

### Common Issues

1. **Model loading fails**: Ensure you have enough RAM and disk space
2. **Slow processing**: Consider using a smaller model or GPU acceleration
3. **File upload errors**: Check file format and size limits
4. **Memory issues**: Restart the service periodically for long-running instances

### Performance Tips

- Use GPU acceleration if available
- Choose appropriate model size for your needs
- Monitor memory usage for large files
- Consider implementing request queuing for high load
