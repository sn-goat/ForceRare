from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import ImageAsset, VideoAsset


# ── Image serialisation & views ──────────────────────────


def _serialize_image(image: ImageAsset, request):
	return {
		"id": image.pk,
		"title": image.title,
		"alt_text": image.alt_text,
		"category": image.category,
		"display_order": image.display_order,
		"url": request.build_absolute_uri(image.file.url),
		"created_at": image.created_at.isoformat(),
	}


@require_GET
def image_list(request):
	images = ImageAsset.objects.filter(is_published=True)
	category = request.GET.get("category")
	if category:
		images = images.filter(category=category)
	payload = [_serialize_image(image, request) for image in images]
	return JsonResponse(payload, safe=False)


@require_GET
def image_detail(request, image_id: int):
	image = ImageAsset.objects.filter(id=image_id, is_published=True).first()
	if image is None:
		return JsonResponse({"detail": "Not found."}, status=404)
	return JsonResponse(_serialize_image(image, request))


# ── Video serialisation & views ──────────────────────────


def _serialize_video(video: VideoAsset, request):
	data = {
		"id": video.pk,
		"title": video.title,
		"description": video.description,
		"category": video.category,
		"display_order": video.display_order,
		"url": request.build_absolute_uri(video.file.url),
		"thumbnail_url": None,
		"created_at": video.created_at.isoformat(),
	}
	if video.thumbnail:
		data["thumbnail_url"] = request.build_absolute_uri(video.thumbnail.url)
	return data


@require_GET
def video_list(request):
	videos = VideoAsset.objects.filter(is_published=True)
	category = request.GET.get("category")
	if category:
		videos = videos.filter(category=category)
	payload = [_serialize_video(video, request) for video in videos]
	return JsonResponse(payload, safe=False)


@require_GET
def video_detail(request, video_id: int):
	video = VideoAsset.objects.filter(id=video_id, is_published=True).first()
	if video is None:
		return JsonResponse({"detail": "Not found."}, status=404)
	return JsonResponse(_serialize_video(video, request))
