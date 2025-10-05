import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import examApi from '../../api/Exam/examApi';
import examSessionApi from '../../api/Exam/examSessionApi';

export const examKeys = {
	all: ['exams'],
	tests: () => [...examKeys.all, 'tests'],
	testsList: (params) => [...examKeys.tests(), 'list', params],
	testDetail: (testId) => [...examKeys.tests(), 'detail', testId],
	tags: () => [...examKeys.all, 'tags'],
	tagsList: () => [...examKeys.tags(), 'list'],
	tagDetail: (tagId) => [...examKeys.tags(), 'detail', tagId],
	testTags: (testId) => [...examKeys.tests(), 'tags', testId],
	searchTests: (params) => [...examKeys.tests(), 'search', params],
	filterTests: (params) => [...examKeys.tests(), 'filter', params],
	// Exam Detail
	examDetail: (testId) => [...examKeys.tests(), 'examDetail', testId],
	userExamHistory: (params) => [...examKeys.all, 'userExamHistory', params],
	// Exam Session
	sessionQuestions: (userTestId) => [...examKeys.all, 'sessionQuestions', userTestId],
	sessionResult: (userTestId) => [...examKeys.all, 'sessionResult', userTestId],
};

// Tests
export const useTests = (params = {}) => {
	return useQuery({
		queryKey: examKeys.testsList(params),
		queryFn: () => examApi.getAllTests(params),
		staleTime: 2 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tải danh sách bài kiểm tra'),
	});
};

export const useTest = (testId) => {
	return useQuery({
		queryKey: examKeys.testDetail(testId),
		queryFn: () => examApi.getTestById(testId),
		enabled: !!testId,
		staleTime: 2 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tải thông tin bài kiểm tra'),
	});
};

export const useCreateTest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (testData) => examApi.createTest(testData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examKeys.tests() });
			toast.success('Tạo bài kiểm tra thành công');
		},
		onError: () => toast.error('Không thể tạo bài kiểm tra'),
	});
};

export const useUpdateTest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId, updateData }) => examApi.updateTest(testId, updateData),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: examKeys.tests() });
			queryClient.invalidateQueries({ queryKey: examKeys.testDetail(variables.testId) });
			toast.success('Cập nhật bài kiểm tra thành công');
		},
		onError: () => toast.error('Không thể cập nhật bài kiểm tra'),
	});
};

export const useDeleteTest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (testId) => examApi.deleteTest(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examKeys.tests() });
			toast.success('Xóa bài kiểm tra thành công');
		},
		onError: () => toast.error('Không thể xóa bài kiểm tra'),
	});
};

// Tags
export const useTags = () => {
	return useQuery({
		queryKey: examKeys.tagsList(),
		queryFn: () => examApi.getAllTags(),
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tải danh sách thẻ'),
	});
};

export const useTestTags = (testId) => {
	return useQuery({
		queryKey: examKeys.testTags(testId),
		queryFn: () => examApi.getTestTags(testId),
		enabled: !!testId,
		staleTime: 2 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tải thẻ của bài kiểm tra'),
	});
};

export const useAddTagToTest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId, tagId }) => examApi.addTagToTest(testId, tagId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: examKeys.testTags(variables.testId) });
			queryClient.invalidateQueries({ queryKey: examKeys.testDetail(variables.testId) });
			toast.success('Thêm thẻ vào bài kiểm tra thành công');
		},
		onError: () => toast.error('Không thể thêm thẻ vào bài kiểm tra'),
	});
};

export const useRemoveTagFromTest = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId, tagId }) => examApi.removeTagFromTest(testId, tagId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: examKeys.testTags(variables.testId) });
			queryClient.invalidateQueries({ queryKey: examKeys.testDetail(variables.testId) });
			toast.success('Xóa thẻ khỏi bài kiểm tra thành công');
		},
		onError: () => toast.error('Không thể xóa thẻ khỏi bài kiểm tra'),
	});
};

// Search / Filter
export const useSearchTests = (params = {}) => {
	return useQuery({
		queryKey: examKeys.searchTests(params),
		queryFn: () => examApi.searchTests(params),
		enabled: !!params.q,
		staleTime: 60 * 1000,
		cacheTime: 3 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tìm kiếm bài kiểm tra'),
	});
};

export const useFilterTests = (params = {}) => {
	return useQuery({
		queryKey: examKeys.filterTests(params),
		queryFn: () => examApi.filterTests(params),
		staleTime: 2 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể lọc bài kiểm tra'),
	});
};

// Exam Detail Hooks
export const useExamDetail = (testId) => {
	return useQuery({
		queryKey: examKeys.examDetail(testId),
		queryFn: () => examApi.getExamDetail(testId),
		enabled: !!testId,
		staleTime: 2 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tải thông tin chi tiết bài kiểm tra'),
	});
};

export const useStartExam = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId, sessionId }) => examApi.startExam(testId, sessionId),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: examKeys.examDetail(variables.testId) });
			queryClient.invalidateQueries({ queryKey: examKeys.userExamHistory() });
			toast.success('Bắt đầu làm bài thành công');
		},
		onError: (error) => {
			const message = error?.response?.data?.EM || 'Không thể bắt đầu làm bài';
			toast.error(message);
		},
	});
};

export const useSaveExamProgress = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userTestId, remainingTime, currentSection, answers }) => 
			examApi.saveExamProgress(userTestId, remainingTime, currentSection, answers),
		onSuccess: (_data, variables) => {
			// Invalidate exam detail để cập nhật remaining time
			queryClient.invalidateQueries({ queryKey: examKeys.examDetail() });
		},
		onError: () => toast.error('Không thể lưu tiến độ'),
	});
};

export const useSubmitExam = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userTestId, score, answers }) => 
			examApi.submitExam(userTestId, score, answers),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examKeys.userExamHistory() });
			queryClient.invalidateQueries({ queryKey: examKeys.examDetail() });
			toast.success('Nộp bài thành công');
		},
		onError: () => toast.error('Không thể nộp bài'),
	});
};

export const useAbandonExam = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userTestId) => examApi.abandonExam(userTestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examKeys.userExamHistory() });
			queryClient.invalidateQueries({ queryKey: examKeys.examDetail() });
			toast.success('Đã bỏ dở bài thi');
		},
		onError: () => toast.error('Không thể bỏ dở bài thi'),
	});
};

export const useUserExamHistory = (params = {}) => {
	return useQuery({
		queryKey: examKeys.userExamHistory(params),
		queryFn: () => examApi.getUserExamHistory(params),
		staleTime: 1 * 60 * 1000,
		cacheTime: 3 * 60 * 1000,
		retry: 2,
		onError: () => toast.error('Không thể tải lịch sử làm bài'),
	});
};

// Exam Session Hooks
export const useStartPracticeSession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId, sectionIds, timeLimit }) => 
			examSessionApi.startPracticeSession(testId, sectionIds, timeLimit),
		onSuccess: () => {
			// Không cần invalidate userExamHistory ngay lập tức
			toast.success('Bắt đầu luyện tập thành công');
		},
		onError: (error) => {
			const message = error?.response?.data?.EM || 'Không thể bắt đầu luyện tập';
			toast.error(message);
		},
	});
};

export const useStartFullTestSession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ testId }) => examSessionApi.startFullTestSession(testId),
		onSuccess: () => {
			// Không cần invalidate userExamHistory ngay lập tức
			toast.success('Bắt đầu làm full test thành công');
		},
		onError: (error) => {
			const message = error?.response?.data?.EM || 'Không thể bắt đầu làm full test';
			toast.error(message);
		},
	});
};

export const useSessionQuestions = (userTestId, sectionIds = null) => {
	return useQuery({
		queryKey: examKeys.sessionQuestions(userTestId),
		queryFn: () => examSessionApi.getSessionQuestions(userTestId, sectionIds),
		enabled: !!userTestId,
		staleTime: 30 * 1000, // 30 seconds
		cacheTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		onError: () => toast.error('Không thể tải câu hỏi'),
	});
};

export const useSaveAnswer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userTestId, questionId, answerData }) =>
			examSessionApi.saveAnswer(userTestId, questionId, answerData),
		onSuccess: (data, variables) => {
			// Invalidate session questions to update user answers
			queryClient.invalidateQueries({ 
				queryKey: examKeys.sessionQuestions(variables.userTestId) 
			});
		},
		onError: () => toast.error('Không thể lưu câu trả lời'),
	});
};

export const useSubmitSession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userTestId) => examSessionApi.submitSession(userTestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examKeys.userExamHistory() });
			toast.success('Nộp bài thành công');
		},
		onError: (error) => {
			const message = error?.response?.data?.EM || 'Không thể nộp bài';
			toast.error(message);
		},
	});
};

export const useSaveProgress = () => {
	return useMutation({
		mutationFn: ({ userTestId, remainingTime, currentQuestionId }) =>
			examSessionApi.saveProgress(userTestId, remainingTime, currentQuestionId),
		onError: () => toast.error('Không thể lưu tiến độ'),
	});
};

export const useAbandonSession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userTestId) => examSessionApi.abandonSession(userTestId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: examKeys.userExamHistory() });
			toast.success('Đã bỏ dở bài thi');
		},
		onError: () => toast.error('Không thể bỏ dở bài thi'),
	});
};

export const useSessionResult = (userTestId) => {
	return useQuery({
		queryKey: examKeys.sessionResult(userTestId),
		queryFn: () => examSessionApi.getSessionResult(userTestId),
		enabled: !!userTestId,
		staleTime: 2 * 60 * 1000, // 2 minutes
		cacheTime: 10 * 60 * 1000, // 10 minutes
		retry: 2,
		onError: () => toast.error('Không thể tải kết quả bài thi'),
	});
};
