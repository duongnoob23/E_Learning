import { useQuery } from "@tanstack/react-query";
import { examAdminApi } from "../api/examAdminApi";

// Query keys scoped to admin exam
export const adminExamKeys = {
  all: ["admin", "exam"],
  tests: () => [...adminExamKeys.all, "tests"],
  testList: () => [...adminExamKeys.tests(), "list"],
  testDetail: (id) => [...adminExamKeys.tests(), "detail", id],
  sessions: (testId) => [...adminExamKeys.testDetail(testId), "sessions"],
  sessionDetail: (sessionId) => [...adminExamKeys.all, "session", sessionId],
  statistics: (testId) => [...adminExamKeys.testDetail(testId), "statistics"],
};

// List tests
export const useAdminTests = () =>
  useQuery({
    queryKey: ["ListExamsAdmin"],
    queryFn: examAdminApi.getTests,
    staleTime: 5 * 60 * 1000,
  });

// Test detail
export const useAdminTestDetail = (testId, enabled = true) =>
  useQuery({
    queryKey: adminExamKeys.testDetail(testId),
    queryFn: () => examAdminApi.getTestDetail(testId),
    enabled: enabled && !!testId,
    staleTime: 5 * 60 * 1000,
  });

// Sessions list for a test
export const useAdminTestSessions = (testId, enabled = true) =>
  useQuery({
    queryKey: adminExamKeys.sessions(testId),
    queryFn: () => examAdminApi.getTestSessions(testId),
    enabled: enabled && !!testId,
    staleTime: 5 * 60 * 1000,
  });

// One session detail
export const useAdminExamSessionDetail = (sessionId, enabled = true) =>
  useQuery({
    queryKey: adminExamKeys.sessionDetail(sessionId),
    queryFn: () => examAdminApi.getExamSessionDetail(sessionId),
    enabled: enabled && !!sessionId,
    staleTime: 5 * 60 * 1000,
  });

// Statistics for a test
export const useAdminTestStatistics = (testId, enabled = true) =>
  useQuery({
    queryKey: adminExamKeys.statistics(testId),
    queryFn: () => examAdminApi.getTestStatistics(testId),
    enabled: enabled && !!testId,
    staleTime: 5 * 60 * 1000,
  });
