// GrammarTheoryEditor.jsx - Editor cho Grammar Theory với Rich Text Editor
// Sử dụng React Quill để hỗ trợ table, image, link
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import GrammarTheory from "../../Grammar/GrammarTheory";
import "./GrammarTheoryEditor.css";

// Import quill-better-table
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
Quill.register({ "modules/better-table": QuillBetterTable }, true);

export default function GrammarTheoryEditor({ data, onChange }) {
  const [sections, setSections] = useState([]); // [{ id, title, content }]
  const [examples, setExamples] = useState([]); // [{ id, en, vi }]
  const [showPreview, setShowPreview] = useState(false);
  const quillRefs = useRef({});
  const isInitialMount = useRef(true);

  // Khởi tạo: không load data có sẵn, tạo section mới
  useEffect(() => {
    if (isInitialMount.current && sections.length === 0) {
      setSections([
        {
          id: Date.now(),
          title: "",
          content: "",
          order: 1,
        },
      ]);
      isInitialMount.current = false;
    }
  }, []);

  // Load data từ props
  useEffect(() => {
    if (
      data &&
      data.sections &&
      Array.isArray(data.sections) &&
      data.sections.length > 0
    ) {
      const loadedSections = data.sections.map((section, index) => ({
        id: section.id || Date.now() + index,
        title: section.title || "",
        content: section.content || "",
        order: section.order || index + 1,
      }));
      setSections(loadedSections);
    }
    if (data && data.examples && Array.isArray(data.examples)) {
      setExamples(
        data.examples.map((ex, index) => ({
          id: ex.id || Date.now() + index + 1000,
          en: ex.en || "",
          vi: ex.vi || "",
        }))
      );
    }
  }, [data]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    onChange({
      type: "grammar_theory",
      sections: sections
        .filter((s) => s.title.trim() || s.content.trim())
        .map((section) => ({
          id: section.id,
          title: section.title.trim(),
          content: section.content.trim(),
          order: section.order,
        })),
      examples: examples
        .filter((ex) => ex.en.trim() || ex.vi.trim())
        .map((example) => ({
          id: example.id,
          en: example.en.trim(),
          vi: example.vi.trim(),
        })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, examples]); // Bỏ onChange để tránh vòng lặp

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 300);

    return () => clearTimeout(timer);
  }, [sections, examples, updateData]);

  // Thêm section mới
  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      title: "",
      content: "",
      order: sections.length + 1,
    };
    setSections((prev) => [...prev, newSection]);
  };

  // Xóa section
  const handleRemoveSection = (sectionId) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  // Update section title
  const handleSectionTitleChange = (sectionId, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: value } : s))
    );
  };

  // Update section content (rich text)
  const handleSectionContentChange = (sectionId, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content: value } : s))
    );
  };

  // Thêm example
  const handleAddExample = () => {
    const newExample = {
      id: Date.now(),
      en: "",
      vi: "",
    };
    setExamples((prev) => [...prev, newExample]);
  };

  // Xóa example
  const handleRemoveExample = (exampleId) => {
    setExamples((prev) => prev.filter((ex) => ex.id !== exampleId));
  };

  // Update example
  const handleExampleChange = (exampleId, field, value) => {
    setExamples((prev) =>
      prev.map((ex) => (ex.id === exampleId ? { ...ex, [field]: value } : ex))
    );
  };

  // Quill modules configuration
  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["insertTable"], // Table button từ quill-better-table
        [{ align: [] }],
        ["clean"],
      ],
    },
    table: false, // Disable default table
    "better-table": {
      operationMenu: {
        items: {
          unmergeCells: {
            text: "Hợp nhất ô",
          },
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "table",
    "align",
  ];

  // Validate
  const validate = () => {
    const validSections = sections.filter(
      (s) => s.title.trim() && s.content.trim()
    );
    if (validSections.length === 0) {
      return ["Cần ít nhất 1 section có đầy đủ title và content"];
    }
    return [];
  };

  // Toggle preview
  const handleTogglePreview = () => {
    const errors = validate();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    setShowPreview(!showPreview);
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    return {
      title: "Grammar Theory Preview",
      lesson_data: {
        type: "grammar_theory",
        sections: sections
          .filter((s) => s.title.trim() && s.content.trim())
          .map((section) => ({
            id: section.id,
            title: section.title.trim(),
            content: section.content.trim(),
            order: section.order,
          })),
        examples: examples
          .filter((ex) => ex.en.trim() || ex.vi.trim())
          .map((example) => ({
            id: example.id,
            en: example.en.trim(),
            vi: example.vi.trim(),
          })),
      },
    };
  };

  const errors = validate();
  const isValid = errors.length === 0;

  return (
    <div className="grammar-theory-editor">
      {/* Header */}
      <div className="gte-header">
        <h3 className="gte-title">Grammar Theory</h3>
        <button
          className={`gte-preview-btn ${isValid ? "" : "disabled"}`}
          onClick={handleTogglePreview}
          disabled={!isValid}
        >
          {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
        </button>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="gte-preview-container">
          <div className="gte-preview-header">
            <span>Preview</span>
            <button
              className="gte-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="gte-preview-content">
            <GrammarTheory lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : (
        /* Editor mode */
        <>
          {/* Errors */}
          {errors.length > 0 && (
            <div className="gte-errors">
              {errors.map((error, idx) => (
                <span key={idx} className="gte-error">
                  ⚠️ {error}
                </span>
              ))}
            </div>
          )}

          {/* Sections */}
          <div className="gte-sections">
            <div className="gte-sections-header">
              <label className="gte-label">Sections</label>
              <button className="gte-add-btn" onClick={handleAddSection}>
                + Thêm section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="gte-empty">
                <p>Chưa có section nào. Nhấn "Thêm section" để bắt đầu.</p>
              </div>
            ) : (
              <div className="gte-sections-list">
                {sections.map((section, index) => (
                  <div key={section.id} className="gte-section-card">
                    <div className="gte-section-header">
                      <span className="gte-section-number">
                        Section #{index + 1}
                      </span>
                      <button
                        className="gte-section-remove"
                        onClick={() => handleRemoveSection(section.id)}
                        title="Xóa section"
                      >
                        🗑️ Xóa
                      </button>
                    </div>

                    <div className="gte-section-content">
                      {/* Title */}
                      <div className="gte-section-field">
                        <label className="gte-label">
                          Title <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            handleSectionTitleChange(section.id, e.target.value)
                          }
                          className="gte-input"
                          placeholder="Ví dụ: Định nghĩa"
                        />
                      </div>

                      {/* Content - Rich Text Editor */}
                      <div className="gte-section-field">
                        <label className="gte-label">
                          Content <span className="required">*</span>
                        </label>
                        <div className="gte-quill-wrapper">
                          <ReactQuill
                            ref={(el) => (quillRefs.current[section.id] = el)}
                            theme="snow"
                            value={section.content}
                            onChange={(value) =>
                              handleSectionContentChange(section.id, value)
                            }
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Nhập nội dung lý thuyết... (hỗ trợ bảng, hình ảnh, link)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Examples */}
          <div className="gte-examples">
            <div className="gte-examples-header">
              <label className="gte-label">Examples (tùy chọn)</label>
              <button className="gte-add-btn" onClick={handleAddExample}>
                + Thêm example
              </button>
            </div>

            {examples.length > 0 && (
              <div className="gte-examples-list">
                {examples.map((example, index) => (
                  <div key={example.id} className="gte-example-card">
                    <div className="gte-example-header">
                      <span className="gte-example-number">
                        Example #{index + 1}
                      </span>
                      <button
                        className="gte-example-remove"
                        onClick={() => handleRemoveExample(example.id)}
                        title="Xóa example"
                      >
                        ×
                      </button>
                    </div>

                    <div className="gte-example-content">
                      <input
                        type="text"
                        value={example.en}
                        onChange={(e) =>
                          handleExampleChange(example.id, "en", e.target.value)
                        }
                        className="gte-input"
                        placeholder="English"
                      />
                      <input
                        type="text"
                        value={example.vi}
                        onChange={(e) =>
                          handleExampleChange(example.id, "vi", e.target.value)
                        }
                        className="gte-input"
                        placeholder="Vietnamese"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hint */}
          <div className="gte-hint">
            💡 <strong>Mẹo:</strong> Sử dụng toolbar để chèn bảng, hình ảnh,
            link vào nội dung. Click vào icon bảng để tạo bảng mới.
          </div>
        </>
      )}
    </div>
  );
}
