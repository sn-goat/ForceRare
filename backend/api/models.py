from django.db import models


IMAGE_CATEGORY_CHOICES = [
	("hero", "Hero"),
	("founder", "Fondateur"),
	("partner", "Partenaire"),
	("about", "À propos"),
	("event", "Événement"),
	("general", "Général"),
]

VIDEO_CATEGORY_CHOICES = [
	("hero", "Hero"),
	("campaign", "Campagne"),
	("testimonial", "Témoignage"),
	("event", "Événement"),
	("general", "Général"),
]


class ImageAsset(models.Model):
	file = models.ImageField(upload_to="uploads/images/")
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
	file = models.FileField(upload_to="uploads/videos/")
	title = models.CharField(max_length=255, blank=True)
	description = models.TextField(blank=True)
	category = models.CharField(
		max_length=20,
		choices=VIDEO_CATEGORY_CHOICES,
		default="general",
	)
	thumbnail = models.ImageField(upload_to="uploads/thumbnails/", blank=True)
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
    file = models.ImageField(upload_to='uploads/events/')
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"Image {self.pk} — {self.event.title}"
