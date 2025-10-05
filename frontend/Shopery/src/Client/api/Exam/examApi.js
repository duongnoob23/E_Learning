import axiosInstance from '../../../lib/axiosInstance';

const examApi = {
	getAllTests: async (params = {}) => {
		const { page = 1, limit = 20, test_type, course_id, search } = params;
		const response = await axiosInstance.get('/exam/tests', {
			params: { page, limit, test_type, course_id, search },
		});
		return response.data;
	},

	getTestById: async (testId) => {
		const response = await axiosInstance.get(`/exam/tests/${testId}`);
		return response.data;
	},

	createTest: async (testData) => {
		const response = await axiosInstance.post('/exam/tests', testData);
		return response.data;
	},

	updateTest: async (testId, updateData) => {
		const response = await axiosInstance.put(`/exam/tests/${testId}`, updateData);
		return response.data;
	},

	deleteTest: async (testId) => {
		const response = await axiosInstance.delete(`/exam/tests/${testId}`);
		return response.data;
	},

	// Tags
	getAllTags: async () => {
		const response = await axiosInstance.get('/exam/tags');
		return response.data;
	},

	getTagById: async (tagId) => {
		const response = await axiosInstance.get(`/exam/tags/${tagId}`);
		return response.data;
	},

	createTag: async (tagData) => {
		const response = await axiosInstance.post('/exam/tags', tagData);
		return response.data;
	},

	updateTag: async (tagId, updateData) => {
		const response = await axiosInstance.put(`/exam/tags/${tagId}`, updateData);
		return response.data;
	},

	deleteTag: async (tagId) => {
		const response = await axiosInstance.delete(`/exam/tags/${tagId}`);
		return response.data;
	},

	// Relations
	getTestTags: async (testId) => {
		const response = await axiosInstance.get(`/exam/tests/${testId}/tags`);
		return response.data;
	},

	addTagToTest: async (testId, tagId) => {
		const response = await axiosInstance.post(`/exam/tests/${testId}/tags/${tagId}`);
		return response.data;
	},

	removeTagFromTest: async (testId, tagId) => {
		const response = await axiosInstance.delete(`/exam/tests/${testId}/tags/${tagId}`);
		return response.data;
	},

	// Search / Filter
	searchTests: async (params = {}) => {
		const { q, test_type, course_id, page = 1, limit = 20 } = params;
		const response = await axiosInstance.get('/exam/tests/search', {
			params: { q, test_type, course_id, page, limit },
		});
		return response.data;
	},

	filterTests: async (params = {}) => {
		const { test_type, course_id, tag_id, page = 1, limit = 20 } = params;
		const response = await axiosInstance.get('/exam/tests/filter', {
			params: { test_type, course_id, tag_id, page, limit },
		});
		return response.data;
	},

	// Exam Detail APIs
	getExamDetail: async (testId) => {
		const response = await axiosInstance.get(`/exam/tests/${testId}/detail`);
		return response.data;
	},

	startExam: async (testId, sessionId = null) => {
		const response = await axiosInstance.post(`/exam/tests/${testId}/start`, {
			sessionId
		});
		return response.data;
	},

	saveExamProgress: async (userTestId, remainingTime, currentSection = null, answers = null) => {
		const response = await axiosInstance.put('/exam/save-progress', {
			userTestId,
			remainingTime,
			currentSection,
			answers
		});
		return response.data;
	},

	submitExam: async (userTestId, score, answers = null) => {
		const response = await axiosInstance.post('/exam/submit', {
			userTestId,
			score,
			answers
		});
		return response.data;
	},

	abandonExam: async (userTestId) => {
		const response = await axiosInstance.post('/exam/abandon', {
			userTestId
		});
		return response.data;
	},

	getUserExamHistory: async (params = {}) => {
		const { page = 1, limit = 10, status, test_type } = params;
		const response = await axiosInstance.get('/exam/history', {
			params: { page, limit, status, test_type }
		});
		return response.data;
	},
};

export default examApi;
