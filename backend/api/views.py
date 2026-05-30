import json
import html
import logging
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import ImageAsset, VideoAsset, Event

logger = logging.getLogger(__name__)

MAX_NAME = 100
MAX_EMAIL = 254
MAX_SUBJECT = 100
MAX_MESSAGE = 5000

VALID_SUBJECTS = [
    'Question générale',
    'Partenariat / Collaboration',
    'Don / Financement',
    'Bénévolat / Ambassadeur',
    'Médias / Presse',
]


def _sanitize(value: str) -> str:
    return html.escape(value.strip())


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


@csrf_exempt
def contact(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON.'}, status=400)

    name = _sanitize(data.get('name', ''))
    email = _sanitize(data.get('email', ''))
    subject = _sanitize(data.get('subject', ''))
    custom_subject = _sanitize(data.get('customSubject', ''))
    message = _sanitize(data.get('message', ''))

    errors = {}

    if not name:
        errors['name'] = 'Le nom est requis.'
    elif len(name) > MAX_NAME:
        errors['name'] = f'Le nom ne doit pas dépasser {MAX_NAME} caractères.'

    if not email:
        errors['email'] = "L'adresse courriel est requise."
    elif len(email) > MAX_EMAIL:
        errors['email'] = f"L'adresse courriel ne doit pas dépasser {MAX_EMAIL} caractères."
    else:
        try:
            validate_email(email)
        except ValidationError:
            errors['email'] = "L'adresse courriel n'est pas valide."

    if not subject:
        errors['subject'] = 'Le sujet est requis.'
    elif subject == 'Autre':
        if not custom_subject:
            errors['customSubject'] = 'Veuillez préciser le sujet.'
        elif len(custom_subject) > MAX_SUBJECT:
            errors['customSubject'] = f'Le sujet ne doit pas dépasser {MAX_SUBJECT} caractères.'
    elif subject not in VALID_SUBJECTS:
        errors['subject'] = 'Sujet invalide.'

    if not message:
        errors['message'] = 'Le message est requis.'
    elif len(message) > MAX_MESSAGE:
        errors['message'] = f'Le message ne doit pas dépasser {MAX_MESSAGE} caractères.'

    if errors:
        return JsonResponse({'errors': errors}, status=400)

    resolved_subject = custom_subject if subject == 'Autre' else subject
    email_subject = f'Contact ForceRare — {resolved_subject}'

    try:
        send_mail(
            subject=email_subject,
            message=f'De: {name} <{email}>\n\n{message}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_EMAIL],
            fail_silently=False,
        )
    except Exception as exc:
        logger.error('Contact email failed: %s', exc)
        return JsonResponse(
            {'detail': "Erreur lors de l'envoi du courriel. Veuillez réessayer plus tard."},
            status=500,
        )

    return JsonResponse({'detail': 'Message envoyé avec succès.'}, status=200)


def _serialize_event(event, request):
    return {
        'id': event.pk,
        'title': event.title,
        'description': event.description,
        'date': event.date.isoformat(),
        'location': event.location,
        'images': [
            {
                'id': img.pk,
                'url': img.file.url,
                'alt_text': img.alt_text,
                'display_order': img.display_order,
            }
            for img in event.images.all()
        ],
    }



@require_GET
def event_list(request):
    events = Event.objects.filter(is_published=True).prefetch_related('images').order_by('date')
    return JsonResponse([_serialize_event(e, request) for e in events], safe=False)

@require_GET
def event_detail(request, event_id: int):
    event = Event.objects.filter(pk=event_id, is_published=True).prefetch_related('images').first()
    if event is None:
        return JsonResponse({'detail': 'Not found.'}, status=404)
    return JsonResponse(_serialize_event(event, request))
