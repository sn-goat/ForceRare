from django.contrib import admin
from .models import ImageAsset, VideoAsset
from .models import ImageAsset, VideoAsset, Event, EventImage

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

    

class EventImageInline(admin.TabularInline):
    model = EventImage
    extra = 2

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'date', 'location', 'is_published', 'created_at')
    list_filter = ('is_published', 'date')
    search_fields = ('title', 'description')
    ordering = ('date',)
    inlines = [EventImageInline]
