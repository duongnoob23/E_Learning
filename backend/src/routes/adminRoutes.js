const express = require("express");
const router = express.Router();

// GET /admin/dashboard/stats
router.get("/dashboard/stats", (req, res) => {
  res.json({
    message: "Get dashboard stats",
  });
});

module.exports = router;
