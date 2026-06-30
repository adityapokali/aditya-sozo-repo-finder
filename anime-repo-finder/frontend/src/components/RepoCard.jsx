function formatStars(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}

export default function RepoCard({ repo, index }) {
  return (
    <a
      className="repo-card"
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="repo-card-glow" />
      <div className="repo-card-head">
        <img className="repo-avatar" src={repo.avatar} alt="" loading="lazy" />
        <div className="repo-titles">
          <span className="repo-owner">{repo.owner}</span>
          <span className="repo-name">{repo.name}</span>
        </div>
      </div>

      <p className="repo-desc">{repo.description || "No description provided."}</p>

      {repo.topics?.length > 0 && (
        <div className="repo-topics">
          {repo.topics.slice(0, 3).map((t) => (
            <span className="repo-topic" key={t}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="repo-meta">
        {repo.language && <span className="repo-lang">{repo.language}</span>}
        <span className="repo-stat">★ {formatStars(repo.stars)}</span>
        <span className="repo-stat">⑂ {formatStars(repo.forks)}</span>
      </div>
    </a>
  );
}
