import React from "react";
import { useUserStatistics } from "../../../services/Assessment/assessmentQueries";
import "../AssessmentCSS/List.css";
import Card from "./Card";

const List = (Props) => {
  const { data: tests, isLoading } = Props;

  const { data: userStatsData, isLoading: userStatsLoading } =
    useUserStatistics();

  const completedTests = React.useMemo(() => {
    if (!userStatsData?.DT?.recent_sessions) return new Set();

    const completed = new Set();
    userStatsData.DT.recent_sessions.forEach((session) => {
      if (session.status === "COMPLETED") {
        completed.add(session.test_id);
      }
    });
    return completed;
  }, [userStatsData]);

  if (userStatsLoading || isLoading) {
    return <div className="assessment-list">Đang tải dữ liệu...</div>;
  }

  if (!tests || tests.length === 0) {
    return <div className="assessment-list">Không tìm thấy bài thi nào phù hợp.</div>;
  }

  return (
    <div className="assessment-list">
      {tests.map((assessment) => {
        const isCompleted = completedTests.has(assessment.test_id);
        return (
          <Card
            key={assessment.test_id}
            exam={assessment}
            id={assessment.test_id}
            isCompleted={isCompleted}
            userStats={userStatsData?.DT}
          />
        );
      })}
    </div>
  );
};

export default List;
