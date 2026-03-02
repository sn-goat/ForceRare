import json
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import ImageAsset
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


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


@csrf_exempt
def contact(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()
    
    if not all([name, email, message]):
        return JsonResponse({'detail': 'name, email and message are required.'}, status=400)
    
    try:
        send_mail(
            subject=f'Contact ForceRare - {name}',
            message=f'De: {name} <{email}>\n\n{message}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=False,
        )
    except Exception as e:
        return JsonResponse({'detail': str(e)}, status=500)

    
    return JsonResponse({'detail': 'Message sent successfully.'}, status=200)
