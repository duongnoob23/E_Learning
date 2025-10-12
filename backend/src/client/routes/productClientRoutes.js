const express = require("express");
const router = express.Router();
const controller = require("../controllers/productClientController");
const { authMiddleware } = require("../../middleware/authMiddleware");

/**
 * Product – client routes
 *
 * PRODUCTS:
 * - GET /products - Lấy danh sách sản phẩm (có filter, search, pagination)
 * - GET /products/:id - Lấy chi tiết sản phẩm
 * - GET /products/:id/variants - Lấy biến thể của sản phẩm
 * - GET /products/:id/reviews - Lấy đánh giá sản phẩm
 * - GET /products/featured - Lấy sản phẩm nổi bật
 * - GET /products/bestsellers - Lấy sản phẩm bán chạy
 * - GET /products/new - Lấy sản phẩm mới
 * - GET /products/search - Tìm kiếm sản phẩm
 * - GET /products/related/:id - Lấy sản phẩm liên quan
 *
 * CATEGORIES:
 * - GET /categories - Lấy danh sách danh mục
 * - GET /categories/:id - Lấy chi tiết danh mục
 * - GET /categories/:id/products - Lấy sản phẩm theo danh mục
 *
 * BRANDS:
 * - GET /brands - Lấy danh sách thương hiệu
 * - GET /brands/:id - Lấy chi tiết thương hiệu
 * - GET /brands/:id/products - Lấy sản phẩm theo thương hiệu
 *
 * AUTHORS & PUBLISHERS:
 * - GET /authors - Lấy danh sách tác giả
 * - GET /authors/:id - Lấy chi tiết tác giả
 * - GET /authors/:id/products - Lấy sản phẩm theo tác giả
 * - GET /publishers - Lấy danh sách nhà xuất bản
 * - GET /publishers/:id - Lấy chi tiết nhà xuất bản
 * - GET /publishers/:id/products - Lấy sản phẩm theo nhà xuất bản
 *
 * REVIEWS:
 * - POST /products/:id/reviews - Tạo đánh giá sản phẩm (cần auth)
 * - PUT /reviews/:id - Cập nhật đánh giá (cần auth)
 * - DELETE /reviews/:id - Xóa đánh giá (cần auth)
 * - POST /reviews/:id/helpful - Đánh dấu đánh giá hữu ích (cần auth)
 *
 * WISHLIST & COMPARISON:
 * - GET /wishlist - Lấy danh sách yêu thích (cần auth)
 * - POST /wishlist/:productId - Thêm vào yêu thích (cần auth)
 * - DELETE /wishlist/:productId - Xóa khỏi yêu thích (cần auth)
 * - GET /comparison - Lấy danh sách so sánh (cần auth)
 * - POST /comparison/:productId - Thêm vào so sánh (cần auth)
 * - DELETE /comparison/:productId - Xóa khỏi so sánh (cần auth)
 *
 * SEARCH & FILTERS:
 * - GET /search/suggestions - Gợi ý tìm kiếm
 * - GET /search/popular - Từ khóa tìm kiếm phổ biến
 * - GET /filters - Lấy danh sách bộ lọc
 */

// ==================== PRODUCTS ====================

// Lấy danh sách sản phẩm với filter, search, pagination
router.get("/products", controller.getProducts);

// Lấy chi tiết sản phẩm
router.get("/products/:id", controller.getProductById);

// Lấy biến thể của sản phẩm
router.get("/products/:id/variants", controller.getProductVariants);

// Lấy đánh giá sản phẩm
router.get("/products/:id/reviews", controller.getProductReviews);

// Lấy sản phẩm nổi bật
router.get("/products/featured", controller.getFeaturedProducts);

// Lấy sản phẩm bán chạy
router.get("/products/bestsellers", controller.getBestsellerProducts);

// Lấy sản phẩm mới
router.get("/products/new", controller.getNewProducts);

// Tìm kiếm sản phẩm
router.get("/products/search", controller.searchProducts);

// Lấy sản phẩm liên quan
router.get("/products/related/:id", controller.getRelatedProducts);

// ==================== CATEGORIES ====================

// Lấy danh sách danh mục
router.get("/categories", controller.getCategories);

// Lấy chi tiết danh mục
router.get("/categories/:id", controller.getCategoryById);

// Lấy sản phẩm theo danh mục
router.get("/categories/:id/products", controller.getProductsByCategory);

// ==================== BRANDS ====================

// Lấy danh sách thương hiệu
router.get("/brands", controller.getBrands);

// Lấy chi tiết thương hiệu
router.get("/brands/:id", controller.getBrandById);

// Lấy sản phẩm theo thương hiệu
router.get("/brands/:id/products", controller.getProductsByBrand);

// ==================== AUTHORS ====================

// Lấy danh sách tác giả
router.get("/authors", controller.getAuthors);

// Lấy chi tiết tác giả
router.get("/authors/:id", controller.getAuthorById);

// Lấy sản phẩm theo tác giả
router.get("/authors/:id/products", controller.getProductsByAuthor);

// ==================== PUBLISHERS ====================

// Lấy danh sách nhà xuất bản
router.get("/publishers", controller.getPublishers);

// Lấy chi tiết nhà xuất bản
router.get("/publishers/:id", controller.getPublisherById);

// Lấy sản phẩm theo nhà xuất bản
router.get("/publishers/:id/products", controller.getProductsByPublisher);

// ==================== REVIEWS (Cần authentication) ====================

// Tạo đánh giá sản phẩm
router.post(
  "/products/:id/reviews",
  authMiddleware,
  controller.createProductReview
);

// Cập nhật đánh giá
router.put("/reviews/:id", authMiddleware, controller.updateReview);

// Xóa đánh giá
router.delete("/reviews/:id", authMiddleware, controller.deleteReview);

// Đánh dấu đánh giá hữu ích
router.post(
  "/reviews/:id/helpful",
  authMiddleware,
  controller.markReviewHelpful
);

// ==================== WISHLIST (Cần authentication) ====================

// Lấy danh sách yêu thích
router.get("/wishlist", authMiddleware, controller.getWishlist);

// Thêm vào yêu thích
router.post("/wishlist/:productId", authMiddleware, controller.addToWishlist);

// Xóa khỏi yêu thích
router.delete(
  "/wishlist/:productId",
  authMiddleware,
  controller.removeFromWishlist
);

// ==================== COMPARISON (Cần authentication) ====================

// Lấy danh sách so sánh
router.get("/comparison", authMiddleware, controller.getComparison);

// Thêm vào so sánh
router.post(
  "/comparison/:productId",
  authMiddleware,
  controller.addToComparison
);

// Xóa khỏi so sánh
router.delete(
  "/comparison/:productId",
  authMiddleware,
  controller.removeFromComparison
);

// ==================== SEARCH & FILTERS ====================

// Gợi ý tìm kiếm
router.get("/search/suggestions", controller.getSearchSuggestions);

// Từ khóa tìm kiếm phổ biến
router.get("/search/popular", controller.getPopularKeywords);

// Lấy danh sách bộ lọc
router.get("/filters", controller.getFilters);

// ==================== PRODUCT VIEWS (Tracking) ====================

// Track lượt xem sản phẩm
router.post("/products/:id/view", controller.trackProductView);

module.exports = router;
