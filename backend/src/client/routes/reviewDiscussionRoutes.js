const express = require("express");
const router = express.Router();

/**
 * Reviews & Discussions – client
 * - GET    /course/:course_id/reviews               (list)
 * - POST   /course/:course_id/reviews               (tạo review – đã enroll)
 * - GET    /course/:course_id/discussions           (threads)
 * - POST   /course/:course_id/discussions           (tạo thread)
 * - POST   /course/:course_id/discussions/:id/reply (trả lời)
 */

router.get("/course/:course_id/reviews", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.post("/course/:course_id/reviews", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

router.get("/course/:course_id/discussions", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.post("/course/:course_id/discussions", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.post("/course/:course_id/discussions/:id/reply", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;
