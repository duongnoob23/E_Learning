import React from "react";

import "../AssessmentCSS/List.css";
import Card from "./Card";

const data1 = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `New Economy TOEIC Test ${i + 1}`,
  duration: "120 phút",
  users: Math.floor(Math.random() * 1000000),
  questions: 200,
  parts: 7,
}));

const List = (Props) => {
  const { data } = Props;

  return (
    <div className="assessment-list">
      {data &&
        data.DT.tests.map((assessment) => (
          <Card
            key={assessment.test_id}
            exam={assessment}
            id={assessment.test_id}
          />
        ))}
    </div>
  );
};

export default List;
