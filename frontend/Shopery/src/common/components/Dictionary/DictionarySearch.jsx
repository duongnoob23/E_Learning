export default function DictionarySearch({ value, onChange }) {
  return (
    <div className="dict-search">
      <input
        value={value}
        placeholder="Nhập từ cần tra"
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onChange(value.trim())}
      />
    </div>
  );
}
