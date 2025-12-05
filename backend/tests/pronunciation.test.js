const request = require("supertest");
const app = require("../src/app");
const { PronunciationAssessment, Word, User } = require("../src/models");

describe("Pronunciation Assessment API", () => {
  let token;
  let userId;
  let wordId;

  beforeAll(async () => {
    // Setup: Tạo user test
    const user = await User.create({
      username: "test_user",
      email: "test@example.com",
      password_hash: "hashed_password"
    });
    userId = user.user_id;

    // Setup: Tạo word test
    const word = await Word.create({
      word: "hello",
      pronunciation: "həˈloʊ",
      meaning_vi: "xin chào",
      topic_id: 1
    });
    wordId = word.word_id;

    // Login để lấy token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password"
      });

    token = loginRes.body.DT.token;
  });

  describe("POST /api/words/pronunciation/assess", () => {
    it("should assess pronunciation successfully", async () => {
      const res = await request(app)
        .post("/api/words/pronunciation/assess")
        .set("Authorization", `Bearer ${token}`)
        .field("word_id", wordId)
        .attach("audio", "tests/fixtures/test_audio.wav");

      expect(res.status).toBe(200);
      expect(res.body.EC).toBe("0");
      expect(res.body.DT).toHaveProperty("score");
      expect(res.body.DT.score).toBeGreaterThanOrEqual(0);
      expect(res.body.DT.score).toBeLessThanOrEqual(100);
    });

    it("should fail without audio file", async () => {
      const res = await request(app)
        .post("/api/words/pronunciation/assess")
        .set("Authorization", `Bearer ${token}`)
        .field("word_id", wordId);

      expect(res.status).toBe(400);
      expect(res.body.EC).toBe("-1");
    });

    it("should fail without word_id", async () => {
      const res = await request(app)
        .post("/api/words/pronunciation/assess")
        .set("Authorization", `Bearer ${token}`)
        .attach("audio", "tests/fixtures/test_audio.wav");

      expect(res.status).toBe(400);
      expect(res.body.EC).toBe("-1");
    });
  });

  describe("GET /api/words/pronunciation/history/:word_id", () => {
    it("should get pronunciation history", async () => {
      const res = await request(app)
        .get(`/api/words/pronunciation/history/${wordId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.EC).toBe("0");
      expect(Array.isArray(res.body.DT)).toBe(true);
    });

    it("should fail without authentication", async () => {
      const res = await request(app)
        .get(`/api/words/pronunciation/history/${wordId}`);

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/words/pronunciation/stats", () => {
    it("should get pronunciation stats", async () => {
      const res = await request(app)
        .get("/api/words/pronunciation/stats")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.EC).toBe("0");
      expect(res.body.DT).toHaveProperty("totalAssessments");
      expect(res.body.DT).toHaveProperty("avgScore");
      expect(res.body.DT).toHaveProperty("scoreDistribution");
    });

    it("should filter by topic_id", async () => {
      const res = await request(app)
        .get("/api/words/pronunciation/stats?topic_id=1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.EC).toBe("0");
    });
  });

  afterAll(async () => {
    // Cleanup
    await PronunciationAssessment.destroy({ where: { user_id: userId } });
    await Word.destroy({ where: { word_id: wordId } });
    await User.destroy({ where: { user_id: userId } });
  });
});

