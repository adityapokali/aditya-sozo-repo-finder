const LANGUAGES = [
  "", "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin"
];

const SORTS = [
  { value: "stars", label: "Most stars" },
  { value: "forks", label: "Most forks" },
  { value: "updated", label: "Recently updated" },
];

export default function FilterBar({ language, setLanguage, sort, setSort }) {
  return (
    <div className="filter-bar">
      <label className="filter-field">
        <span>Language</span>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option key={lang || "any"} value={lang}>
              {lang || "Any language"}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Sort by</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
