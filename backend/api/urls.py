from django.urls import path

from .views import image_detail, image_list, video_detail, video_list

urlpatterns = [
    path("images/", image_list, name="image_list"),
    path("images/<int:image_id>/", image_detail, name="image_detail"),
    path("videos/", video_list, name="video_list"),
    path("videos/<int:video_id>/", video_detail, name="video_detail"),
]
