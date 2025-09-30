const Topic = require("../../models").Topic;
const UserWord = require("../../models").UserWord;
const Word = require("../../models").Word;
const { Op } = require("sequelize");

// Lấy danh sách từ vựng theo topic + tìm kiếm
exports.getWordsByTopic = async (filters) => {
  try {
    const { topicId, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (topicId) {
      whereConditions.topic_id = topicId;
    }

    const { count, rows } = await Word.findAndCountAll({
      where: whereConditions,
      limit: limit,
      offset: offset,
    }); 

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        words: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsByTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách từ vựng cá nhân theo topic + tìm kiếm
exports.getWordsbyUser = async (filters) => {
  try {
    const { userId, topicId, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (userId) {
      whereConditions.user_id = userId;
    }
    if (topicId) {
      whereConditions.topic_id = topicId;
    }

    const { count, rows } = await UserWord.findAndCountByFilters({
      where: whereConditions,
      limit: limit,
      offset: offset,
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        words: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsbyUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Tao du tu vung moi ca nhan
exports.postWordToUser = async (data) => {
  try {
    const result = await UserWord.createWord(data);
    return {
      EM: "Thêm từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong postWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình thêm từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Sửa từ vựng cá nhân
exports.patchWordToUser = async (data) => {
  try {
    const result = await UserWord.updateWord(data.user_word_id, data);
    return {
      EM: "Cập nhật từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong patchWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình cập nhật từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Xóa từ vựng cá nhân
exports.deleteWordToUser = async (userWordId) => {
  try {
    const result = await UserWord.updateWord(userWordId, { is_active: false });
    return {
      EM: "Xóa từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong deleteWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xóa từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách topics cho phần khám phá
exports.getExploreTopics = async (filters) => {
  try {
    const { page = 1, limit = 12, search = '', topic_type = 'system' } = filters;
    
    const result = await Topic.findPublicTopics({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      topic_type
    });

    // Format dữ liệu để phù hợp với frontend
    const formattedTopics = result.rows.map(topic => ({
      id: topic.topic_id,
      title: topic.topic_name,
      description: topic.description,
      wordCount: topic.word_count,
      viewCount: 0, // Có thể thêm field view_count vào database sau
      logo: topic.logo_url || "/images/study4-logo.png",
      image: topic.image_url,
      category: topic.topic_type,
      difficulty: "intermediate", // Có thể thêm field difficulty vào database
      isPublic: topic.is_public,
      isActive: topic.is_active,
      createdAt: topic.created_at,
      updatedAt: topic.updated_at
    }));

    return {
      EM: "Lấy danh sách topics thành công",
      EC: "0",
      DT: {
        topics: formattedTopics,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(result.count / parseInt(limit)),
          total_items: result.count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getExploreTopics service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách topics",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách topics của user (List từ của tôi)
exports.getUserTopics = async (filters) => {
  try {
    const { userId, page = 1, limit = 12, search = '' } = filters;
    
    if (!userId) {
      return {
        EM: "User ID là bắt buộc",
        EC: "2",
        DT: null,
      };
    }

    const whereConditions = {
      created_by: userId
    };
    
    if (search) {
      whereConditions[Op.or] = [
        { topic_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await Topic.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    // Format dữ liệu để phù hợp với frontend
    const formattedTopics = rows.map(topic => ({
      id: topic.topic_id,
      title: topic.topic_name,
      description: topic.description,
      wordCount: topic.word_count,
      viewCount: 0,
      logo: topic.logo_url || "/images/study4-logo.png",
      image: topic.image_url,
      category: "user_created",
      difficulty: "beginner",
      isUserCreated: true,
      isPublic: topic.is_public,
      createdAt: topic.created_at,
      updatedAt: topic.updated_at
    }));

    return {
      EM: "Lấy danh sách topics của user thành công",
      EC: "0",
      DT: {
        topics: formattedTopics,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / parseInt(limit)),
          total_items: count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getUserTopics service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách topics của user",
      EC: "-2",
      DT: null,
    };
  }
};

// Tạo topic mới
exports.createTopic = async (data) => {
  try {
    const { topic_name, description, topic_type = 'user_created', is_public = true, is_active = true, word_count = 0, created_by } = data;
    
    const newTopic = await Topic.createTopic({
      topic_name,
      description,
      topic_type,
      is_public,
      is_active,
      word_count,
      created_by,
      created_at: new Date(),
      updated_at: new Date()
    });

    return {
      EM: "Tạo topic thành công",
      EC: "0",
      DT: {
        topic: {
          id: newTopic.topic_id,
          title: newTopic.topic_name,
          description: newTopic.description,
          wordCount: newTopic.word_count,
          viewCount: 0,
          logo: newTopic.logo_url || "/images/study4-logo.png",
          image: newTopic.image_url,
          category: newTopic.topic_type,
          difficulty: "beginner",
          isUserCreated: true,
          isPublic: newTopic.is_public,
          isActive: newTopic.is_active,
          createdAt: newTopic.created_at,
          updatedAt: newTopic.updated_at
        }
      },
    };
  } catch (error) {
    console.error("Lỗi trong createTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình tạo topic",
      EC: "-2",
      DT: null,
    };
  }
};

// Cập nhật topic
exports.updateTopic = async (filters) => {
  try {
    const { topicId, topic_name, description, is_public, userId } = filters;
    
    if (!topicId || !userId) {
      return {
        EM: "Topic ID và User ID là bắt buộc",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra topic có thuộc về user không
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return {
        EM: "Topic không tồn tại",
        EC: "3",
        DT: null,
      };
    }

    if (topic.created_by !== userId) {
      return {
        EM: "Bạn không có quyền chỉnh sửa topic này",
        EC: "4",
        DT: null,
      };
    }

    // Cập nhật topic
    const updatedTopic = await Topic.updateTopic(topicId, {
      topic_name,
      description,
      is_public
    });

    return {
      EM: "Cập nhật topic thành công",
      EC: "0",
      DT: {
        topic: {
          id: updatedTopic.topic_id,
          title: updatedTopic.topic_name,
          description: updatedTopic.description,
          isPublic: updatedTopic.is_public,
          updatedAt: updatedTopic.updated_at
        }
      },
    };
  } catch (error) {
    console.error("Lỗi trong updateTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình cập nhật topic",
      EC: "-2",
      DT: null,
    };
  }
};

// Xóa topic
exports.deleteTopic = async (filters) => {
  try {
    const { topicId, userId } = filters;
    
    if (!topicId || !userId) {
      return {
        EM: "Topic ID và User ID là bắt buộc",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra topic có thuộc về user không
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return {
        EM: "Topic không tồn tại",
        EC: "3",
        DT: null,
      };
    }

    if (topic.created_by !== userId) {
      return {
        EM: "Bạn không có quyền xóa topic này",
        EC: "4",
        DT: null,
      };
    }

    // Xóa tất cả words thuộc topic trước
    await Word.destroy({
      where: { topic_id: topicId }
    });

    // Xóa topic (hard delete - xóa thật khỏi database)
    await Topic.deleteTopic(topicId);

    return {
      EM: "Xóa topic thành công",
      EC: "0",
      DT: {
        topicId: topicId
      },
    };
  } catch (error) {
    console.error("Lỗi trong deleteTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xóa topic",
      EC: "-2",
      DT: null,
    };
  }
};

// Thêm từ vào topic
exports.addWordToTopic = async (filters) => {
  try {
    const { 
      topicId, 
      word, 
      part_of_speech, 
      pronunciation, 
      meaning_vi, 
      example_en, 
      example_vi, 
      image_url, 
      notes, 
      word_type, 
      created_by 
    } = filters;
    
    if (!topicId || !word || !meaning_vi || !created_by) {
      return {
        EM: "Topic ID, từ, nghĩa tiếng Việt và người tạo là bắt buộc",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra topic có tồn tại và thuộc về user không
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return {
        EM: "Topic không tồn tại",
        EC: "3",
        DT: null,
      };
    }

    if (topic.created_by !== created_by) {
      return {
        EM: "Bạn không có quyền thêm từ vào topic này",
        EC: "4",
        DT: null,
      };
    }

    // Kiểm tra từ đã tồn tại trong topic chưa
    const existingWord = await Word.findByWord(word);
    if (existingWord && existingWord.topic_id === parseInt(topicId)) {
      return {
        EM: "Từ này đã tồn tại trong topic",
        EC: "5",
        DT: null,
      };
    }

    // Tạo từ mới
    const newWord = await Word.createWord({
      topic_id: parseInt(topicId),
      word: word.trim(),
      part_of_speech: part_of_speech || 'noun',
      pronunciation: pronunciation || '',
      meaning_vi: meaning_vi.trim(),
      example_en: example_en || '',
      example_vi: example_vi || '',
      image_url: image_url || '',
      notes: notes || '',
      word_type: word_type || 'user_created',
      created_by: created_by,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Cập nhật word_count của topic
    const currentWordCount = await Word.count({ where: { topic_id: topicId, is_active: true } });
    await Topic.updateTopic(topicId, { word_count: currentWordCount });

    return {
      EM: "Thêm từ thành công",
      EC: "0",
      DT: {
        word: {
          id: newWord.word_id,
          word: newWord.word,
          partOfSpeech: newWord.part_of_speech,
          pronunciation: newWord.pronunciation,
          meaningVi: newWord.meaning_vi,
          exampleEn: newWord.example_en,
          exampleVi: newWord.example_vi,
          imageUrl: newWord.image_url,
          notes: newWord.notes,
          wordType: newWord.word_type,
          isActive: newWord.is_active,
          createdAt: newWord.created_at,
          updatedAt: newWord.updated_at
        }
      },
    };
  } catch (error) {
    console.error("Lỗi trong addWordToTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình thêm từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách words theo topic_id
exports.getWordsByTopicId = async (filters) => {
  try {
    const { topic_id, page = 1, limit = 20, search = '' } = filters;
    
    if (!topic_id) {
      return {
        EM: "Topic ID là bắt buộc",
        EC: "2",
        DT: null,
      };
    }

    const result = await Word.findByTopicWithPagination({
      topic_id: parseInt(topic_id),
      page: parseInt(page),
      limit: parseInt(limit),
      search
    });

    // Format dữ liệu để phù hợp với frontend
    const formattedWords = result.rows.map(word => ({
      id: word.word_id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      pronunciation: word.pronunciation,
      meaningVi: word.meaning_vi,
      exampleEn: word.example_en,
      exampleVi: word.example_vi,
      imageUrl: word.image_url,
      notes: word.notes,
      wordType: word.word_type,
      isActive: word.is_active,
      createdAt: word.created_at,
      updatedAt: word.updated_at
    }));

    return {
      EM: "Lấy danh sách words thành công",
      EC: "0",
      DT: {
        words: formattedWords,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(result.count / parseInt(limit)),
          total_items: result.count,
          items_per_page: parseInt(limit),
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsByTopicId service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình lấy danh sách words",
      EC: "-2",
      DT: null,
    };
  }
};