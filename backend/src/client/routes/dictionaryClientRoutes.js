const express = require("express");
const router = express.Router();
const controller = require("../controllers/dictionaryClientController");

/**
 * Dictionary Routes - Client
 * - GET /dictionary/search?word=...&type=...  (Tra từ điển)
 */

// Tra từ điển (không cần auth - public endpoint)
router.get("/search", controller.searchDictionary);

module.exports = router;

