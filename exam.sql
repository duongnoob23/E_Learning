USE e_learnning2;

CREATE TABLE tests (
    test_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE parts (
    part_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    test_id BIGINT UNSIGNED NOT NULL,
    part_number INT NOT NULL,
    title VARCHAR(100),
    description TEXT,
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE passages (
    passage_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    part_id BIGINT UNSIGNED NOT NULL,
    text TEXT,
    audio_url VARCHAR(255),
    image_url VARCHAR(255),
    FOREIGN KEY (part_id) REFERENCES parts(part_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE questions (
    question_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    part_id BIGINT UNSIGNED NOT NULL,
    passage_id BIGINT UNSIGNED NULL,
    question_text TEXT NOT NULL,
    question_text_vi TEXT NULL,
    options JSON,
    options_vi JSON,
    correct_answer VARCHAR(5) NOT NULL,
    explanation_vi TEXT NULL,
    FOREIGN KEY (part_id) REFERENCES parts(part_id) ON DELETE CASCADE,
    FOREIGN KEY (passage_id) REFERENCES passages(passage_id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE user_answers (
    answer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    question_id BIGINT UNSIGNED NOT NULL,
    user_answer VARCHAR(5),
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE results (
    result_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    test_id BIGINT UNSIGNED NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score INT NOT NULL,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE result_parts (
    result_part_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    result_id BIGINT UNSIGNED NOT NULL,
    part_id BIGINT UNSIGNED NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (result_id) REFERENCES results(result_id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES parts(part_id) ON DELETE CASCADE
) ENGINE=InnoDB;


