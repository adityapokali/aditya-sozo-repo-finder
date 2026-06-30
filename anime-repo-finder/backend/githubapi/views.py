import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

GITHUB_SEARCH_URL = "https://api.github.com/search/repositories"


class RepoSearchView(APIView):
    """
    Proxies repository search requests to the GitHub REST API.

    Query params:
      q        - search keywords (required)
      language - filter by language (optional)
      sort     - stars | forks | updated (optional, default: stars)
      order    - asc | desc (optional, default: desc)
      page     - page number (optional, default: 1)
      per_page - results per page (optional, default: 12, max: 30)
    """

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response(
                {"error": "A search query 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        language = request.query_params.get("language", "").strip()
        sort = request.query_params.get("sort", "stars")
        order = request.query_params.get("order", "desc")
        page = request.query_params.get("page", "1")
        per_page = min(int(request.query_params.get("per_page", 12)), 30)

        gh_query = query
        if language:
            gh_query += f" language:{language}"

        cache_key = f"gh:{gh_query}:{sort}:{order}:{page}:{per_page}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        headers = {"Accept": "application/vnd.github+json"}
        if settings.GITHUB_TOKEN:
            headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

        params = {
            "q": gh_query,
            "sort": sort,
            "order": order,
            "page": page,
            "per_page": per_page,
        }

        try:
            resp = requests.get(
                GITHUB_SEARCH_URL, headers=headers, params=params, timeout=10
            )
            print("GitHub Status:", resp.status_code)
            print("GitHub Response:", resp.text[:500])
        except requests.RequestException:
            return Response(
                {"error": "Could not reach GitHub right now. Try again shortly."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        if resp.status_code != 200:
            return Response(
                {"error": resp.json().get("message", "GitHub API error")},
                status=resp.status_code,
            )

        data = resp.json()
        items = [
            {
                "id": item["id"],
                "name": item["name"],
                "full_name": item["full_name"],
                "owner": item["owner"]["login"],
                "avatar": item["owner"]["avatar_url"],
                "description": item.get("description"),
                "url": item["html_url"],
                "stars": item["stargazers_count"],
                "forks": item["forks_count"],
                "language": item.get("language"),
                "topics": item.get("topics", []),
                "updated_at": item["updated_at"],
            }
            for item in data.get("items", [])
        ]

        result = {
            "total_count": data.get("total_count", 0),
            "items": items,
        }

        cache.set(cache_key, result, timeout=120)
        return Response(result)
