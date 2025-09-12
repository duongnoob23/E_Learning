const express = require("express"); 
const router = express.Router();

const controller = require("../controllers/courseClientController");

router.get("/", controller.getCourse);
// router.get("/filter-options", controller.getFilterOptions);
router.get("/:id", controller.getCourseById);

module.exports = router;
