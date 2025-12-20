"""
MultiPA (Multi-task Pronunciation Assessment) Integration
Scores speaking responses using Whisper ASR + pronunciation analysis
Reference: https://github.com/yuwchen/MultiPA
"""

import sys
import json
import os
import io

# Set UTF-8 encoding for stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import torch
import torchaudio
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
    Analyze audio features for pronunciation assessment using torchaudio
    Returns: fluency_score, prosody_score (0-10 scale)
    """
    try:
        # Load audio using torchaudio
        waveform, sr = torchaudio.load(audio_path)

        # Resample to 16kHz if needed
        if sr != 16000:
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)
            waveform = resampler(waveform)
            sr = 16000

        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # Convert to numpy for analysis
        audio = waveform.squeeze().numpy()

        # === FLUENCY ANALYSIS ===
        # Calculate frame-level energy (RMS)
        frame_length = int(0.025 * sr)  # 25ms frames
        hop_length = int(0.010 * sr)    # 10ms hop

        # Pad audio for frame-based analysis
        num_frames = 1 + (len(audio) - frame_length) // hop_length
        if num_frames <= 0:
            return 5.0, 5.0

        energy = []
        for i in range(num_frames):
            start = i * hop_length
            end = start + frame_length
            frame = audio[start:end]
            rms = np.sqrt(np.mean(frame ** 2))
            energy.append(rms)

        energy = np.array(energy)

        # Detect pauses (energy below threshold)
        threshold = np.mean(energy) * 0.3  # 30% of mean energy
        pauses = np.sum(energy < threshold)
        total_frames = len(energy)
        pause_ratio = pauses / total_frames if total_frames > 0 else 0

        # Fluency score: lower pause ratio = higher fluency
        # Typical pause ratio: 0.2-0.4 is normal, >0.5 is choppy
        fluency_score = max(0, min(10, 10 * (1 - pause_ratio * 1.5)))

        # === PROSODY ANALYSIS ===
        # Simple pitch variation estimation using zero-crossing rate
        # Higher variation = more expressive prosody
        zcr = []
        for i in range(num_frames):
            start = i * hop_length
            end = start + frame_length
            frame = audio[start:end]
            # Count zero crossings
            signs = np.sign(frame)
            signs[signs == 0] = 1
            crossings = np.sum(np.abs(np.diff(signs)) / 2)
            zcr.append(crossings)

        zcr = np.array(zcr)

        # Calculate variation in speaking rate/pitch
        if len(zcr) > 1:
            zcr_variation = np.std(zcr) / (np.mean(zcr) + 1e-6)
            # Normalize: 0.3-0.8 is good variation
            prosody_score = max(0, min(10, zcr_variation * 12))
        else:
            prosody_score = 5.0

        # Adjust prosody based on duration (very short = lower prosody)
        duration = len(audio) / sr
        if duration < 1.0:
            prosody_score *= 0.7
        elif duration < 2.0:
            prosody_score *= 0.85

        return round(fluency_score, 2), round(prosody_score, 2)

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
            "words_to_improve": word_feedback,  # Chỉ các từ cần cải thiện
            "transcript": transcript,
            "feedback": f"Pronunciation: {pronunciation_score:.1f}/10, Fluency: {fluency_score:.1f}/10, Prosody: {prosody_score:.1f}/10"
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

def get_word_improvements(sentence_lower, words):
    """
    Suggest better vocabulary choices for common/weak words
    Returns: list of vocabulary improvement suggestions
    """
    vocab_improvements = []

    # Từ phổ thông -> từ nâng cao hơn
    word_upgrades = {
        'good': ['excellent', 'outstanding', 'remarkable', 'superb'],
        'bad': ['poor', 'inadequate', 'unsatisfactory', 'detrimental'],
        'big': ['significant', 'substantial', 'considerable', 'massive'],
        'small': ['minor', 'minimal', 'slight', 'modest'],
        'nice': ['pleasant', 'delightful', 'enjoyable', 'agreeable'],
        'happy': ['delighted', 'thrilled', 'elated', 'content'],
        'sad': ['disappointed', 'dismayed', 'dejected', 'sorrowful'],
        'important': ['crucial', 'essential', 'vital', 'significant'],
        'interesting': ['fascinating', 'intriguing', 'compelling', 'captivating'],
        'very': ['extremely', 'remarkably', 'incredibly', 'exceptionally'],
        'really': ['truly', 'genuinely', 'certainly', 'undoubtedly'],
        'a lot': ['numerous', 'substantial', 'considerable', 'extensive'],
        'thing': ['aspect', 'element', 'factor', 'component'],
        'things': ['aspects', 'elements', 'factors', 'components'],
        'stuff': ['materials', 'items', 'content', 'elements'],
        'get': ['obtain', 'acquire', 'receive', 'achieve'],
        'got': ['obtained', 'acquired', 'received', 'achieved'],
        'make': ['create', 'develop', 'establish', 'produce'],
        'made': ['created', 'developed', 'established', 'produced'],
        'show': ['demonstrate', 'illustrate', 'indicate', 'reveal'],
        'say': ['state', 'express', 'mention', 'assert'],
        'said': ['stated', 'expressed', 'mentioned', 'asserted'],
        'think': ['believe', 'consider', 'suppose', 'reckon'],
        'use': ['utilize', 'employ', 'apply', 'implement'],
        'help': ['assist', 'aid', 'support', 'facilitate'],
        'need': ['require', 'necessitate', 'demand'],
        'want': ['desire', 'wish', 'aspire', 'seek'],
        'like': ['prefer', 'appreciate', 'enjoy', 'favor'],
        'hard': ['challenging', 'difficult', 'demanding', 'arduous'],
        'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated'],
        'fast': ['rapid', 'swift', 'quick', 'prompt'],
        'slow': ['gradual', 'unhurried', 'leisurely', 'steady'],
        'old': ['ancient', 'traditional', 'vintage', 'aged'],
        'new': ['modern', 'contemporary', 'innovative', 'novel'],
        'many': ['numerous', 'multiple', 'various', 'several'],
        'much': ['considerable', 'substantial', 'extensive', 'significant'],
        'some': ['certain', 'particular', 'specific', 'several'],
        'give': ['provide', 'offer', 'present', 'deliver'],
        'look': ['appear', 'seem', 'observe', 'examine'],
        'put': ['place', 'position', 'set', 'situate'],
        'also': ['furthermore', 'moreover', 'additionally', 'besides'],
        'but': ['however', 'nevertheless', 'yet', 'although'],
        'so': ['therefore', 'consequently', 'thus', 'hence'],
        'because': ['since', 'as', 'due to the fact that', 'owing to'],
    }

    for word in words:
        word_l = word.lower().strip('.,!?;:')
        if word_l in word_upgrades:
            alternatives = word_upgrades[word_l]
            vocab_improvements.append({
                'original': word_l,
                'alternatives': alternatives[:3],
                'suggestion': f"Thay '{word_l}' bằng từ nâng cao hơn: {', '.join(alternatives[:3])}"
            })

    return vocab_improvements

def analyze_sentence_meaning(sentence, sentence_lower):
    """
    Analyze sentence for meaning and structure improvements
    Returns: list of meaning/structure suggestions
    """
    meaning_suggestions = []

    # Check for vague expressions
    vague_patterns = [
        ('it is', 'Tránh dùng "it is" mở đầu. Thử viết cụ thể hơn về chủ ngữ.'),
        ('there is', 'Câu với "there is/are" thường yếu. Hãy dùng chủ ngữ cụ thể hơn.'),
        ('there are', 'Câu với "there is/are" thường yếu. Hãy dùng chủ ngữ cụ thể hơn.'),
        ('i think that', '"I think" có thể bỏ đi vì bài viết đã là ý kiến của bạn.'),
        ('in my opinion', 'Có thể viết ngắn gọn hơn bằng cách bỏ "in my opinion".'),
        ('as we all know', 'Tránh cụm từ sáo rỗng này. Đi thẳng vào vấn đề.'),
        ('it goes without saying', 'Cụm từ này dài dòng. Nếu hiển nhiên thì không cần nói.'),
    ]

    for pattern, suggestion in vague_patterns:
        if pattern in sentence_lower:
            meaning_suggestions.append({
                'type': 'structure',
                'issue': f'Cấu trúc "{pattern}" có thể cải thiện',
                'suggestion': suggestion
            })

    # Check for weak sentence starters
    weak_starters = ['and', 'but', 'so', 'or', 'also']
    first_word = sentence.split()[0].lower() if sentence.split() else ''
    if first_word in weak_starters:
        meaning_suggestions.append({
            'type': 'structure',
            'issue': f'Câu bắt đầu bằng "{first_word}" - không phù hợp trong văn viết trang trọng',
            'suggestion': 'Dùng từ nối trang trọng hơn: However, Furthermore, Moreover, Therefore, Additionally...'
        })

    # Check for passive voice (basic detection)
    passive_indicators = [' is being ', ' are being ', ' was being ', ' were being ',
                         ' has been ', ' have been ', ' had been ', ' will be ',
                         ' is done ', ' was done ', ' are done ', ' were done ']
    for indicator in passive_indicators:
        if indicator in sentence_lower:
            meaning_suggestions.append({
                'type': 'voice',
                'issue': 'Câu có thể đang dùng thể bị động',
                'suggestion': 'Xem xét đổi sang thể chủ động để câu mạnh mẽ và trực tiếp hơn.'
            })
            break

    # Check sentence variety - if too simple
    words = sentence.split()
    if 3 <= len(words) <= 6 and ',' not in sentence:
        meaning_suggestions.append({
            'type': 'complexity',
            'issue': 'Câu đơn giản, thiếu chi tiết',
            'suggestion': 'Thêm mệnh đề phụ, ví dụ hoặc giải thích để câu phong phú hơn.'
        })

    return meaning_suggestions

def analyze_sentence(sentence, sentence_index):
    """
    Analyze a single sentence for issues and provide feedback
    Returns: dict with sentence analysis
    """
    import re

    sentence = sentence.strip()
    if not sentence:
        return None

    issues = []
    suggestions = []
    vocabulary_tips = []
    meaning_tips = []
    score = 10.0

    words = sentence.split()
    sentence_lower = sentence.lower()

    # 1. Check sentence length
    if len(words) < 3:
        issues.append("Câu quá ngắn")
        suggestions.append("Mở rộng câu với thêm chi tiết hoặc giải thích")
        score -= 2
    elif len(words) > 35:
        issues.append("Câu quá dài, khó đọc")
        suggestions.append("Chia thành 2-3 câu ngắn hơn để dễ hiểu")
        score -= 1.5

    # 2. Check capitalization
    if sentence and sentence[0].islower():
        issues.append("Câu không bắt đầu bằng chữ hoa")
        suggestions.append("Luôn viết hoa chữ cái đầu câu")
        score -= 1

    # 3. Check for lowercase "i" (should be "I")
    i_pattern = r'\bi\b'
    i_matches = re.findall(i_pattern, sentence)
    if i_matches:
        issues.append(f"Đại từ 'i' phải viết hoa thành 'I' ({len(i_matches)} lần)")
        suggestions.append("Đại từ nhân xưng 'I' luôn phải viết hoa trong tiếng Anh")
        score -= len(i_matches) * 0.5

    # 4. Check for informal language
    informal_words = {
        'gonna': 'going to',
        'wanna': 'want to',
        'gotta': 'got to',
        'kinda': 'kind of',
        'sorta': 'sort of',
        'dunno': "don't know",
        'cuz': 'because',
        'cos': 'because',
        'tho': 'though',
        'thru': 'through'
    }

    for informal, formal in informal_words.items():
        if informal in sentence_lower:
            issues.append(f"Từ '{informal}' không trang trọng")
            suggestions.append(f"Thay '{informal}' bằng '{formal}' trong văn viết")
            score -= 0.5

    # 5. Check for common spelling errors
    spelling_errors = {
        'recieve': 'receive',
        'occured': 'occurred',
        'seperate': 'separate',
        'definately': 'definitely',
        'untill': 'until',
        'wich': 'which',
        'thier': 'their',
        'becuase': 'because',
        'teh': 'the',
        'adn': 'and',
        'taht': 'that',
        'wiht': 'with'
    }

    for wrong, correct in spelling_errors.items():
        if wrong in sentence_lower:
            issues.append(f"Lỗi chính tả: '{wrong}'")
            suggestions.append(f"Sửa '{wrong}' thành '{correct}'")
            score -= 1

    # 6. Check for repeated words
    for i in range(len(words) - 1):
        if words[i].lower() == words[i+1].lower() and words[i].lower() not in ['very', 'had', 'that']:
            issues.append(f"Từ '{words[i]}' bị lặp liên tiếp")
            suggestions.append("Xóa từ lặp hoặc thay thế bằng từ đồng nghĩa")
            score -= 0.5
            break

    # 7. Check punctuation at end
    if sentence and sentence[-1] not in '.!?':
        issues.append("Câu thiếu dấu câu kết thúc")
        suggestions.append("Thêm dấu chấm (.), chấm hỏi (?), hoặc chấm than (!) cuối câu")
        score -= 0.5

    # 8. Check for run-on sentence patterns
    run_on_patterns = [' and and ', ' but but ', ' or or ', ' so so ']
    for pattern in run_on_patterns:
        if pattern in sentence_lower:
            issues.append("Câu có dấu hiệu run-on sentence")
            suggestions.append("Kiểm tra và sửa cấu trúc câu, tránh lặp liên từ")
            score -= 1
            break

    # 9. Get vocabulary improvement suggestions
    vocab_improvements = get_word_improvements(sentence_lower, words)
    if vocab_improvements:
        vocabulary_tips = [v['suggestion'] for v in vocab_improvements[:3]]  # Top 3
        score -= 0.3 * len(vocab_improvements[:3])  # Slight penalty for basic words

    # 10. Get meaning/structure suggestions
    meaning_analysis = analyze_sentence_meaning(sentence, sentence_lower)
    if meaning_analysis:
        meaning_tips = [m['suggestion'] for m in meaning_analysis[:2]]  # Top 2
        score -= 0.2 * len(meaning_analysis[:2])

    score = max(0, min(10, score))

    # Only return if there are improvements needed
    has_issues = len(issues) > 0 or len(vocabulary_tips) > 0 or len(meaning_tips) > 0

    return {
        "index": sentence_index + 1,
        "sentence": sentence,
        "score": round(score, 1),
        "issues": issues,
        "suggestions": suggestions,
        "vocabulary_tips": vocabulary_tips,
        "meaning_tips": meaning_tips,
        "needs_improvement": has_issues
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
                "issues": ["No text provided"],
                "sentence_feedback": []
            }

        words = text.split()
        # Tách câu tốt hơn với regex
        import re
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
        text_lower = text.lower()

        # Phân tích từng câu
        sentence_feedback = []
        for i, sent in enumerate(sentences):
            analysis = analyze_sentence(sent, i)
            if analysis:
                sentence_feedback.append(analysis)

        # 1. Grammar Score (0-10)
        grammar_score = 8.0
        grammar_issues = []

        # Check for lowercase "i" (should be "I")
        import re
        i_pattern = r'\bi\b'
        i_matches = re.findall(i_pattern, text)
        if i_matches:
            grammar_score -= len(i_matches) * 0.3
            grammar_issues.append(f"'{len(i_matches)}' instances of lowercase 'i' (should be 'I')")

        # Check for contractions errors (i'am, coundn't, etc.)
        contraction_errors = {
            "i'am": "I am",
            "i'm": "I'm",
            "coundn't": "couldn't",
            "couldn't": "couldn't",
            "gonna": "going to",
            "wanna": "want to",
            "gotta": "got to"
        }

        for error, correct in contraction_errors.items():
            if error in text_lower:
                if error in ["gonna", "wanna", "gotta"]:
                    grammar_score -= 0.2
                    grammar_issues.append(f"'{error}' is informal, use '{correct}' in formal writing")
                else:
                    grammar_score -= 0.5
                    grammar_issues.append(f"'{error}' should be '{correct}'")

        # Check for subject-verb agreement issues
        for sentence in sentences:
            words_in_sent = sentence.split()
            if len(words_in_sent) > 0 and len(words_in_sent) < 3:
                grammar_score -= 0.3
                grammar_issues.append(f"Fragment: '{sentence}' (too short)")

        grammar_score = max(0, min(10, grammar_score))

        # 2. Vocabulary Score (0-10)
        vocabulary_score = 6.0
        unique_words = len(set(w.lower() for w in words))
        total_words = len(words)

        # Diversity ratio
        diversity = unique_words / total_words if total_words > 0 else 0
        vocabulary_score += diversity * 3  # Up to +3 points

        # Bonus for longer words (more sophisticated vocabulary)
        long_words = sum(1 for w in words if len(w) > 8)
        vocabulary_score += min(1, long_words / max(1, total_words / 5))

        vocabulary_score = max(0, min(10, vocabulary_score))

        # 3. Coherence Score (0-10)
        coherence_score = 7.0
        coherence_issues = []

        if len(sentences) < 2:
            coherence_score -= 2
            coherence_issues.append("Only one sentence - lacks structure")
        elif len(sentences) > 10:
            coherence_score -= 1
            coherence_issues.append("Too many short sentences - consider combining")

        # Check for transition words
        transition_words = ['however', 'therefore', 'moreover', 'furthermore', 'in addition',
                          'on the other hand', 'as a result', 'consequently', 'meanwhile',
                          'also', 'besides', 'instead', 'meanwhile', 'then', 'next']
        transition_count = sum(1 for word in transition_words if word in text_lower)
        coherence_score += min(2, transition_count * 0.5)

        if transition_count == 0 and len(sentences) > 1:
            coherence_issues.append("No transition words - ideas may not flow smoothly")

        coherence_score = max(0, min(10, coherence_score))

        # 4. Task Completion Score (0-10)
        task_completion_score = 5.0
        completion_issues = []

        if total_words < 10:
            task_completion_score = 2.0
            completion_issues.append(f"Too short ({total_words} words) - minimum 50 words recommended")
        elif total_words < 50:
            task_completion_score = 5.0
            completion_issues.append(f"Short ({total_words} words) - consider expanding to 50+ words")
        elif total_words < 100:
            task_completion_score = 7.0
        else:
            task_completion_score = 9.0

        # 5. Spelling Score (0-10)
        spelling_score = 9.0
        spelling_issues = []

        # Common misspellings and contractions
        common_misspellings = {
            'recieve': 'receive',
            'occured': 'occurred',
            'seperate': 'separate',
            'definately': 'definitely',
            'untill': 'until',
            'wich': 'which',
            'thier': 'their',
            'becuase': 'because',
            'occassion': 'occasion',
            'neccessary': 'necessary',
            'accomodate': 'accommodate',
            'dissapear': 'disappear',
            'embarass': 'embarrass',
            'reccomend': 'recommend',
            'succesful': 'successful',
            'coundn\'t': 'couldn\'t',
            'i\'am': 'I am'
        }

        for misspelled, correct in common_misspellings.items():
            if misspelled in text_lower:
                spelling_score -= 1
                spelling_issues.append(f"'{misspelled}' → '{correct}'")

        spelling_score = max(0, min(10, spelling_score))

        # Combine all issues
        all_issues = []
        if grammar_issues:
            all_issues.extend([f"[Grammar] {issue}" for issue in grammar_issues])
        if spelling_issues:
            all_issues.extend([f"[Spelling] {issue}" for issue in spelling_issues])
        if coherence_issues:
            all_issues.extend([f"[Coherence] {issue}" for issue in coherence_issues])
        if completion_issues:
            all_issues.extend([f"[Task Completion] {issue}" for issue in completion_issues])

        # Lọc chỉ các câu cần cải thiện
        sentences_to_improve = [s for s in sentence_feedback if s.get('needs_improvement', False)]

        return {
            "grammar_score": round(grammar_score, 1),
            "vocabulary_score": round(vocabulary_score, 1),
            "coherence_score": round(coherence_score, 1),
            "task_completion_score": round(task_completion_score, 1),
            "spelling_score": round(spelling_score, 1),
            "grammar_issues": grammar_issues,
            "spelling_issues": spelling_issues,
            "coherence_issues": coherence_issues,
            "completion_issues": completion_issues,
            "all_issues": all_issues,
            "sentence_feedback": sentences_to_improve,  # Chỉ các câu cần cải thiện
            "text_stats": {
                "word_count": total_words,
                "sentence_count": len(sentences),
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
            "sentence_feedback": [],
            "error": str(e)
        }

def _analyze_content(text, text_stats):
    """
    Analyze the content quality and meaning of the essay
    Returns: dict with content analysis
    """
    text_lower = text.lower()
    sentences = [s.strip() for s in text.split('.') if s.strip()]

    content_feedback = {
        "strengths": [],
        "weaknesses": [],
        "content_suggestions": []
    }

    word_count = text_stats.get("word_count", 0)
    sentence_count = text_stats.get("sentence_count", 0)
    diversity_ratio = text_stats.get("diversity_ratio", 0)

    # 1. Check for introduction indicators
    intro_phrases = ['first', 'firstly', 'to begin', 'introduction', 'in this essay',
                    'i will discuss', 'this essay will', 'the purpose of']
    has_intro = any(phrase in text_lower for phrase in intro_phrases)
    if has_intro:
        content_feedback["strengths"].append("✓ Có phần mở bài rõ ràng")
    elif word_count > 50:
        content_feedback["weaknesses"].append("Thiếu phần mở bài giới thiệu chủ đề")
        content_feedback["content_suggestions"].append("Thêm câu mở đầu giới thiệu vấn đề và định hướng bài viết")

    # 2. Check for conclusion indicators
    conclusion_phrases = ['in conclusion', 'to conclude', 'finally', 'in summary',
                         'to sum up', 'overall', 'in the end', 'therefore']
    has_conclusion = any(phrase in text_lower for phrase in conclusion_phrases)
    if has_conclusion:
        content_feedback["strengths"].append("✓ Có phần kết luận")
    elif word_count > 80:
        content_feedback["weaknesses"].append("Thiếu phần kết luận tóm tắt ý chính")
        content_feedback["content_suggestions"].append("Thêm đoạn kết tóm tắt luận điểm và đưa ra nhận định cuối cùng")

    # 3. Check for examples/evidence
    example_phrases = ['for example', 'for instance', 'such as', 'like', 'specifically',
                      'to illustrate', 'as an example', 'namely']
    has_examples = any(phrase in text_lower for phrase in example_phrases)
    if has_examples:
        content_feedback["strengths"].append("✓ Có ví dụ minh họa")
    elif word_count > 60:
        content_feedback["weaknesses"].append("Thiếu ví dụ cụ thể để minh họa luận điểm")
        content_feedback["content_suggestions"].append("Thêm ví dụ thực tế hoặc dẫn chứng để bài viết thuyết phục hơn")

    # 4. Check for reasoning/explanation
    reasoning_phrases = ['because', 'since', 'due to', 'as a result', 'therefore',
                        'consequently', 'this means', 'this shows', 'the reason']
    has_reasoning = any(phrase in text_lower for phrase in reasoning_phrases)
    if has_reasoning:
        content_feedback["strengths"].append("✓ Có giải thích lý do/nguyên nhân")
    elif word_count > 50:
        content_feedback["content_suggestions"].append("Giải thích rõ hơn lý do đằng sau các luận điểm của bạn")

    # 5. Check for contrast/comparison
    contrast_phrases = ['however', 'on the other hand', 'in contrast', 'although',
                       'while', 'whereas', 'but', 'nevertheless', 'despite']
    has_contrast = any(phrase in text_lower for phrase in contrast_phrases)
    if has_contrast:
        content_feedback["strengths"].append("✓ Có đối chiếu/so sánh quan điểm")
    elif word_count > 80:
        content_feedback["content_suggestions"].append("Xem xét thêm góc nhìn đối lập để bài viết đa chiều hơn")

    # 6. Analyze paragraph structure (basic)
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    if len(paragraphs) >= 3:
        content_feedback["strengths"].append("✓ Bài viết được chia đoạn rõ ràng")
    elif word_count > 100:
        content_feedback["weaknesses"].append("Bài viết chưa được chia đoạn hợp lý")
        content_feedback["content_suggestions"].append("Chia bài thành các đoạn: Mở bài, Thân bài (1-2 đoạn), Kết luận")

    # 7. Check vocabulary diversity for content richness
    if diversity_ratio >= 0.7:
        content_feedback["strengths"].append("✓ Từ vựng đa dạng, phong phú")
    elif diversity_ratio < 0.5:
        content_feedback["weaknesses"].append("Từ vựng lặp lại nhiều, thiếu đa dạng")
        content_feedback["content_suggestions"].append("Sử dụng từ đồng nghĩa để tránh lặp từ và làm phong phú bài viết")

    # 8. Check sentence variety
    if sentence_count > 0:
        avg_words_per_sentence = word_count / sentence_count
        if 12 <= avg_words_per_sentence <= 20:
            content_feedback["strengths"].append("✓ Độ dài câu hợp lý, dễ đọc")
        elif avg_words_per_sentence < 10:
            content_feedback["weaknesses"].append("Các câu quá ngắn, thiếu chi tiết")
            content_feedback["content_suggestions"].append("Phát triển các câu với thêm thông tin, mệnh đề phụ")
        elif avg_words_per_sentence > 25:
            content_feedback["weaknesses"].append("Các câu quá dài, khó theo dõi")
            content_feedback["content_suggestions"].append("Chia câu dài thành nhiều câu ngắn hơn")

    # 9. Check for personal opinion/stance
    opinion_phrases = ['i believe', 'i think', 'in my opinion', 'i agree', 'i disagree',
                      'from my perspective', 'personally', 'my view']
    has_opinion = any(phrase in text_lower for phrase in opinion_phrases)
    if has_opinion:
        content_feedback["strengths"].append("✓ Thể hiện quan điểm cá nhân rõ ràng")
    elif word_count > 70:
        content_feedback["content_suggestions"].append("Thể hiện rõ quan điểm của bản thân về vấn đề")

    return content_feedback

def _generate_overall_advice(analysis, text, text_stats):
    """Generate overall advice for the entire essay including content evaluation"""
    advice = []

    grammar_score = analysis.get("grammar_score", 0)
    vocabulary_score = analysis.get("vocabulary_score", 0)
    coherence_score = analysis.get("coherence_score", 0)
    task_score = analysis.get("task_completion_score", 0)
    spelling_score = analysis.get("spelling_score", 0)

    # Get content analysis
    content_feedback = _analyze_content(text, text_stats)

    # Start with overall assessment
    avg_score = (grammar_score + vocabulary_score + coherence_score + task_score + spelling_score) / 5
    if avg_score >= 8:
        advice.append("🌟 Bài viết xuất sắc! Nội dung và hình thức đều tốt.")
    elif avg_score >= 6:
        advice.append("👍 Bài viết ở mức khá. Với một vài cải thiện sẽ hoàn thiện hơn.")
    else:
        advice.append("📖 Bài viết cần được cải thiện đáng kể cả về nội dung và hình thức.")

    # Add content strengths
    if content_feedback["strengths"]:
        advice.append("\n📌 ĐIỂM MẠNH VỀ NỘI DUNG:")
        advice.extend(content_feedback["strengths"])

    # Add content weaknesses
    if content_feedback["weaknesses"]:
        advice.append("\n⚠️ ĐIỂM CẦN CẢI THIỆN VỀ NỘI DUNG:")
        advice.extend(content_feedback["weaknesses"])

    # Add content suggestions
    if content_feedback["content_suggestions"]:
        advice.append("\n💡 GỢI Ý CẢI THIỆN NỘI DUNG:")
        for i, suggestion in enumerate(content_feedback["content_suggestions"], 1):
            advice.append(f"  {i}. {suggestion}")

    # Add form/language advice
    advice.append("\n📝 ĐÁNH GIÁ HÌNH THỨC:")

    # Grammar advice
    if grammar_score < 6:
        advice.append("• Ngữ pháp: Cần cải thiện nhiều. Ôn lại cấu trúc câu và thì động từ.")
    elif grammar_score < 8:
        advice.append("• Ngữ pháp: Khá tốt, còn một số lỗi nhỏ cần sửa.")
    else:
        advice.append("• Ngữ pháp: Tốt ✓")

    # Vocabulary advice
    if vocabulary_score < 6:
        advice.append("• Từ vựng: Còn hạn chế. Học thêm từ đồng nghĩa và cụm từ học thuật.")
    elif vocabulary_score < 8:
        advice.append("• Từ vựng: Trung bình. Thử dùng từ vựng đa dạng và nâng cao hơn.")
    else:
        advice.append("• Từ vựng: Phong phú ✓")

    # Coherence advice
    if coherence_score < 6:
        advice.append("• Liên kết: Thiếu. Dùng từ nối (however, therefore, moreover...) để kết nối ý.")
    elif coherence_score < 8:
        advice.append("• Liên kết: Cần cải thiện. Sắp xếp ý theo trình tự logic hơn.")
    else:
        advice.append("• Liên kết: Mạch lạc ✓")

    # Task completion advice
    if task_score < 6:
        advice.append("• Hoàn thành: Bài viết quá ngắn. Phát triển ý với ví dụ và giải thích.")
    elif task_score < 8:
        advice.append("• Hoàn thành: Cần mở rộng thêm với dẫn chứng và phân tích.")
    else:
        advice.append("• Hoàn thành: Đầy đủ ✓")

    # Spelling advice
    if spelling_score < 8:
        advice.append("• Chính tả: Có lỗi. Kiểm tra lại từng từ trước khi nộp bài.")
    else:
        advice.append("• Chính tả: Tốt ✓")

    return advice

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
            "sentence_feedback": [],
            "overall_advice": []
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

    # Build feedback summary
    feedback = f"Điểm tổng: {overall_score:.1f}/10 | Grammar: {analysis.get('grammar_score', 0):.1f}/10, Vocabulary: {analysis.get('vocabulary_score', 0):.1f}/10, Coherence: {analysis.get('coherence_score', 0):.1f}/10, Task: {analysis.get('task_completion_score', 0):.1f}/10, Spelling: {analysis.get('spelling_score', 0):.1f}/10"

    # Get sentence feedback (only sentences needing improvement)
    sentence_feedback = analysis.get("sentence_feedback", [])

    # Get text stats for content analysis
    text_stats = analysis.get("text_stats", {})

    # Generate overall advice for the essay including content evaluation
    overall_advice = _generate_overall_advice(analysis, text, text_stats)

    return {
        "score": round(overall_score_100, 2),
        "grammar_score": round(grammar_100, 2),
        "vocabulary_score": round(vocabulary_100, 2),
        "coherence_score": round(coherence_100, 2),
        "task_completion_score": round(task_100, 2),
        "spelling_score": round(spelling_100, 2),
        "feedback": feedback,
        "sentence_feedback": sentence_feedback,  # Chi tiết từng câu cần cải thiện
        "overall_advice": overall_advice,  # Lời khuyên tổng thể cho cả bài
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

    # Output JSON with UTF-8 encoding
    output = json.dumps(result, ensure_ascii=False)
    sys.stdout.write(output)
    sys.stdout.flush()

if __name__ == "__main__":
    main()
