import React from "react";
import Filter from "../../components/Assessment/AssessmentJSX/Filter";
import Layout from "../../components/Assessment/AssessmentJSX/Layout";
import List from "../../components/Assessment/AssessmentJSX/List";
import SearchBar from "../../components/Assessment/AssessmentJSX/SearchBar";
import Sidebar from "../../components/Assessment/AssessmentJSX/Sidebar";
import { useTests } from "../../services/Assessment/assessmentQueries";
import "./Assessment.css";

// 🍎🍊🍋🍉🍇🍓🥑🍍
const Assessment = () => {
  const { data: testsData, isLoading: testsLoading } = useTests();
  console.log("JSON", JSON.stringify(testsData, null, 2));
  return (
    <div className="assessment">
      <div className="assessment__title">Thư viện đề thi</div>
      <Layout
        left={
          <>
            <Filter />
            <SearchBar />
            <List data={testsData} />
          </>
        }
        right={<Sidebar />}
      />
    </div>
  );
};

export default Assessment;
