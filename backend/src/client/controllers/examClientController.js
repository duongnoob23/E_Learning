const examService = require('../services/examClientService');

const ok = (res, EM, DT) => res.status(200).json({ EC: 0, EM, DT });
const created = (res, EM, DT) => res.status(201).json({ EC: 0, EM, DT });
const bad = (res, EM) => res.status(400).json({ EC: 1, EM, DT: null });
const notFound = (res, EM) => res.status(404).json({ EC: 1, EM, DT: null });
const err = (res, EM) => res.status(500).json({ EC: -1, EM, DT: null });

// Tests
const getAllTests = async (req, res) => {
	try {
		const result = await examService.getAllTests(req.query);
		return ok(res, 'Lấy danh sách bài kiểm tra thành công', result);
	} catch (e) {
		console.error('getAllTests error', e);
		return err(res, 'Lỗi server khi lấy danh sách bài kiểm tra');
	}
};

const getTestById = async (req, res) => {
	try {
		const test = await examService.getTestById(req.params.testId);
		if (!test) return notFound(res, 'Không tìm thấy bài kiểm tra');
		return ok(res, 'Lấy thông tin bài kiểm tra thành công', test);
	} catch (e) {
		console.error('getTestById error', e);
		return err(res, 'Lỗi server khi lấy thông tin bài kiểm tra');
	}
};

const createTest = async (req, res) => {
	try {
		const test = await examService.createTest(req.body);
		return created(res, 'Tạo bài kiểm tra thành công', test);
	} catch (e) {
		console.error('createTest error', e);
		return err(res, 'Lỗi server khi tạo bài kiểm tra');
	}
};

const updateTest = async (req, res) => {
	try {
		const okUpdate = await examService.updateTest(req.params.testId, req.body);
		if (!okUpdate) return notFound(res, 'Không tìm thấy bài kiểm tra để cập nhật');
		return ok(res, 'Cập nhật bài kiểm tra thành công', null);
	} catch (e) {
		console.error('updateTest error', e);
		return err(res, 'Lỗi server khi cập nhật bài kiểm tra');
	}
};

const deleteTest = async (req, res) => {
	try {
		const deleted = await examService.deleteTest(req.params.testId);
		if (!deleted) return notFound(res, 'Không tìm thấy bài kiểm tra để xóa');
		return ok(res, 'Xóa bài kiểm tra thành công', null);
	} catch (e) {
		console.error('deleteTest error', e);
		return err(res, 'Lỗi server khi xóa bài kiểm tra');
	}
};

// Tags
const getAllTags = async (req, res) => {
	try {
		const tags = await examService.getAllTags();
		return ok(res, 'Lấy danh sách thẻ thành công', tags);
	} catch (e) {
		console.error('getAllTags error', e);
		return err(res, 'Lỗi server khi lấy danh sách thẻ');
	}
};

const getTagById = async (req, res) => {
	try {
		const tag = await examService.getTagById(req.params.tagId);
		if (!tag) return notFound(res, 'Không tìm thấy thẻ');
		return ok(res, 'Lấy thông tin thẻ thành công', tag);
	} catch (e) {
		console.error('getTagById error', e);
		return err(res, 'Lỗi server khi lấy thông tin thẻ');
	}
};

const createTag = async (req, res) => {
	try {
		const tag = await examService.createTag(req.body);
		return created(res, 'Tạo thẻ thành công', tag);
	} catch (e) {
		console.error('createTag error', e);
		return err(res, 'Lỗi server khi tạo thẻ');
	}
};

const updateTag = async (req, res) => {
	try {
		const updated = await examService.updateTag(req.params.tagId, req.body);
		if (!updated) return notFound(res, 'Không tìm thấy thẻ để cập nhật');
		return ok(res, 'Cập nhật thẻ thành công', null);
	} catch (e) {
		console.error('updateTag error', e);
		return err(res, 'Lỗi server khi cập nhật thẻ');
	}
};

const deleteTag = async (req, res) => {
	try {
		const deleted = await examService.deleteTag(req.params.tagId);
		if (!deleted) return notFound(res, 'Không tìm thấy thẻ để xóa');
		return ok(res, 'Xóa thẻ thành công', null);
	} catch (e) {
		console.error('deleteTag error', e);
		return err(res, 'Lỗi server khi xóa thẻ');
	}
};

// Relations
const getTestTags = async (req, res) => {
	try {
		const tags = await examService.getTestTags(req.params.testId);
		return ok(res, 'Lấy thẻ của bài kiểm tra thành công', tags);
	} catch (e) {
		console.error('getTestTags error', e);
		return err(res, 'Lỗi server khi lấy thẻ của bài kiểm tra');
	}
};

const addTagToTest = async (req, res) => {
	try {
		const success = await examService.addTagToTest(req.params.testId, req.params.tagId);
		if (!success) return bad(res, 'Không thể thêm thẻ vào bài kiểm tra');
		return ok(res, 'Thêm thẻ vào bài kiểm tra thành công', null);
	} catch (e) {
		console.error('addTagToTest error', e);
		return err(res, 'Lỗi server khi thêm thẻ vào bài kiểm tra');
	}
};

const removeTagFromTest = async (req, res) => {
	try {
		const success = await examService.removeTagFromTest(req.params.testId, req.params.tagId);
		if (!success) return notFound(res, 'Không tìm thấy liên kết thẻ-bài kiểm tra để xóa');
		return ok(res, 'Xóa thẻ khỏi bài kiểm tra thành công', null);
	} catch (e) {
		console.error('removeTagFromTest error', e);
		return err(res, 'Lỗi server khi xóa thẻ khỏi bài kiểm tra');
	}
};

// Search / Filter
const searchTests = async (req, res) => {
	try {
		const result = await examService.searchTests({
			search: req.query.q,
			test_type: req.query.test_type,
			course_id: req.query.course_id,
			page: req.query.page,
			limit: req.query.limit,
		});
		return ok(res, 'Tìm kiếm bài kiểm tra thành công', result);
	} catch (e) {
		console.error('searchTests error', e);
		return err(res, 'Lỗi server khi tìm kiếm bài kiểm tra');
	}
};

const filterTests = async (req, res) => {
	try {
		const result = await examService.filterTests({
			test_type: req.query.test_type,
			course_id: req.query.course_id,
			tag_id: req.query.tag_id,
			page: req.query.page,
			limit: req.query.limit,
		});
		return ok(res, 'Lọc bài kiểm tra thành công', result);
	} catch (e) {
		console.error('filterTests error', e);
		return err(res, 'Lỗi server khi lọc bài kiểm tra');
	}
};

module.exports = {
	getAllTests,
	getTestById,
	createTest,
	updateTest,
	deleteTest,
	getAllTags,
	getTagById,
	createTag,
	updateTag,
	deleteTag,
	getTestTags,
	addTagToTest,
	removeTagFromTest,
	searchTests,
	filterTests,
};


