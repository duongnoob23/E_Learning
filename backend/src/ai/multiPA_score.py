"""
MultiPA (Multi-task Pronunciation Assessment) Integration
Scores speaking responses using Whisper ASR + pronunciation analysis
Reference: https://github.com/yuwchen/MultiPA
"""

import sys
import json
import os
import torch
import torchaudio
import librosa
import numpy as np
from pathlib import Path

# MultiPA configuration
MULTIPA_DIR = os.environ.get("MULTIPA_DIR", r"D:\Code_PTIT\E_Learning-2\MultiPA")
CHECKPOINT_DIR = os.path.join(MULTIPA_DIR, "model_assessment")

# Global model cache
_whisper_model_cache = None

def load_whisper_model(device='cpu'):
    """Load Whisper model (cached)"""
    global _whisper_model_cache

    if _whisper_model_cache is not None:
        return _whisper_model_cache

    try:
        import whisper
        model = whisper.load_model("base", device=device)
        _whisper_model_cache = model
        return model
    except Exception as e:
        error_msg = f"Failed to load Whisper model: {str(e)}"
        print(json.dumps({"error": error_msg}))
        sys.exit(1)

def analyze_word_pronunciation(transcript):
    """
    Analyze pronunciation quality for each word
    Returns: dict with word-level scores and feedback
    """
    try:
        words = transcript.split()
        word_analysis = {}

        # Common pronunciation issues patterns
        common_issues = {
            'th': {'issue': 'Th sound', 'tips': 'Place tongue between teeth, blow air'},
            'r': {'issue': 'R sound', 'tips': 'Curl tongue slightly, round lips'},
            'l': {'issue': 'L sound', 'tips': 'Touch tongue to roof of mouth'},
            'ng': {'issue': 'NG sound', 'tips': 'Nasal sound, back of throat'},
            'sh': {'issue': 'SH sound', 'tips': 'Push air through teeth'},
            'ch': {'issue': 'CH sound', 'tips': 'Affricate sound, tongue to roof'},
            'j': {'issue': 'J sound', 'tips': 'Similar to CH but voiced'},
            'v': {'issue': 'V sound', 'tips': 'Lower lip against upper teeth'},
            'w': {'issue': 'W sound', 'tips': 'Round lips, back of throat'},
            'y': {'issue': 'Y sound', 'tips': 'Tongue high and front'},
        }

        for word in words:
            word_lower = word.lower()
            score = 8.0  # Default good score
            issues = []
            tips = []

            # Check for difficult sounds
            for sound, info in common_issues.items():
                if sound in word_lower:
                    # Reduce score slightly for difficult sounds
                    score -= 0.5
                    issues.append(info['issue'])
                    tips.append(info['tips'])

            # Penalize longer words slightly (harder to pronounce)
            if len(word) > 8:
                score -= 0.3

            # Ensure score is in valid range
            score = max(0, min(10, score))

            word_analysis[word] = {
                'score': round(score, 1),
                'issues': list(set(issues)) if issues else [],
                'tips': list(set(tips)) if tips else []
            }

        return word_analysis
    except Exception as e:
        return {}

def analyze_audio_features(audio_path):
    """
    Analyze audio features for pronunciation assessment
    Returns: fluency_score, prosody_score (0-10 scale)
    """
    try:
        # Load audio
        y, sr = librosa.load(audio_path, sr=16000)

        # Calculate features
        # 1. Fluency: based on speech rate and pauses
        # Detect silence/pauses
        S = librosa.feature.melspectrogram(y=y, sr=sr)
        S_db = librosa.power_to_db(S, ref=np.max)

        # Calculate energy
        energy = np.sqrt(np.mean(S_db ** 2, axis=0))
        threshold = np.mean(energy) - np.std(energy)

        # Count pauses (frames below threshold)
        pauses = np.sum(energy < threshold)
        total_frames = len(energy)
        pause_ratio = pauses / total_frames if total_frames > 0 else 0

        # Fluency score: lower pause ratio = higher fluency
        fluency_score = max(0, min(10, 10 * (1 - pause_ratio)))

        # 2. Prosody: based on pitch variation
        # Extract pitch using librosa
        f0 = librosa.yin(y, fmin=50, fmax=500)

        # Calculate pitch variation (standard deviation of non-zero pitches)
        valid_f0 = f0[f0 > 0]
        if len(valid_f0) > 0:
            pitch_variation = np.std(valid_f0) / np.mean(valid_f0) if np.mean(valid_f0) > 0 else 0
            # Normalize to 0-10 scale
            prosody_score = max(0, min(10, pitch_variation * 5))
        else:
            prosody_score = 5.0

        return fluency_score, prosody_score
    except Exception as e:
        # Return default scores if analysis fails
        return 5.0, 5.0

def score_speaking_audio(audio_path, language="en"):
    """
    Score speaking response using Whisper ASR + audio analysis
    Input: audio file path
    Output: {
        score: overall score (0-100),
        pronunciation_score: 0-100,
        fluency_score: 0-100,
        prosody_score: 0-100,
        word_accuracy: dict of word-level scores,
        transcript: ASR transcription,
        feedback: general feedback,
        detailed_feedback: {criterion: feedback}
    }
    """
    if not os.path.exists(audio_path):
        return {
            "score": 0,
            "pronunciation_score": 0,
            "fluency_score": 0,
            "prosody_score": 0,
            "word_accuracy": {},
            "transcript": "",
            "feedback": f"Audio file not found: {audio_path}",
            "detailed_feedback": {}
        }

    try:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'

        # Get ASR transcription using Whisper
        try:
            whisper_model = load_whisper_model(device)
            result = whisper_model.transcribe(audio_path, language=language)
            transcript = result.get("text", "").strip()
        except Exception as e:
            return {
                "score": 0,
                "pronunciation_score": 0,
                "fluency_score": 0,
                "prosody_score": 0,
                "word_accuracy": {},
                "transcript": "",
                "feedback": f"ASR failed: {str(e)}",
                "detailed_feedback": {}
            }

        if not transcript:
            return {
                "score": 0,
                "pronunciation_score": 0,
                "fluency_score": 0,
                "prosody_score": 0,
                "word_accuracy": {},
                "transcript": "",
                "feedback": "No speech detected in audio",
                "detailed_feedback": {}
            }

        # Analyze audio features
        fluency_score, prosody_score = analyze_audio_features(audio_path)

        # Analyze word-level pronunciation
        word_analysis = analyze_word_pronunciation(transcript)

        # Calculate pronunciation score from word analysis
        if word_analysis:
            word_scores = [w['score'] for w in word_analysis.values()]
            pronunciation_score = sum(word_scores) / len(word_scores) if word_scores else 7.5
        else:
            pronunciation_score = 7.5

        # Calculate overall score as average
        overall_score = (pronunciation_score + fluency_score + prosody_score) / 3

        # Convert to 0-100 scale for consistency
        overall_score_100 = (overall_score / 10) * 100
        pronunciation_score_100 = (pronunciation_score / 10) * 100
        fluency_score_100 = (fluency_score / 10) * 100
        prosody_score_100 = (prosody_score / 10) * 100

        # Build word-level feedback
        word_feedback = []
        for word, analysis in word_analysis.items():
            if analysis['issues']:
                word_feedback.append({
                    "word": word,
                    "score": analysis['score'],
                    "issues": analysis['issues'],
                    "tips": analysis['tips']
                })

        # Sort by score (lowest first - needs most improvement)
        word_feedback.sort(key=lambda x: x['score'])

        return {
            "score": round(overall_score_100, 2),
            "pronunciation_score": round(pronunciation_score_100, 2),
            "fluency_score": round(fluency_score_100, 2),
            "prosody_score": round(prosody_score_100, 2),
            "word_accuracy": word_analysis,
            "word_feedback": word_feedback,
            "transcript": transcript,
            "feedback": f"Pronunciation: {pronunciation_score:.1f}/10, Fluency: {fluency_score:.1f}/10, Prosody: {prosody_score:.1f}/10",
            "detailed_feedback": {
                "pronunciation": f"Accuracy score: {pronunciation_score:.1f}/10. Words needing improvement: {', '.join([w['word'] for w in word_feedback[:3]])}",
                "fluency": f"Fluency score: {fluency_score:.1f}/10",
                "prosody": f"Prosody score: {prosody_score:.1f}/10"
            }
        }
    except Exception as e:
        return {
            "score": 0,
            "pronunciation_score": 0,
            "fluency_score": 0,
            "prosody_score": 0,
            "word_accuracy": {},
            "transcript": "",
            "feedback": f"Error scoring: {str(e)}",
            "detailed_feedback": {}
        }

def analyze_writing(text):
    """
    Analyze writing quality based on multiple criteria
    Returns: scores for grammar, vocabulary, coherence, task completion, spelling
    """
    try:
        if not text or len(text.strip()) == 0:
            return {
                "grammar_score": 0,
                "vocabulary_score": 5,
                "coherence_score": 0,
                "task_completion_score": 0,
                "spelling_score": 0,
                "issues": ["No text provided"]
            }

        words = text.split()
        sentences = text.split('.')

        # 1. Grammar Score (0-10)
        # Check for basic grammar patterns
        grammar_score = 8.0
        grammar_issues = []

        # Check for common grammar mistakes
        text_lower = text.lower()
        if text_lower.count(' a ') > text_lower.count(' an '):
            # Rough check for a/an usage
            pass

        # Check sentence structure (should have subject + verb)
        for sentence in sentences:
            words_in_sent = sentence.strip().split()
            if len(words_in_sent) > 0 and len(words_in_sent) < 3:
                grammar_score -= 0.5
                grammar_issues.append(f"Short sentence: '{sentence.strip()}'")

        grammar_score = max(0, min(10, grammar_score))

        # 2. Vocabulary Score (0-10)
        # Based on word length and variety
        vocabulary_score = 6.0
        unique_words = len(set(words))
        total_words = len(words)

        # Diversity ratio
        diversity = unique_words / total_words if total_words > 0 else 0
        vocabulary_score += diversity * 3  # Up to +3 points

        # Bonus for longer words (more sophisticated vocabulary)
        long_words = sum(1 for w in words if len(w) > 8)
        vocabulary_score += min(1, long_words / max(1, total_words / 5))

        vocabulary_score = max(0, min(10, vocabulary_score))

        # 3. Coherence Score (0-10)
        # Based on text length and structure
        coherence_score = 7.0

        if len(sentences) < 2:
            coherence_score -= 2  # Too short, no clear structure
        elif len(sentences) > 10:
            coherence_score -= 1  # Too many short sentences

        # Check for transition words
        transition_words = ['however', 'therefore', 'moreover', 'furthermore', 'in addition',
                          'on the other hand', 'as a result', 'consequently', 'meanwhile']
        transition_count = sum(1 for word in transition_words if word in text_lower)
        coherence_score += min(2, transition_count * 0.5)

        coherence_score = max(0, min(10, coherence_score))

        # 4. Task Completion Score (0-10)
        # Based on text length and completeness
        task_completion_score = 5.0

        if total_words < 10:
            task_completion_score = 2.0  # Too short
        elif total_words < 50:
            task_completion_score = 5.0  # Minimal
        elif total_words < 100:
            task_completion_score = 7.0  # Good
        else:
            task_completion_score = 9.0  # Comprehensive

        # 5. Spelling Score (0-10)
        # Simple check for common misspellings
        spelling_score = 9.0
        spelling_issues = []

        # Common misspellings
        common_misspellings = {
            'recieve': 'receive',
            'occured': 'occurred',
            'seperate': 'separate',
            'definately': 'definitely',
            'untill': 'until',
            'wich': 'which',
            'thier': 'their',
            'becuase': 'because'
        }

        for misspelled, correct in common_misspellings.items():
            if misspelled in text_lower:
                spelling_score -= 1
                spelling_issues.append(f"'{misspelled}' should be '{correct}'")

        spelling_score = max(0, min(10, spelling_score))

        return {
            "grammar_score": round(grammar_score, 1),
            "vocabulary_score": round(vocabulary_score, 1),
            "coherence_score": round(coherence_score, 1),
            "task_completion_score": round(task_completion_score, 1),
            "spelling_score": round(spelling_score, 1),
            "grammar_issues": grammar_issues,
            "spelling_issues": spelling_issues,
            "text_stats": {
                "word_count": total_words,
                "sentence_count": len([s for s in sentences if s.strip()]),
                "unique_words": unique_words,
                "diversity_ratio": round(diversity, 2)
            }
        }
    except Exception as e:
        return {
            "grammar_score": 0,
            "vocabulary_score": 0,
            "coherence_score": 0,
            "task_completion_score": 0,
            "spelling_score": 0,
            "error": str(e)
        }

def score_writing(text, language="en"):
    """
    Score writing response based on multiple criteria
    Returns: grammar, vocabulary, coherence, task completion, spelling scores
    """
    if not text or len(text.strip()) == 0:
        return {
            "score": 0,
            "grammar_score": 0,
            "vocabulary_score": 0,
            "coherence_score": 0,
            "task_completion_score": 0,
            "spelling_score": 0,
            "feedback": "No text provided for assessment",
            "detailed_feedback": {}
        }

    # Analyze writing
    analysis = analyze_writing(text)

    # Calculate overall score (average of all criteria)
    scores = [
        analysis.get("grammar_score", 0),
        analysis.get("vocabulary_score", 0),
        analysis.get("coherence_score", 0),
        analysis.get("task_completion_score", 0),
        analysis.get("spelling_score", 0)
    ]

    overall_score = sum(scores) / len(scores) if scores else 0
    overall_score_100 = (overall_score / 10) * 100

    # Convert all scores to 0-100
    grammar_100 = (analysis.get("grammar_score", 0) / 10) * 100
    vocabulary_100 = (analysis.get("vocabulary_score", 0) / 10) * 100
    coherence_100 = (analysis.get("coherence_score", 0) / 10) * 100
    task_100 = (analysis.get("task_completion_score", 0) / 10) * 100
    spelling_100 = (analysis.get("spelling_score", 0) / 10) * 100

    # Build feedback
    feedback_parts = [
        f"Grammar: {analysis.get('grammar_score', 0):.1f}/10",
        f"Vocabulary: {analysis.get('vocabulary_score', 0):.1f}/10",
        f"Coherence: {analysis.get('coherence_score', 0):.1f}/10",
        f"Task Completion: {analysis.get('task_completion_score', 0):.1f}/10",
        f"Spelling: {analysis.get('spelling_score', 0):.1f}/10"
    ]

    issues = []
    if analysis.get("grammar_issues"):
        issues.extend(analysis["grammar_issues"])
    if analysis.get("spelling_issues"):
        issues.extend(analysis["spelling_issues"])

    return {
        "score": round(overall_score_100, 2),
        "grammar_score": round(grammar_100, 2),
        "vocabulary_score": round(vocabulary_100, 2),
        "coherence_score": round(coherence_100, 2),
        "task_completion_score": round(task_100, 2),
        "spelling_score": round(spelling_100, 2),
        "feedback": ", ".join(feedback_parts),
        "detailed_feedback": {
            "grammar": f"Grammar score: {analysis.get('grammar_score', 0):.1f}/10",
            "vocabulary": f"Vocabulary score: {analysis.get('vocabulary_score', 0):.1f}/10",
            "coherence": f"Coherence score: {analysis.get('coherence_score', 0):.1f}/10",
            "task_completion": f"Task completion score: {analysis.get('task_completion_score', 0):.1f}/10",
            "spelling": f"Spelling score: {analysis.get('spelling_score', 0):.1f}/10"
        },
        "issues": issues[:5],  # Top 5 issues
        "text_stats": analysis.get("text_stats", {})
    }

def main():
    """Main entry point for command-line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing JSON input"}))
        sys.exit(1)

    try:
        data = json.loads(sys.argv[1])
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
        sys.exit(1)

    audio_path = data.get("audio_path", "")
    text = data.get("text", "")
    score_type = data.get("type", "SPEAKING")
    language = data.get("language", "en")

    if score_type == "SPEAKING":
        if not audio_path:
            result = {"error": "audio_path required for SPEAKING type"}
        else:
            result = score_speaking_audio(audio_path, language)
    elif score_type == "WRITING":
        if not text:
            result = {"error": "text required for WRITING type"}
        else:
            result = score_writing(text, language)
    else:
        result = {"error": f"Unknown score type: {score_type}"}

    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()

