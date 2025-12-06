// GrammarTheory.jsx - Lý thuyết ngữ pháp
import React, { useState } from "react";
import "./GrammarTheory.css";

export default function GrammarTheory({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const sections = lessonData.sections || [];
  const examples = lessonData.examples || [];

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



