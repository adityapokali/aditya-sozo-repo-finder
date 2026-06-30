from django.urls import path
from .views import RepoSearchView

urlpatterns = [
    path("search/", RepoSearchView.as_view(), name="repo-search"),
]
