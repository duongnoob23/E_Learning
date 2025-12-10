import React, { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import "./GrammarTheoryEditor.css";

export default function GrammarTheoryEditor({ initialContent = "<p></p>", examples = [] }) {
  const [html, setHtml] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    autofocus: false,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const addImage = useCallback(() => {
    const url = window.prompt("Nhập URL hình ảnh");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Nhập URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url, target: "_blank" }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();
  }, [editor]);

  const menuButton = (label, action, isActive = false) => (
    <button
      type="button"
      className={`gt-editor-btn ${isActive ? "active" : ""}`}
      onClick={action}
    >
      {label}
    </button>
  );

  return (
    <div className="gt-editor-container">
      <div className="gt-toolbar">
        {menuButton(
          "B",
          () => editor?.chain().focus().toggleBold().run(),
          editor?.isActive("bold")
        )}
        {menuButton(
          "I",
          () => editor?.chain().focus().toggleItalic().run(),
          editor?.isActive("italic")
        )}
        {menuButton(
          "H1",
          () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
          editor?.isActive("heading", { level: 1 })
        )}
        {menuButton(
          "H2",
          () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          editor?.isActive("heading", { level: 2 })
        )}
        {menuButton(
          "•",
          () => editor?.chain().focus().toggleBulletList().run(),
          editor?.isActive("bulletList")
        )}
        {menuButton(
          "1.",
          () => editor?.chain().focus().toggleOrderedList().run(),
          editor?.isActive("orderedList")
        )}
        {menuButton(
          "Link",
          addLink,
          editor?.isActive("link")
        )}
        {menuButton("Ảnh", addImage)}
        {menuButton("Table", addTable)}
        {menuButton("⟳", () => editor?.chain().focus().undo().run())}
        {menuButton("⟲", () => editor?.chain().focus().redo().run())}
      </div>

      <div className="gt-editor">
        <EditorContent editor={editor} />
      </div>

      {examples.length > 0 && (
        <div className="gt-examples">
          <h4>Ví dụ:</h4>
          {examples.map((ex, idx) => (
            <div key={idx} className="gt-example">
              <p><strong>EN:</strong> {ex.en}</p>
              <p><strong>VI:</strong> {ex.vi}</p>
            </div>
          ))}
        </div>
      )}

      <div className="gt-html-preview">
        <h4>HTML xuất ra</h4>
        <div className="gt-html-box" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

