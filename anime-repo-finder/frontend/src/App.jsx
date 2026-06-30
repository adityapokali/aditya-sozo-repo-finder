import { useState, useEffect, useCallback, useRef } from "react";
import SearchBar from "./components/SearchBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import RepoGrid from "./components/RepoGrid.jsx";
import Petals from "./components/Petals.jsx";
import "./App.css";

const API_BASE = "/api/search/";

export default function App() {
  const [query, setQuery] = useState("react");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("stars");
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);

  const runSearch = useCallback(async (q, lang, sortBy) => {
    if (!q.trim()) {
      setResults([]);
      setTotalCount(0);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const params = new URLSearchParams({ q, sort: sortBy, per_page: "12" });
      if (lang) params.set("language", lang);
      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setResults(data.items);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err.message);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query, language, sort);
    }, 450);
    return () => clearTimeout(debounceRef.current);
  }, [query, language, sort, runSearch]);

  return (
    <div className="stage">
      <Petals />
      <div className="glow-orb glow-orb--one" />
      <div className="glow-orb glow-orb--two" />

      <header className="hero">
        <p className="hero-eyebrow">Explore • Build • Create</p>
        <h1 className="hero-title">
        Aditya's<span className="hero-title-accent"> Sōzō </span>
        </h1>
        <p className="hero-subtitle">
         
An open-source discovery platform built by Aditya. Explore millions of GitHub repositories with powerful search and filters.

        </p>
      </header>

      <main className="panel">
        <SearchBar value={query} onChange={setQuery} />
        <FilterBar
          language={language}
          setLanguage={setLanguage}
          sort={sort}
          setSort={setSort}
        />

        <div className="status-row">
          {loading && <span className="status status--loading">summoning results…</span>}
          {!loading && !error && hasSearched && (
            <span className="status">
              {totalCount.toLocaleString()} repositories found
            </span>
          )}
          {error && <span className="status status--error">{error}</span>}
        </div>

        <RepoGrid items={results} loading={loading} hasSearched={hasSearched} />
      </main>

      <footer className="footer">
        <span>Designed & Developed by Aditya
React • Django • GitHub API &amp; Django</span>
      </footer>
    </div>
  );
}
