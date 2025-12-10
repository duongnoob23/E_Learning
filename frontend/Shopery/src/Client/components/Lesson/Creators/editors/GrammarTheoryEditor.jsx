// GrammarTheoryEditor.jsx - Editor cho Grammar Theory với Rich Text Editor
// Sử dụng React Quill để hỗ trợ table, image, link
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import GrammarTheory from "../../Grammar/GrammarTheory";
import "./GrammarTheoryEditor.css";

// Editor cho từng section (dùng TipTap để tránh lỗi findDOMNode của React 19)
const SectionEditor = ({ value, onChange, placeholder, allowExample = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const btn = (label, action, active = false) => (
    <button
      type="button"
      className={`gte-toolbar-btn ${active ? "active" : ""}`}
      onClick={action}
    >
      {label}
    </button>
  );

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Nhập URL", editor.getAttributes("link").href || "");
    if (url === null) return;
    if (url === "") return editor.chain().focus().unsetLink().run();
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };

  const addImage = () => {
    const url = window.prompt("Nhập URL hình ảnh");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addTable = () => {
    const r = parseInt(window.prompt("Số hàng (2-6)?", "2"), 10);
    const c = parseInt(window.prompt("Số cột (2-6)?", "2"), 10);
    const rows = isNaN(r) ? 2 : Math.min(Math.max(r, 2), 6);
    const cols = isNaN(c) ? 2 : Math.min(Math.max(c, 2), 6);
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  const addExampleBlock = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="example-block"><strong>Ví dụ:</strong><p>EN: ...</p><p>VI: ...</p></div><p></p>`
      )
      .run();
  };

  return (
    <div className="gte-tiptap-wrapper">
      <div className="gte-toolbar">
        {btn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {btn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {btn("•", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {btn("1.", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {btn("Link", addLink, editor.isActive("link"))}
        {btn("Ảnh", addImage)}
        {btn("Table", addTable)}
        {allowExample && btn("Ví dụ", addExampleBlock)}
        {btn("⟳", () => editor.chain().focus().undo().run())}
        {btn("⟲", () => editor.chain().focus().redo().run())}
      </div>
      <div className="gte-tiptap-editor" data-placeholder={placeholder}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

// Trang trắng: TipTap một khối, có nút chèn block "Ví dụ"
const PageEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const btn = (label, action, active = false) => (
    <button
      type="button"
      className={`gte-toolbar-btn ${active ? "active" : ""}`}
      onClick={action}
    >
      {label}
    </button>
  );

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Nhập URL", editor.getAttributes("link").href || "");
    if (url === null) return;
    if (url === "") return editor.chain().focus().unsetLink().run();
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };

  const addImage = () => {
    const url = window.prompt("Nhập URL hình ảnh");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addTable = () => {
    const r = parseInt(window.prompt("Số hàng (2-6)?", "2"), 10);
    const c = parseInt(window.prompt("Số cột (2-6)?", "2"), 10);
    const rows = isNaN(r) ? 2 : Math.min(Math.max(r, 2), 6);
    const cols = isNaN(c) ? 2 : Math.min(Math.max(c, 2), 6);
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  const addExampleBlock = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<div class="example-block"><strong>Ví dụ:</strong><p>EN: ...</p><p>VI: ...</p></div><p></p>`
      )
      .run();
  };

  return (
    <div className="gte-tiptap-wrapper">
      <div className="gte-toolbar">
        {btn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {btn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {btn("•", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {btn("1.", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {btn("Link", addLink, editor.isActive("link"))}
        {btn("Ảnh", addImage)}
        {btn("Table", addTable)}
        {btn("Ví dụ", addExampleBlock)}
        {btn("⟳", () => editor.chain().focus().undo().run())}
        {btn("⟲", () => editor.chain().focus().redo().run())}
      </div>
      <div className="gte-tiptap-editor page" data-placeholder="Nhập toàn bộ lý thuyết tại đây...">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default function GrammarTheoryEditor({ data, onChange }) {
  const [editorMode, setEditorMode] = useState("structured"); // "structured" | "page"
  const [pageContent, setPageContent] = useState("<p></p>");
  const [sections, setSections] = useState([]); // [{ id, title, content }]
  const [examples, setExamples] = useState([]); // [{ id, en, vi }]
  const [showPreview, setShowPreview] = useState(false);
  const isInitialMount = useRef(true);

  // Khởi tạo và load data
  useEffect(() => {
    // mode
    if (data && data.mode === "page") {
      setEditorMode("page");
      setPageContent(data.content_html || "<p></p>");
    } else {
      setEditorMode("structured");
    }

    // sections
    if (
      data &&
      data.sections &&
      Array.isArray(data.sections) &&
      data.sections.length > 0
    ) {
      const seenSectionIds = new Set();
      const loadedSections = data.sections.map((section, index) => {
        let id = section.id || Date.now() + index + Math.random();
        while (seenSectionIds.has(id)) {
          id = Date.now() + index + Math.random();
        }
        seenSectionIds.add(id);
        return {
          id: id,
          title: section.title || "",
          content: section.content || "",
          order: section.order || index + 1,
        };
      });
      setSections(loadedSections);
    }
    if (data && data.examples && Array.isArray(data.examples)) {
      const seenExampleIds = new Set();
      setExamples(
        data.examples.map((ex, index) => {
          let id = ex.id || Date.now() + index + 1000 + Math.random();
          while (seenExampleIds.has(id)) {
            id = Date.now() + index + 1000 + Math.random();
          }
          seenExampleIds.add(id);
          return {
            id: id,
            en: ex.en || "",
            vi: ex.vi || "",
          };
        })
      );
    }
    isInitialMount.current = false;
  }, [data]);

  // Nếu chuyển sang structured mà chưa có section -> thêm 1 section mặc định
  useEffect(() => {
    if (!isInitialMount.current && editorMode === "structured" && sections.length === 0) {
      handleAddSection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    if (editorMode === "page") {
      onChange({
        type: "grammar_theory",
        mode: "page",
        content_html: pageContent,
        sections: [],
        examples: [],
      });
    } else {
      onChange({
        type: "grammar_theory",
        mode: "structured",
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, examples, pageContent, editorMode]); // Bỏ onChange để tránh vòng lặp

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

  // Validate
  const validate = () => {
    if (editorMode === "page") {
      if (!pageContent || pageContent.replace(/<[^>]+>/g, "").trim() === "") {
        return ["Nội dung trống"];
      }
      return [];
    }
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
    if (editorMode === "page") {
      return {
        title: "Grammar Theory Preview",
        lesson_data: {
          type: "grammar_theory",
          content_html: pageContent,
        },
      };
    }
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
        <div className="gte-title-row">
          <h3 className="gte-title">Grammar Theory</h3>
          <div className="gte-mode-toggle">
            <button
              className={`gte-mode-btn ${
                editorMode === "structured" ? "active" : ""
              }`}
              onClick={() => setEditorMode("structured")}
            >
              Chia Section
            </button>
            <button
              className={`gte-mode-btn ${editorMode === "page" ? "active" : ""}`}
              onClick={() => setEditorMode("page")}
            >
              Trang trắng
            </button>
          </div>
        </div>
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

          {editorMode === "page" ? (
            <>
              <div className="gte-label" style={{ marginBottom: 8 }}>
                Trang trắng (toàn bộ nội dung)
              </div>
              <PageEditor value={pageContent} onChange={setPageContent} />
            </>
          ) : (
            <>
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
                                handleSectionTitleChange(
                                  section.id,
                                  e.target.value
                                )
                              }
                              className="gte-input"
                              placeholder="Ví dụ: Định nghĩa"
                            />
                          </div>

                          {/* Content - Rich Text Editor (TipTap) */}
                          <div className="gte-section-field">
                            <label className="gte-label">
                              Content <span className="required">*</span>
                            </label>
                            <SectionEditor
                              value={section.content}
                              onChange={(value) =>
                                handleSectionContentChange(section.id, value)
                              }
                              placeholder="Nhập nội dung lý thuyết... (hỗ trợ bảng, hình ảnh, link)"
                              allowExample
                            />
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
            </>
          )}

          {/* Hint */}
          <div className="gte-hint">
            💡 <strong>Mẹo:</strong> Dùng toolbar để chèn bảng, hình ảnh, link,
            block Ví dụ (ở chế độ Trang trắng dùng nút “Ví dụ”).
          </div>
        </>
      )}
    </div>
  );
}
