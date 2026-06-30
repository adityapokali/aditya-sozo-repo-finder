# Repoverse— Anime-styled GitHub Repo Finder

A twilight-festival themed GitHub repository search app. React (Vite) frontend,
Django + DRF backend that proxies and caches GitHub's search API so your token
stays server-side.

## Project structure

```
anime-repo-finder/
  backend/    Django + DRF API (proxies GitHub search)
  frontend/   React (Vite) UI
```

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then add your GitHub token to .env
python manage.py runserver
```

Generate a GitHub token at https://github.com/settings/tokens (no scopes
needed for public search — a basic token just raises your rate limit from
60 to 5,000 requests/hour). Paste it into `.env` as `GITHUB_TOKEN`.

Backend runs at `http://localhost:8000`. Endpoint:

```
GET /api/search/?q=react&language=TypeScript&sort=stars
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` and proxies `/api` requests to the Django
server (configured in `vite.config.js`).

## Notes

- Search results are cached in-memory on the backend for 2 minutes per
  query to reduce GitHub API calls.
- No database is required — the backend is a stateless proxy.
- For production, swap `LocMemCache` for Redis and set `DEBUG=False` with a
  real `ALLOWED_HOSTS` list.
