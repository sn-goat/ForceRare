from django.db import models


class ImageAsset(models.Model):
	file = models.ImageField(upload_to="uploads/images/")
	title = models.CharField(max_length=255, blank=True)
	alt_text = models.CharField(max_length=255, blank=True)
	is_published = models.BooleanField(default=False)
	display_order = models.PositiveIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["display_order", "-created_at"]

	def __str__(self):
		return self.title or f"Image {self.pk}"
