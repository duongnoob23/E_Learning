const { sequelize, Test, Tag, TestTag } = require('../../models');

const buildWhere = (params = {}) => {
	const where = {};
	if (params.search) {
		where.title = { [sequelize.Sequelize.Op.like]: `%${params.search}%` };
	}
	if (params.test_type) where.test_type = params.test_type;
	if (params.course_id) where.course_id = params.course_id;
	return where;
};

const buildInclude = (params = {}) => {
	const include = [{
		model: Tag,
		as: 'tags',
		through: { attributes: [] },
		attributes: ['tag_id', 'tag_name'],
	}];
	
	// Nếu có tag filter, thêm where condition cho Tag
	if (params.tag_id && params.tag_id !== "all") {
		include[0].where = { tag_name: { [sequelize.Sequelize.Op.iLike]: `%${params.tag_id}%` } };
		include[0].required = true; // INNER JOIN để chỉ lấy tests có tag này
	}
	
	return include;
};

const buildPaging = (page = 1, limit = 20) => {
	const safeLimit = parseInt(limit);
	const safePage = parseInt(page);
	return { limit: safeLimit, offset: (safePage - 1) * safeLimit };
};

// Tests
const getAllTests = async (params = {}) => {
	const where = buildWhere(params);
	const include = buildInclude(params);
	const { limit, offset } = buildPaging(params.page, params.limit);

	const { count, rows } = await Test.findAndCountAll({
		where,
		include,
		order: [['created_at', 'DESC']],
		limit,
		offset,
		distinct: true,
	});

	return {
		tests: rows,
		total: count,
		page: parseInt(params.page || 1),
		limit: parseInt(params.limit || 20),
		totalPages: Math.ceil(count / (params.limit || 20)),
	};
};

const getTestById = async (testId) => {
	return await Test.findByPk(testId, {
		include: [{
			model: Tag,
			as: 'tags',
			through: { attributes: [] },
			attributes: ['tag_id', 'tag_name'],
		}],
	});
};

const createTest = async (testData) => {
	const { tags, ...info } = testData;
	const test = await Test.create(info);
	if (Array.isArray(tags) && tags.length > 0) {
		const rows = tags.map((tagId) => ({ test_id: test.test_id, tag_id: tagId }));
		await TestTag.bulkCreate(rows);
	}
	return await getTestById(test.test_id);
};

const updateTest = async (testId, updateData) => {
	const { tags, ...info } = updateData;
	const [updated] = await Test.update(info, { where: { test_id: testId } });
	if (!updated) return false;
	if (tags !== undefined) {
		await TestTag.destroy({ where: { test_id: testId } });
		if (Array.isArray(tags) && tags.length > 0) {
			const rows = tags.map((tagId) => ({ test_id: testId, tag_id: tagId }));
			await TestTag.bulkCreate(rows);
		}
	}
	return true;
};

const deleteTest = async (testId) => {
	await TestTag.destroy({ where: { test_id: testId } });
	const deleted = await Test.destroy({ where: { test_id: testId } });
	return deleted > 0;
};

// Tags
const getAllTags = async () => {
	return await Tag.findAll({ order: [['tag_name', 'ASC']] });
};

const getTagById = async (tagId) => {
	return await Tag.findByPk(tagId);
};

const createTag = async (tagData) => {
	return await Tag.create(tagData);
};

const updateTag = async (tagId, updateData) => {
	const [updated] = await Tag.update(updateData, { where: { tag_id: tagId } });
	return updated > 0;
};

const deleteTag = async (tagId) => {
	await TestTag.destroy({ where: { tag_id: tagId } });
	const deleted = await Tag.destroy({ where: { tag_id: tagId } });
	return deleted > 0;
};

// Relations
const getTestTags = async (testId) => {
	const test = await Test.findByPk(testId, {
		include: [{ model: Tag, as: 'tags', through: { attributes: [] }, attributes: ['tag_id', 'tag_name'] }],
	});
	return test ? test.tags : [];
};

const addTagToTest = async (testId, tagId) => {
	const exists = await TestTag.findOne({ where: { test_id: testId, tag_id: tagId } });
	if (exists) return true;
	await TestTag.create({ test_id: testId, tag_id: tagId });
	return true;
};

const removeTagFromTest = async (testId, tagId) => {
	const deleted = await TestTag.destroy({ where: { test_id: testId, tag_id: tagId } });
	return deleted > 0;
};

// Search/Filter
const searchTests = async (params) => {
	return await getAllTests(params);
};

const filterTests = async (params) => {
	const where = buildWhere(params);
	const { limit, offset } = buildPaging(params.page, params.limit);

	const include = [{
		model: Tag,
		as: 'tags',
		through: { attributes: [] },
		attributes: ['tag_id', 'tag_name'],
	}];
	if (params.tag_id) include[0].where = { tag_id: params.tag_id };

	const { count, rows } = await Test.findAndCountAll({
		where,
		include,
		order: [['created_at', 'DESC']],
		limit,
		offset,
		distinct: true,
	});

	return {
		tests: rows,
		total: count,
		page: parseInt(params.page || 1),
		limit: parseInt(params.limit || 20),
		totalPages: Math.ceil(count / (params.limit || 20)),
	};
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


