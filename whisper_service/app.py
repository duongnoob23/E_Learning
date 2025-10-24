"""
Whisper Speech-to-Text Service for E-Learning Speaking Exam
Flask API service that processes audio files using OpenAI Whisper
"""

import os
import time
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import shutil
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'webm', 'ogg'}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB limit

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Whisper model (you can change model size based on your needs)
# Models: tiny, base, small, medium, large
MODEL_SIZE = os.getenv('WHISPER_MODEL', 'base')
logger.info(f"Loading Whisper model: {MODEL_SIZE}")

try:
    model = whisper.load_model(MODEL_SIZE)
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}")
    model = None

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_info(filepath):
    """Get basic file information"""
    try:
        file_size = os.path.getsize(filepath)
        return {
            'size_bytes': file_size,
            'size_mb': round(file_size / (1024 * 1024), 2)
        }
    except Exception as e:
        logger.error(f"Error getting file info: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'whisper-speech-to-text',
        'model': MODEL_SIZE,
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """
    Transcribe audio file using Whisper
    
    Expected form data:
    - audio_file: The audio file to transcribe
    - language: (optional) Language code (e.g., 'en', 'vi')
    - task: (optional) 'transcribe' or 'translate' (default: transcribe)
    """
    
    if model is None:
        return jsonify({
            'success': False,
            'error': 'Whisper model not loaded'
        }), 500
    
    # Check if file is present
    if 'audio_file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No audio file provided'
        }), 400
    
    file = request.files['audio_file']
    
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400
    
    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': f'File type not allowed. Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'
        }), 400
    
    # Get optional parameters
    language = request.form.get('language', None)
    task = request.form.get('task', 'transcribe')
    
    # Create temporary file
    temp_file = None
    try:
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        timestamp = int(time.time())
        temp_filename = f"{timestamp}_{filename}"
        temp_file = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
        
        file.save(temp_file)
        logger.info(f"Saved temporary file: {temp_file}")
        
        # Get file info
        file_info = get_file_info(temp_file)
        
        # Transcribe using Whisper
        start_time = time.time()
        logger.info(f"Starting transcription for file: {filename}")
        
        # Whisper transcription options
        options = {
            'task': task,
            'fp16': False,  # Use fp32 for better compatibility
        }
        
        if language:
            options['language'] = language
        
        result = model.transcribe(temp_file, **options)
        
        processing_time = time.time() - start_time
        logger.info(f"Transcription completed in {processing_time:.2f} seconds")
        
        # Extract relevant information
        transcription_result = {
            'success': True,
            'transcription': result['text'].strip(),
            'language_detected': result.get('language', 'unknown'),
            'segments': [
                {
                    'start': segment['start'],
                    'end': segment['end'],
                    'text': segment['text'].strip()
                }
                for segment in result.get('segments', [])
            ],
            'processing_time_seconds': round(processing_time, 2),
            'file_info': file_info,
            'model_used': MODEL_SIZE,
            'task': task,
            'timestamp': datetime.now().isoformat()
        }
        
        # Calculate confidence score (average of segment probabilities if available)
        if 'segments' in result and result['segments']:
            avg_confidence = sum(
                segment.get('avg_logprob', 0) for segment in result['segments']
            ) / len(result['segments'])
            # Convert log probability to a 0-1 confidence score (approximate)
            confidence_score = max(0, min(1, (avg_confidence + 1) / 2))
            transcription_result['confidence_score'] = round(confidence_score, 3)
        
        return jsonify(transcription_result)
        
    except Exception as e:
        logger.error(f"Error during transcription: {e}")
        return jsonify({
            'success': False,
            'error': f'Transcription failed: {str(e)}'
        }), 500
        
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file):
            try:
                os.remove(temp_file)
                logger.info(f"Cleaned up temporary file: {temp_file}")
            except Exception as e:
                logger.error(f"Failed to clean up temporary file: {e}")

@app.route('/models', methods=['GET'])
def get_available_models():
    """Get list of available Whisper models"""
    models = ['tiny', 'base', 'small', 'medium', 'large']
    return jsonify({
        'available_models': models,
        'current_model': MODEL_SIZE,
        'model_loaded': model is not None
    })

@app.route('/languages', methods=['GET'])
def get_supported_languages():
    """Get list of supported languages"""
    # Common languages for educational purposes
    languages = {
        'en': 'English',
        'vi': 'Vietnamese',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'fr': 'French',
        'de': 'German',
        'es': 'Spanish',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'th': 'Thai'
    }
    
    return jsonify({
        'supported_languages': languages,
        'note': 'Whisper supports 99+ languages. This is a subset of commonly used languages.'
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Whisper service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
