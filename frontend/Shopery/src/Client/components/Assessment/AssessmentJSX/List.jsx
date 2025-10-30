import React from "react";
import { useUserStatistics } from "../../../services/Assessment/assessmentQueries";
import "../AssessmentCSS/List.css";
import Card from "./Card";

const List = (Props) => {
  const { data } = Props;

  // Lấy thống kê người dùng để kiểm tra các session đã hoàn thành
  const { data: userStatsData, isLoading: userStatsLoading } =
    useUserStatistics();

  console.log("statistical", userStatsData);

  // Tạo map các test đã hoàn thành từ recent_sessions
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

  if (userStatsLoading) {
    return <div className="assessment-list">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="assessment-list">
      {data &&
        data.DT.tests.map((assessment) => {
          const isCompleted = completedTests.has(assessment.test_id);
          console.log(assessment);
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

// import React from "react";

// import "../AssessmentCSS/List.css";
// import Card from "./Card";

// const data1 = Array.from({ length: 12 }).map((_, i) => ({
//   id: i + 1,
//   title: `New Economy TOEIC Test ${i + 1}`,
//   duration: "120 phút",
//   users: Math.floor(Math.random() * 1000000),
//   questions: 200,
//   parts: 7,
// }));

// const List = (Props) => {
//   const { data } = Props;

//   return (
//     <div className="assessment-list">
//       {data &&
//         data.DT.tests.map((assessment) => (
//           <Card
//             key={assessment.test_id}
//             exam={assessment}
//             id={assessment.test_id}
//           />
//         ))}
//     </div>
//   );
// };

// export default List;
