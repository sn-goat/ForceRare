from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from auditlog.registry import auditlog

ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm']

MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024       # 10 MB
MAX_VIDEO_FILE_SIZE = 500 * 1024 * 1024      # 500 MB


def validate_image_file_size(value):
	if value.size > MAX_IMAGE_FILE_SIZE:
		raise ValidationError(
			f'Le fichier image ne doit pas dépasser {MAX_IMAGE_FILE_SIZE // (1024 * 1024)} Mo.'
		)


def validate_video_file_size(value):
	if value.size > MAX_VIDEO_FILE_SIZE:
		raise ValidationError(
			f'Le fichier vidéo ne doit pas dépasser {MAX_VIDEO_FILE_SIZE // (1024 * 1024)} Mo.'
		)


IMAGE_CATEGORY_CHOICES = [
	("hero", "Hero"),
	("founder", "Fondateur"),
	("partner", "Partenaire"),
	("about", "À propos"),
	("general", "Général"),
]

VIDEO_CATEGORY_CHOICES = [
	("hero", "Hero"),
	("campaign", "Campagne"),
	("testimonial", "Témoignage"),
	("general", "Général"),
]


class ImageAsset(models.Model):
	file = models.ImageField(
		upload_to="uploads/images/",
		validators=[
			FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS),
			validate_image_file_size,
		],
	)
	title = models.CharField(max_length=255, blank=True)
	alt_text = models.CharField(max_length=255, blank=True)
	category = models.CharField(
		max_length=20,
		choices=IMAGE_CATEGORY_CHOICES,
		default="general",
	)
	is_published = models.BooleanField(default=False)
	display_order = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["display_order", "-created_at"]

	def __str__(self):
		return self.title or f"Image {self.pk}"


class VideoAsset(models.Model):
	file = models.FileField(
		upload_to="uploads/videos/",
		validators=[
			FileExtensionValidator(allowed_extensions=ALLOWED_VIDEO_EXTENSIONS),
			validate_video_file_size,
		],
	)
	title = models.CharField(max_length=255, blank=True)
	description = models.TextField(blank=True)
	category = models.CharField(
		max_length=20,
		choices=VIDEO_CATEGORY_CHOICES,
		default="general",
	)
	thumbnail = models.ImageField(
		upload_to="uploads/thumbnails/",
		blank=True,
		validators=[
			FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS),
			validate_image_file_size,
		],
	)
	is_published = models.BooleanField(default=False)
	display_order = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["display_order", "-created_at"]

	def __str__(self):
		return self.title or f"Video {self.pk}"


class Event(models.Model):

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return self.title


class EventImage(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='images')
    file = models.ImageField(
        upload_to='uploads/events/',
        validators=[
            FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS),
            validate_image_file_size,
        ],
    )
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"Image {self.pk} — {self.event.title}"

auditlog.register(ImageAsset)
auditlog.register(VideoAsset)
auditlog.register(Event)
auditlog.register(EventImage)