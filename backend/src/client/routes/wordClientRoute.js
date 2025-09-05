const express = require("express");
const router = express.Router();

const controller = require("../controllers/wordClientController");

router.get("/", controller.getWord);

router.get("/topic", controller.getTopic);

router.get("/topic/:topic_id", controller.getWordByTopic);

module.exports = router;
