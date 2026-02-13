from django.contrib import admin
from .models import ImageAsset


@admin.register(ImageAsset)
class ImageAssetAdmin(admin.ModelAdmin):
	list_display = (
		"id",
		"title",
		"is_published",
		"display_order",
		"created_at",
	)
	list_filter = ("is_published", "created_at")
	search_fields = ("title", "alt_text")
	ordering = ("display_order", "-created_at")
