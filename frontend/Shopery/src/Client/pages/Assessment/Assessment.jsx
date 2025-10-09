import React from "react";
import "./Assessment.css";
import AssessmentLayout from "../../components/Assessment/AssessmentJSX/AssessmentLayout";
import AssessmentFilter from "../../components/Assessment/AssessmentJSX/AssessmentFilter";
import AssessmentSearchBar from "../../components/Assessment/AssessmentJSX/AssessmentSearchBar";
import AssessmentList from "../../components/Assessment/AssessmentJSX/AssessmentList";
import AssessmentSidebar from "../../components/Assessment/AssessmentJSX/AssessmentSidebar";

const Assessment = () => {
  return (
    <div className="assessment">
      <div className="assessment__title">Thư viện đề thi</div>
      <AssessmentLayout
        left={
          <>
            <AssessmentFilter />
            <AssessmentSearchBar />
            <AssessmentList />
          </>
        }
        right={<AssessmentSidebar />}
      />
    </div>
  );
};

export default Assessment;
