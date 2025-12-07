export default function DictionaryTabs({ value, onChange }) {
  const tabs = [
    { key: "en-vi", label: "Anh - Việt" },
    { key: "vi-en", label: "Việt - Anh" },
  ];

  return (
    <div className="dict-tabs">
      {tabs.map(t => (
        <button
          key={t.key}
          className={value === t.key ? "active" : ""}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
