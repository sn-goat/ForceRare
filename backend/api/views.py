from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import ImageAsset


def _serialize_image(image: ImageAsset, request):
	return {
		"id": image.pk,
		"title": image.title,
		"alt_text": image.alt_text,
		"display_order": image.display_order,
		"url": request.build_absolute_uri(image.file.url),
		"created_at": image.created_at.isoformat(),
	}


@require_GET
def image_list(request):
	images = ImageAsset.objects.filter(is_published=True)
	payload = [_serialize_image(image, request) for image in images]
	return JsonResponse(payload, safe=False)


@require_GET
def image_detail(request, image_id: int):
	image = ImageAsset.objects.filter(id=image_id, is_published=True).first()
	if image is None:
		return JsonResponse({"detail": "Not found."}, status=404)
	return JsonResponse(_serialize_image(image, request))
