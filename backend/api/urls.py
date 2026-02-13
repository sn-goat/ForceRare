from django.urls import path

from .views import image_detail, image_list

urlpatterns = [
    path("images/", image_list, name="image_list"),
    path("images/<int:image_id>/", image_detail, name="image_detail"),
]
