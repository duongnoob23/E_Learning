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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");

  const filteredTests = React.useMemo(() => {
    if (!testsData?.DT?.tests) return [];

    return testsData.DT.tests.filter((test) => {
      const matchesSearch = test.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Tất cả" ||
        test.exam_type?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [testsData, searchQuery, selectedCategory]);

  return (
    <div className="assessment">
      <div className="assessment__title">Thư viện đề thi</div>
      <Layout
        left={
          <>
            {/* <Filter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            /> */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <List
              data={filteredTests}
              isLoading={testsLoading}
            />
          </>
        }
      // right={<Sidebar />}
      />
    </div>
  );
};

export default Assessment;
