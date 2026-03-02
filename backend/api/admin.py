from django.contrib import admin
from .models import ImageAsset, VideoAsset


@admin.register(ImageAsset)
class ImageAssetAdmin(admin.ModelAdmin):
	list_display = (
		"id",
		"title",
		"category",
		"is_published",
		"display_order",
		"created_at",
	)
	list_filter = ("is_published", "category", "created_at")
	search_fields = ("title", "alt_text")
	ordering = ("display_order", "-created_at")


@admin.register(VideoAsset)
class VideoAssetAdmin(admin.ModelAdmin):
	list_display = (
		"id",
		"title",
		"category",
		"is_published",
		"display_order",
		"created_at",
	)
	list_filter = ("is_published", "category", "created_at")
	search_fields = ("title", "description")
	ordering = ("display_order", "-created_at")
