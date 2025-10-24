const { body, param, query } = require('express-validator');

// Validation for uploading speaking response
exports.validateSpeakingUpload = [
    body('session_id')
        .notEmpty()
        .withMessage('Session ID is required')
        .isInt({ min: 1 })
        .withMessage('Session ID must be a positive integer'),
    
    body('question_id')
        .notEmpty()
        .withMessage('Question ID is required')
        .isInt({ min: 1 })
        .withMessage('Question ID must be a positive integer'),
    
    body('language')
        .optional()
        .isLength({ min: 2, max: 5 })
        .withMessage('Language code must be 2-5 characters')
        .matches(/^[a-z]{2,3}(-[A-Z]{2})?$/)
        .withMessage('Invalid language code format (e.g., en, vi, zh-CN)'),
];

// Validation for getting speaking response
exports.validateGetSpeakingResponse = [
    param('response_id')
        .notEmpty()
        .withMessage('Response ID is required')
        // .isUUID()
        // .withMessage('Response ID must be a valid UUID'),
];

// Validation for getting session speaking responses
exports.validateGetSessionResponses = [
    param('session_id')
        .notEmpty()
        .withMessage('Session ID is required')
        .isInt({ min: 1 })
        .withMessage('Session ID must be a positive integer'),
    
    query('status')
        .optional()
        .isIn(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])
        .withMessage('Status must be one of: PENDING, PROCESSING, COMPLETED, FAILED'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

// Validation for speaking question access
exports.validateSpeakingQuestion = [
    param('question_id')
        .notEmpty()
        .withMessage('Question ID is required')
        .isInt({ min: 1 })
        .withMessage('Question ID must be a positive integer'),
    
    body('session_id')
        .notEmpty()
        .withMessage('Session ID is required')
        .isInt({ min: 1 })
        .withMessage('Session ID must be a positive integer'),
];

// Validation for audio file requirements
exports.validateAudioFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Audio file is required'
        });
    }

    const allowedMimes = [
        'audio/wav',
        'audio/wave', 
        'audio/x-wav',
        'audio/mpeg',
        'audio/mp3',
        'audio/mp4',
        'audio/m4a',
        'audio/webm',
        'audio/ogg'
    ];

    if (!allowedMimes.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only audio files are allowed.'
        });
    }

    // Check file size (25MB max)
    const maxSize = 26214400; // 25MB in bytes
    if (req.file.size > maxSize) {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 25MB.'
        });
    }

    next();
};

// Validation for language codes
exports.validateLanguageCode = [
    body('language')
        .optional()
        .custom((value) => {
            const supportedLanguages = [
                'en', 'vi', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'it', 'pt', 
                'ru', 'ar', 'hi', 'th', 'tr', 'pl', 'nl', 'sv', 'da', 'no'
            ];
            
            if (value && !supportedLanguages.includes(value)) {
                throw new Error(`Unsupported language code. Supported: ${supportedLanguages.join(', ')}`);
            }
            
            return true;
        }),
];

// Validation for test ID when getting speaking questions
exports.validateGetSpeakingQuestions = [
    param('test_id')
        .notEmpty()
        .withMessage('Test ID is required')
        .isInt({ min: 1 })
        .withMessage('Test ID must be a positive integer'),
];

// Combined validation for complete speaking upload
exports.validateCompleteSpeakingUpload = [
    ...exports.validateSpeakingUpload,
    ...exports.validateLanguageCode,
    exports.validateAudioFile
];

// Validation error handler
exports.handleValidationErrors = (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg,
                value: error.value
            }))
        });
    }
    
    next();
};
