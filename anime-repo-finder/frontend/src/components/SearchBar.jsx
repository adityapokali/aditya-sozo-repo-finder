export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <span className="search-rune">⛩</span>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search repositories… e.g. ramen, vite, neovim"
        aria-label="Search GitHub repositories"
      />
    </div>
  );
}
