from django.urls import path
from .views import image_detail, image_list, contact

urlpatterns = [
    path("images/", image_list, name="image_list"),
    path("images/<int:image_id>/", image_detail, name="image_detail"),
    path("contact/", contact, name="contact"),
]
