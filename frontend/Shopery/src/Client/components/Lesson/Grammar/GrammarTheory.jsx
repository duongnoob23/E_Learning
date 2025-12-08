// GrammarTheory.jsx - Lý thuyết ngữ pháp
import React from "react";
import "./GrammarTheory.css";
import GrammarTheoryEditor from "../Editors/GrammarTheoryEditor";

export default function GrammarTheory({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const sections = lessonData.sections || [];
  const examples = lessonData.examples || [];
  const editable = lessonData.editable || false;
  const contentHtml = lessonData.content_html || "";

  // Nếu có content_html (chế độ trang trắng) thì render trực tiếp
  if (!editable && contentHtml) {
    return (
      <div className="grammar-theory-container">
        <h3>{lesson.title}</h3>
        <div
          className="grammar-theory-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    );
  }

  const initialHtml =
    contentHtml ||
    sections
      .map(
        (s) => `
        <h2>${s.title || ""}</h2>
        ${s.content || ""}
      `
      )
      .join("");

  if (editable) {
    return (
      <div className="grammar-theory-container">
        <h3>{lesson.title}</h3>
        <GrammarTheoryEditor
          initialContent={initialHtml || "<p>Nhập nội dung lý thuyết...</p>"}
          examples={examples}
        />
      </div>
    );
  }

  return (
    <div className="grammar-theory-container">
      <h3>{lesson.title}</h3>

      <div className="grammar-theory-content">
        {sections.map((section, index) => (
          <div key={index} className="grammar-theory-section">
            <h4 className="grammar-theory-section-title">{section.title}</h4>
            <div
              className="grammar-theory-section-content"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}

        {examples.length > 0 && (
          <div className="grammar-theory-examples">
            <h4 className="grammar-theory-examples-title">Ví dụ:</h4>
            {examples.map((example, index) => (
              <div key={index} className="grammar-theory-example">
                <p className="grammar-theory-example-en">
                  <strong>EN:</strong> {example.en}
                </p>
                <p className="grammar-theory-example-vi">
                  <strong>VI:</strong> {example.vi}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
