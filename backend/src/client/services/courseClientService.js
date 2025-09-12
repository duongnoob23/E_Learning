const Course = require("../../models").Course;
const { Op } = require("sequelize");
const Category = require("../../models").Category;
const Instructor = require("../../models").Instructor;
const Level = require("../../models").Level;

// Lấy danh sách khóa học
exports.findAll = async () => {
  try {
    const courses = await Course.findAll();
    return {
      EM: "Truy vấn thành công",
      EC: "0", // success
      DT: courses
    };
  } catch (error) {
    console.error("Lỗi trong findAllCourses service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

// Lấy danh sách khóa học theo tiêu đề
exports.findByTitle = async (title) => {
  try {
    const course = await Course.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`
        }
      }
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: course
    };
  } catch (error) {
    console.error("Lỗi trong findByTitle service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null
    };
  }
};


// Lấy danh sách khóa học theo id
exports.findbyId = async (id) => {
  try {
    const course = await Course.findbyId(id);
    if (!course) {
      return {
        EM: "Không tìm thấy khóa học",
        EC: "2",
        DT: null
      };
    }else{
      return {
        EM: "Truy vấn thành công",
        EC: "0",
        DT: course
      };
    }
  } catch (error) {
    console.error("Lỗi trong findbyId service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null
    };
  }
};

// Lấy danh sách khóa học với filter và sort
exports.findAllWithFilters = async (filters) => {
  try {
    const {
      title,
      category,
      instructor,
      level,
      price_type,
      min_price,
      max_price,
      rating,
      sort_by,
      page,
      limit
    } = filters;

    // Build where conditions
    const whereConditions = {};

    if (title) {
      whereConditions.title = {
        [Op.like]: `%${title}%`
      };
    }

    if (category) {
      whereConditions.category_id = category;
    }

    if (instructor) {
      whereConditions.instructor_id = instructor;
    }

    if (level) {
      whereConditions.level_id = level;
    }

    if (price_type === 'free') {
      whereConditions.is_free = true;
    } else if (price_type === 'paid') {
      whereConditions.is_free = false;
    }

    if (min_price && max_price) {
      whereConditions.price = {
        [Op.between]: [parseFloat(min_price), parseFloat(max_price)]
      };
    } else if (min_price) {
      whereConditions.price = {
        [Op.gte]: parseFloat(min_price)
      };
    } else if (max_price) {
      whereConditions.price = {
        [Op.lte]: parseFloat(max_price)
      };
    }

    if (rating) {
      whereConditions.average_rating = {
        [Op.gte]: parseFloat(rating)
      };
    }

    // Build order conditions
    let orderConditions = [];
    switch (sort_by) {
      case 'newest':
        orderConditions = [['created_at', 'DESC']];
        break;
      case 'popular':
        orderConditions = [['total_students', 'DESC']];
        break;
      case 'price_asc':
        orderConditions = [['price', 'ASC']];
        break;
      case 'price_desc':
        orderConditions = [['price', 'DESC']];
        break;
      case 'rating':
        orderConditions = [['average_rating', 'DESC']];
        break;
      default:
        orderConditions = [['created_at', 'DESC']];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Course.findAndCountAll({
      where: whereConditions,
      order: orderConditions,
      limit: limit,
      offset: offset,
      include: [
        {
          model: Category,
          attributes: ['category_id', 'name']
        },
        {
          model: Instructor,
          attributes: ['instructor_id', 'name']
        },
        {
          model: Level,
          attributes: ['level_id', 'name']
        }
      ]
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        courses: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit
        }
      }
    };
  } catch (error) {
    console.error("Lỗi trong findAllWithFilters service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null
    };
  }
};

// Lấy filter options (categories, instructors, levels)
// exports.getFilterOptions = async () => {
//   try {
//     const [categories, instructors, levels] = await Promise.all([
//       Category.findAll({
//         attributes: ['id', 'name'],
//         where: { is_active: true }
//       }),
//       Instructor.findAll({
//         attributes: ['id', 'name'],
//         where: { is_active: true }
//       }),
//       Level.findAll({
//         attributes: ['id', 'name'],
//         where: { is_active: true }
//       })
//     ]);

//     return {
//       EM: "Lấy filter options thành công",
//       EC: "0",
//       DT: {
//         categories,
//         instructors,
//         levels
//       }
//     };
//   } catch (error) {
//     console.error("Lỗi trong getFilterOptions service:", error);
//     return {
//       EM: "Có lỗi xảy ra khi lấy filter options",
//       EC: "-2",
//       DT: null
//     };
//   }
// };
