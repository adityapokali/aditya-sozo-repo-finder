import RepoCard from "./RepoCard.jsx";

export default function RepoGrid({ items, loading, hasSearched }) {
  if (loading) {
    return (
      <div className="repo-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="repo-card repo-card--skeleton" key={i} />
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="empty-state">
        <span className="empty-icon">✦</span>
        <p>Type something above to send a wish into the archive.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">☾</span>
        <p>No repositories answered this call. Try a different spell.</p>
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {items.map((repo, i) => (
        <RepoCard repo={repo} key={repo.id} index={i} />
      ))}
    </div>
  );
}
