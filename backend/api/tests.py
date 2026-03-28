import io
import json
import shutil
import tempfile
from datetime import timedelta
from unittest.mock import patch

from PIL import Image
from django.contrib.admin.sites import AdminSite
from django.core import mail
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, TestCase, override_settings
from django.utils import timezone

from .admin import ImageAssetAdmin, VideoAssetAdmin
from .models import (
    ImageAsset, VideoAsset, Event, EventImage,
    validate_image_file_size, validate_video_file_size,
    MAX_IMAGE_FILE_SIZE, MAX_VIDEO_FILE_SIZE,
)

TEMP_MEDIA = tempfile.mkdtemp()


def _create_test_image(name="test.png", size=(1, 1), fmt="PNG"):
    buf = io.BytesIO()
    Image.new("RGB", size, color="red").save(buf, format=fmt)
    buf.seek(0)
    content_type = f"image/{fmt.lower()}"
    return SimpleUploadedFile(name, buf.read(), content_type=content_type)


def _create_test_video(name="test.mp4"):
    return SimpleUploadedFile(name, b"\x00" * 64, content_type="video/mp4")


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class ImageAssetModelTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {"file": _create_test_image(), "is_published": True}
        defaults.update(kwargs)
        return ImageAsset.objects.create(**defaults)

    def test_str_with_title(self):
        img = self._create(title="Banner")
        self.assertEqual(str(img), "Banner")

    def test_str_without_title(self):
        img = self._create(title="")
        self.assertEqual(str(img), f"Image {img.pk}")

    def test_default_is_published_false(self):
        img = ImageAsset.objects.create(file=_create_test_image())
        self.assertFalse(img.is_published)

    def test_default_display_order_zero(self):
        img = self._create()
        self.assertEqual(img.display_order, 0)

    def test_created_at_auto_set(self):
        img = self._create()
        self.assertIsNotNone(img.created_at)

    def test_updated_at_auto_set(self):
        img = self._create()
        self.assertIsNotNone(img.updated_at)

    def test_ordering_by_display_order_then_created(self):
        a = self._create(title="A", display_order=2)
        b = self._create(title="B", display_order=1)
        c = self._create(title="C", display_order=1)
        ordered = list(ImageAsset.objects.values_list("pk", flat=True))
        self.assertEqual(ordered[0], c.pk)
        self.assertEqual(ordered[1], b.pk)
        self.assertEqual(ordered[2], a.pk)

    def test_file_stored_under_uploads_images(self):
        img = self._create()
        self.assertTrue(img.file.name.startswith("uploads/images/"))

    def test_default_category_general(self):
        img = self._create()
        self.assertEqual(img.category, "general")

    def test_category_can_be_set(self):
        img = self._create(category="hero")
        self.assertEqual(img.category, "hero")


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class ImageListAPITest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {"file": _create_test_image(), "is_published": True}
        defaults.update(kwargs)
        return ImageAsset.objects.create(**defaults)

    def test_list_returns_200(self):
        resp = self.client.get("/api/images/")
        self.assertEqual(resp.status_code, 200)

    def test_list_returns_json(self):
        resp = self.client.get("/api/images/")
        self.assertEqual(resp["Content-Type"], "application/json")

    def test_list_empty_when_no_images(self):
        resp = self.client.get("/api/images/")
        self.assertEqual(resp.json(), [])

    def test_list_returns_published_only(self):
        self._create(title="visible", is_published=True)
        self._create(title="hidden", is_published=False)
        data = self.client.get("/api/images/").json()
        titles = [img["title"] for img in data]
        self.assertIn("visible", titles)
        self.assertNotIn("hidden", titles)

    def test_list_excludes_all_unpublished(self):
        self._create(is_published=False)
        self._create(is_published=False)
        data = self.client.get("/api/images/").json()
        self.assertEqual(len(data), 0)

    def test_list_response_fields(self):
        self._create(title="Test", alt_text="Alt")
        data = self.client.get("/api/images/").json()
        item = data[0]
        expected_keys = {"id", "title", "alt_text", "category", "display_order", "url", "created_at"}
        self.assertEqual(set(item.keys()), expected_keys)

    def test_list_url_is_absolute(self):
        self._create()
        data = self.client.get("/api/images/").json()
        self.assertTrue(data[0]["url"].startswith("http"))

    def test_list_respects_display_order(self):
        self._create(title="Second", display_order=2)
        self._create(title="First", display_order=1)
        data = self.client.get("/api/images/").json()
        self.assertEqual(data[0]["title"], "First")
        self.assertEqual(data[1]["title"], "Second")

    def test_post_not_allowed(self):
        resp = self.client.post("/api/images/")
        self.assertEqual(resp.status_code, 405)

    def test_put_not_allowed(self):
        resp = self.client.put("/api/images/")
        self.assertEqual(resp.status_code, 405)

    def test_delete_not_allowed(self):
        resp = self.client.delete("/api/images/")
        self.assertEqual(resp.status_code, 405)

    def test_list_filters_by_category(self):
        self._create(title="Hero Shot", category="hero")
        self._create(title="Partner Logo", category="partner")
        data = self.client.get("/api/images/?category=hero").json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Hero Shot")

    def test_list_no_category_returns_all(self):
        self._create(title="A", category="hero")
        self._create(title="B", category="partner")
        data = self.client.get("/api/images/").json()
        self.assertEqual(len(data), 2)

    def test_list_unknown_category_returns_empty(self):
        self._create(title="A", category="hero")
        data = self.client.get("/api/images/?category=nonexistent").json()
        self.assertEqual(len(data), 0)


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class ImageDetailAPITest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {"file": _create_test_image(), "is_published": True}
        defaults.update(kwargs)
        return ImageAsset.objects.create(**defaults)

    def test_detail_returns_200(self):
        img = self._create()
        resp = self.client.get(f"/api/images/{img.pk}/")
        self.assertEqual(resp.status_code, 200)

    def test_detail_returns_correct_image(self):
        img = self._create(title="My Image")
        data = self.client.get(f"/api/images/{img.pk}/").json()
        self.assertEqual(data["title"], "My Image")
        self.assertEqual(data["id"], img.pk)

    def test_detail_response_fields(self):
        img = self._create()
        data = self.client.get(f"/api/images/{img.pk}/").json()
        expected_keys = {"id", "title", "alt_text", "category", "display_order", "url", "created_at"}
        self.assertEqual(set(data.keys()), expected_keys)

    def test_detail_404_nonexistent_id(self):
        resp = self.client.get("/api/images/99999/")
        self.assertEqual(resp.status_code, 404)

    def test_detail_404_unpublished(self):
        img = self._create(is_published=False)
        resp = self.client.get(f"/api/images/{img.pk}/")
        self.assertEqual(resp.status_code, 404)

    def test_detail_404_body_has_detail_key(self):
        resp = self.client.get("/api/images/99999/")
        self.assertIn("detail", resp.json())

    def test_post_not_allowed(self):
        img = self._create()
        resp = self.client.post(f"/api/images/{img.pk}/")
        self.assertEqual(resp.status_code, 405)

    def test_delete_not_allowed(self):
        img = self._create()
        resp = self.client.delete(f"/api/images/{img.pk}/")
        self.assertEqual(resp.status_code, 405)


class ImageAssetAdminTest(SimpleTestCase):

    def setUp(self):
        self.admin = ImageAssetAdmin(model=ImageAsset, admin_site=AdminSite())

    def test_registered_list_display(self):
        self.assertIn("title", self.admin.list_display)
        self.assertIn("is_published", self.admin.list_display)
        self.assertIn("display_order", self.admin.list_display)
        self.assertIn("category", self.admin.list_display)

    def test_registered_search_fields(self):
        self.assertIn("title", self.admin.search_fields)
        self.assertIn("alt_text", self.admin.search_fields)

    def test_registered_list_filter(self):
        self.assertIn("is_published", self.admin.list_filter)
        self.assertIn("category", self.admin.list_filter)


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class VideoAssetModelTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {"file": _create_test_video(), "is_published": True}
        defaults.update(kwargs)
        return VideoAsset.objects.create(**defaults)

    def test_str_with_title(self):
        vid = self._create(title="Promo")
        self.assertEqual(str(vid), "Promo")

    def test_str_without_title(self):
        vid = self._create(title="")
        self.assertEqual(str(vid), f"Video {vid.pk}")

    def test_default_is_published_false(self):
        vid = VideoAsset.objects.create(file=_create_test_video())
        self.assertFalse(vid.is_published)

    def test_default_category_general(self):
        vid = self._create()
        self.assertEqual(vid.category, "general")

    def test_category_can_be_set(self):
        vid = self._create(category="hero")
        self.assertEqual(vid.category, "hero")

    def test_default_display_order_zero(self):
        vid = self._create()
        self.assertEqual(vid.display_order, 0)

    def test_timestamps_auto_set(self):
        vid = self._create()
        self.assertIsNotNone(vid.created_at)
        self.assertIsNotNone(vid.updated_at)

    def test_file_stored_under_uploads_videos(self):
        vid = self._create()
        self.assertTrue(vid.file.name.startswith("uploads/videos/"))

    def test_thumbnail_is_optional(self):
        vid = self._create()
        self.assertFalse(vid.thumbnail)

    def test_ordering(self):
        a = self._create(title="A", display_order=2)
        b = self._create(title="B", display_order=1)
        c = self._create(title="C", display_order=1)
        ordered = list(VideoAsset.objects.values_list("pk", flat=True))
        self.assertEqual(ordered[0], c.pk)
        self.assertEqual(ordered[1], b.pk)
        self.assertEqual(ordered[2], a.pk)


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class VideoListAPITest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {"file": _create_test_video(), "is_published": True}
        defaults.update(kwargs)
        return VideoAsset.objects.create(**defaults)

    def test_list_returns_200(self):
        resp = self.client.get("/api/videos/")
        self.assertEqual(resp.status_code, 200)

    def test_list_returns_json(self):
        resp = self.client.get("/api/videos/")
        self.assertEqual(resp["Content-Type"], "application/json")

    def test_list_empty_when_no_videos(self):
        resp = self.client.get("/api/videos/")
        self.assertEqual(resp.json(), [])

    def test_list_returns_published_only(self):
        self._create(title="visible", is_published=True)
        self._create(title="hidden", is_published=False)
        data = self.client.get("/api/videos/").json()
        titles = [v["title"] for v in data]
        self.assertIn("visible", titles)
        self.assertNotIn("hidden", titles)

    def test_list_response_fields(self):
        self._create(title="Test")
        data = self.client.get("/api/videos/").json()
        item = data[0]
        expected_keys = {"id", "title", "description", "category", "display_order", "url", "thumbnail_url", "created_at"}
        self.assertEqual(set(item.keys()), expected_keys)

    def test_list_url_is_absolute(self):
        self._create()
        data = self.client.get("/api/videos/").json()
        self.assertTrue(data[0]["url"].startswith("http"))

    def test_list_thumbnail_url_null_when_missing(self):
        self._create()
        data = self.client.get("/api/videos/").json()
        self.assertIsNone(data[0]["thumbnail_url"])

    def test_list_thumbnail_url_present_when_set(self):
        vid = self._create()
        vid.thumbnail = _create_test_image(name="thumb.png")
        vid.save()
        data = self.client.get("/api/videos/").json()
        self.assertIsNotNone(data[0]["thumbnail_url"])
        self.assertTrue(data[0]["thumbnail_url"].startswith("http"))

    def test_list_filters_by_category(self):
        self._create(title="Hero Vid", category="hero")
        self._create(title="Campaign Vid", category="campaign")
        data = self.client.get("/api/videos/?category=hero").json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Hero Vid")

    def test_list_no_category_returns_all(self):
        self._create(title="A", category="hero")
        self._create(title="B", category="campaign")
        data = self.client.get("/api/videos/").json()
        self.assertEqual(len(data), 2)

    def test_post_not_allowed(self):
        resp = self.client.post("/api/videos/")
        self.assertEqual(resp.status_code, 405)

    def test_put_not_allowed(self):
        resp = self.client.put("/api/videos/")
        self.assertEqual(resp.status_code, 405)

    def test_delete_not_allowed(self):
        resp = self.client.delete("/api/videos/")
        self.assertEqual(resp.status_code, 405)


@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class VideoDetailAPITest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {"file": _create_test_video(), "is_published": True}
        defaults.update(kwargs)
        return VideoAsset.objects.create(**defaults)

    def test_detail_returns_200(self):
        vid = self._create()
        resp = self.client.get(f"/api/videos/{vid.pk}/")
        self.assertEqual(resp.status_code, 200)

    def test_detail_returns_correct_video(self):
        vid = self._create(title="My Video")
        data = self.client.get(f"/api/videos/{vid.pk}/").json()
        self.assertEqual(data["title"], "My Video")
        self.assertEqual(data["id"], vid.pk)

    def test_detail_response_fields(self):
        vid = self._create()
        data = self.client.get(f"/api/videos/{vid.pk}/").json()
        expected_keys = {"id", "title", "description", "category", "display_order", "url", "thumbnail_url", "created_at"}
        self.assertEqual(set(data.keys()), expected_keys)

    def test_detail_404_nonexistent_id(self):
        resp = self.client.get("/api/videos/99999/")
        self.assertEqual(resp.status_code, 404)

    def test_detail_404_unpublished(self):
        vid = self._create(is_published=False)
        resp = self.client.get(f"/api/videos/{vid.pk}/")
        self.assertEqual(resp.status_code, 404)

    def test_detail_404_body_has_detail_key(self):
        resp = self.client.get("/api/videos/99999/")
        self.assertIn("detail", resp.json())

    def test_post_not_allowed(self):
        vid = self._create()
        resp = self.client.post(f"/api/videos/{vid.pk}/")
        self.assertEqual(resp.status_code, 405)

    def test_delete_not_allowed(self):
        vid = self._create()
        resp = self.client.delete(f"/api/videos/{vid.pk}/")
        self.assertEqual(resp.status_code, 405)


class VideoAssetAdminTest(SimpleTestCase):

    def setUp(self):
        self.admin = VideoAssetAdmin(model=VideoAsset, admin_site=AdminSite())

    def test_registered_list_display(self):
        self.assertIn("title", self.admin.list_display)
        self.assertIn("is_published", self.admin.list_display)
        self.assertIn("display_order", self.admin.list_display)
        self.assertIn("category", self.admin.list_display)

    def test_registered_search_fields(self):
        self.assertIn("title", self.admin.search_fields)
        self.assertIn("description", self.admin.search_fields)

    def test_registered_list_filter(self):
        self.assertIn("is_published", self.admin.list_filter)
        self.assertIn("category", self.admin.list_filter)


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    CONTACT_EMAIL='test@forcerare.com',
    DEFAULT_FROM_EMAIL='noreply@forcerare.com',
)
class ContactAPITest(SimpleTestCase):

    def _post(self, data):
        return self.client.post(
            "/api/contact/",
            data=json.dumps(data),
            content_type="application/json",
        )

    def test_valid_submission_returns_200(self):
        resp = self._post({"name": "Jean", "email": "jean@test.com", "subject": "Question générale", "message": "Bonjour"})
        self.assertEqual(resp.status_code, 200)

    def test_valid_submission_with_autre(self):
        resp = self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Autre",
            "customSubject": "Sujet personnalisé",
            "message": "Bonjour",
        })
        self.assertEqual(resp.status_code, 200)

    def test_get_not_allowed(self):
        resp = self.client.get("/api/contact/")
        self.assertEqual(resp.status_code, 405)

    def test_put_not_allowed(self):
        resp = self.client.put("/api/contact/")
        self.assertEqual(resp.status_code, 405)

    def test_invalid_json_returns_400(self):
        resp = self.client.post(
            "/api/contact/",
            data="not json",
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 400)
        self.assertIn("detail", resp.json())

    def test_missing_name_returns_error(self):
        resp = self._post({"email": "a@b.com", "subject": "Question générale", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("name", resp.json()["errors"])

    def test_missing_email_returns_error(self):
        resp = self._post({"name": "Jean", "subject": "Question générale", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("email", resp.json()["errors"])

    def test_missing_message_returns_error(self):
        resp = self._post({"name": "Jean", "email": "a@b.com", "subject": "Question générale"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("message", resp.json()["errors"])

    def test_invalid_email_returns_error(self):
        resp = self._post({"name": "Jean", "email": "not-an-email", "subject": "Question générale", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("email", resp.json()["errors"])

    def test_name_too_long(self):
        resp = self._post({"name": "A" * 101, "email": "a@b.com", "subject": "Question générale", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("name", resp.json()["errors"])

    def test_email_too_long(self):
        resp = self._post({"name": "Jean", "email": "a" * 250 + "@b.com", "subject": "Question générale", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("email", resp.json()["errors"])

    def test_subject_too_long(self):
        resp = self._post({
            "name": "Jean",
            "email": "a@b.com",
            "subject": "Autre",
            "customSubject": "X" * 101,
            "message": "Hi",
        })
        self.assertEqual(resp.status_code, 400)
        self.assertIn("customSubject", resp.json()["errors"])

    def test_message_too_long(self):
        resp = self._post({"name": "Jean", "email": "a@b.com", "subject": "Question générale", "message": "X" * 5001})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("message", resp.json()["errors"])

    def test_html_stripped_from_name(self):
        resp = self._post({
            "name": "<script>alert(1)</script>Jean",
            "email": "a@b.com",
            "subject": "Question générale",
            "message": "Hi",
        })
        self.assertEqual(resp.status_code, 200)

    def test_html_stripped_from_message(self):
        resp = self._post({
            "name": "Jean",
            "email": "a@b.com",
            "subject": "Question générale",
            "message": "<b>Bold</b> text",
        })
        self.assertEqual(resp.status_code, 200)

    def test_multiple_errors_returned(self):
        resp = self._post({})
        self.assertEqual(resp.status_code, 400)
        errors = resp.json()["errors"]
        self.assertIn("name", errors)
        self.assertIn("email", errors)
        self.assertIn("subject", errors)
        self.assertIn("message", errors)

    def test_missing_subject_returns_error(self):
        resp = self._post({"name": "Jean", "email": "a@b.com", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("subject", resp.json()["errors"])

    def test_invalid_subject_returns_error(self):
        resp = self._post({"name": "Jean", "email": "a@b.com", "subject": "Invalid option", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("subject", resp.json()["errors"])

    def test_autre_without_custom_subject_returns_error(self):
        resp = self._post({"name": "Jean", "email": "a@b.com", "subject": "Autre", "message": "Hi"})
        self.assertEqual(resp.status_code, 400)
        self.assertIn("customSubject", resp.json()["errors"])

    def test_all_valid_subjects_accepted(self):
        for subject in [
            "Question générale",
            "Partenariat / Collaboration",
            "Don / Financement",
            "Bénévolat / Ambassadeur",
            "Médias / Presse",
        ]:
            resp = self._post({"name": "Jean", "email": "a@b.com", "subject": subject, "message": "Hi"})
            self.assertEqual(resp.status_code, 200, f"Subject '{subject}' should be accepted")

    def test_response_does_not_leak_exception(self):
        resp = self._post({"name": "Jean", "email": "a@b.com", "subject": "Question générale", "message": "Hi"})
        body = resp.json()
        self.assertNotIn("Traceback", str(body))
        self.assertNotIn("Exception", str(body))
    # ── Event Model Tests ──────────────────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class EventModelTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {
            "title": "Test Event",
            "date": "2099-09-07 20:00:00",
            "is_published": True,
        }
        defaults.update(kwargs)
        return Event.objects.create(**defaults)

    # Vérifie que __str__ retourne le titre de l'événement
    def test_str_returns_title(self):
        event = self._create(title="Birra Basta")
        self.assertEqual(str(event), "Birra Basta")

    # Vérifie que is_published est False par défaut
    def test_default_is_published_false(self):
        event = Event.objects.create(title="Test", date="2099-01-01 10:00:00")
        self.assertFalse(event.is_published)

    # Vérifie que les événements sont triés par date
    def test_ordering_by_date(self):
        self._create(title="Later", date="2099-10-01 10:00:00")
        self._create(title="Earlier", date="2099-09-01 10:00:00")
        ordered = list(Event.objects.values_list("title", flat=True))
        self.assertEqual(ordered[0], "Earlier")
        self.assertEqual(ordered[1], "Later")

    # Vérifie que created_at est automatiquement défini
    def test_created_at_auto_set(self):
        event = self._create()
        self.assertIsNotNone(event.created_at)


# ── EventImage Model Tests ─────────────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class EventImageModelTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create_event(self, **kwargs):
        defaults = {"title": "Test Event", "date": "2099-09-07 20:00:00", "is_published": True}
        defaults.update(kwargs)
        return Event.objects.create(**defaults)

    def _create_image(self, event, **kwargs):
        from api.models import EventImage
        defaults = {"file": _create_test_image(), "display_order": 0}
        defaults.update(kwargs)
        return EventImage.objects.create(event=event, **defaults)

    # Vérifie que __str__ retourne le titre de l'événement lié
    def test_str_returns_event_title(self):
        event = self._create_event(title="Phare Force Rare")
        img = self._create_image(event)
        self.assertIn("Phare Force Rare", str(img))

    # Vérifie que display_order est 0 par défaut
    def test_default_display_order_zero(self):
        event = self._create_event()
        img = self._create_image(event)
        self.assertEqual(img.display_order, 0)

    # Vérifie que le fichier est stocké dans uploads/events/
    def test_image_stored_under_uploads_events(self):
        event = self._create_event()
        img = self._create_image(event)
        self.assertTrue(img.file.name.startswith("uploads/events/"))

    # Vérifie que les images sont supprimées en cascade avec l'événement
    def test_cascade_delete_with_event(self):
        from api.models import EventImage
        event = self._create_event()
        self._create_image(event)
        event_id = event.pk
        event.delete()
        self.assertEqual(EventImage.objects.filter(event_id=event_id).count(), 0)


# ── Event List API Tests ───────────────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class EventListAPITest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {
            "title": "Test Event",
            "date": "2099-09-07 20:00:00",
            "is_published": True,
        }
        defaults.update(kwargs)
        return Event.objects.create(**defaults)

    # Vérifie que l'endpoint retourne 200
    def test_list_returns_200(self):
        resp = self.client.get("/api/events/")
        self.assertEqual(resp.status_code, 200)

    # Vérifie que la réponse est en JSON
    def test_list_returns_json(self):
        resp = self.client.get("/api/events/")
        self.assertEqual(resp["Content-Type"], "application/json")

    # Vérifie que la liste est vide quand aucun événement n'existe
    def test_list_empty_when_no_events(self):
        resp = self.client.get("/api/events/")
        self.assertEqual(resp.json(), [])

    # Vérifie que seuls les événements publiés sont retournés
    def test_list_returns_published_only(self):
        self._create(title="Visible", is_published=True)
        self._create(title="Hidden", is_published=False)
        data = self.client.get("/api/events/").json()
        titles = [e["title"] for e in data]
        self.assertIn("Visible", titles)
        self.assertNotIn("Hidden", titles)

    # Vérifie que les champs attendus sont présents dans la réponse
    def test_list_response_fields(self):
        self._create()
        data = self.client.get("/api/events/").json()
        expected_keys = {"id", "title", "description", "date", "location", "images"}
        self.assertEqual(set(data[0].keys()), expected_keys)

    # Vérifie que les images sont bien imbriquées dans l'événement
    def test_list_images_nested_correctly(self):
        from api.models import EventImage
        event = self._create()
        EventImage.objects.create(event=event, file=_create_test_image(), display_order=0)
        data = self.client.get("/api/events/").json()
        self.assertIsInstance(data[0]["images"], list)
        self.assertEqual(len(data[0]["images"]), 1)
        img = data[0]["images"][0]
        self.assertIn("id", img)
        self.assertIn("url", img)
        self.assertIn("alt_text", img)
        self.assertIn("display_order", img)

    # Vérifie que POST n'est pas autorisé
    def test_post_not_allowed(self):
        resp = self.client.post("/api/events/")
        self.assertEqual(resp.status_code, 405)

    # Vérifie que PUT n'est pas autorisé
    def test_put_not_allowed(self):
        resp = self.client.put("/api/events/")
        self.assertEqual(resp.status_code, 405)

    # Vérifie que DELETE n'est pas autorisé
    def test_delete_not_allowed(self):
        resp = self.client.delete("/api/events/")
        self.assertEqual(resp.status_code, 405)


# ── Event Detail API Tests ─────────────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class EventDetailAPITest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def _create(self, **kwargs):
        defaults = {
            "title": "Test Event",
            "date": "2099-09-07 20:00:00",
            "is_published": True,
        }
        defaults.update(kwargs)
        return Event.objects.create(**defaults)

    # Vérifie que l'endpoint retourne 200 pour un événement existant
    def test_detail_returns_200(self):
        event = self._create()
        resp = self.client.get(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 200)

    # Vérifie que l'événement retourné correspond au bon id
    def test_detail_returns_correct_event(self):
        event = self._create(title="Phare Force Rare")
        data = self.client.get(f"/api/events/{event.pk}/").json()
        self.assertEqual(data["title"], "Phare Force Rare")
        self.assertEqual(data["id"], event.pk)

    # Vérifie que les champs attendus sont présents
    def test_detail_response_fields(self):
        event = self._create()
        data = self.client.get(f"/api/events/{event.pk}/").json()
        expected_keys = {"id", "title", "description", "date", "location", "images"}
        self.assertEqual(set(data.keys()), expected_keys)

    # Vérifie que 404 est retourné pour un id inexistant
    def test_detail_404_nonexistent(self):
        resp = self.client.get("/api/events/99999/")
        self.assertEqual(resp.status_code, 404)

    # Vérifie que 404 est retourné pour un événement non publié
    def test_detail_404_unpublished(self):
        event = self._create(is_published=False)
        resp = self.client.get(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 404)

    # Vérifie que le body du 404 contient la clé detail
    def test_detail_404_body_has_detail_key(self):
        resp = self.client.get("/api/events/99999/")
        self.assertIn("detail", resp.json())

    # Vérifie que POST n'est pas autorisé
    def test_post_not_allowed(self):
        event = self._create()
        resp = self.client.post(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 405)

    # Vérifie que DELETE n'est pas autorisé
    def test_delete_not_allowed(self):
        event = self._create()
        resp = self.client.delete(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 405)


# ── EventAdmin Tests ───────────────────────────────────────────────────────────

class EventAdminTest(SimpleTestCase):

    def setUp(self):
        from api.admin import EventAdmin
        self.admin = EventAdmin(model=Event, admin_site=AdminSite())

    # Vérifie que list_display contient les champs attendus
    def test_registered_list_display(self):
        self.assertIn("title", self.admin.list_display)
        self.assertIn("date", self.admin.list_display)
        self.assertIn("is_published", self.admin.list_display)

    # Vérifie que search_fields contient les champs attendus
    def test_registered_search_fields(self):
        self.assertIn("title", self.admin.search_fields)
        self.assertIn("description", self.admin.search_fields)

    # Vérifie que list_filter contient les champs attendus
    def test_registered_list_filter(self):
        self.assertIn("is_published", self.admin.list_filter)
        self.assertIn("date", self.admin.list_filter)

    # Vérifie que EventImageInline est bien enregistré dans les inlines
    def test_inline_registered(self):
        from api.admin import EventImageInline
        self.assertIn(EventImageInline, self.admin.inlines)


# ── File Validator Tests ──────────────────────────────────────────────────────

class ImageFileSizeValidatorTest(SimpleTestCase):

    def test_valid_size_passes(self):
        file = SimpleUploadedFile("ok.png", b"\x00" * 100, content_type="image/png")
        file.size = 100
        validate_image_file_size(file)

    def test_oversized_raises_validation_error(self):
        file = SimpleUploadedFile("big.png", b"\x00", content_type="image/png")
        file.size = MAX_IMAGE_FILE_SIZE + 1
        with self.assertRaises(ValidationError):
            validate_image_file_size(file)

    def test_exact_limit_passes(self):
        file = SimpleUploadedFile("exact.png", b"\x00", content_type="image/png")
        file.size = MAX_IMAGE_FILE_SIZE
        validate_image_file_size(file)


class VideoFileSizeValidatorTest(SimpleTestCase):

    def test_valid_size_passes(self):
        file = SimpleUploadedFile("ok.mp4", b"\x00" * 100, content_type="video/mp4")
        file.size = 100
        validate_video_file_size(file)

    def test_oversized_raises_validation_error(self):
        file = SimpleUploadedFile("big.mp4", b"\x00", content_type="video/mp4")
        file.size = MAX_VIDEO_FILE_SIZE + 1
        with self.assertRaises(ValidationError):
            validate_video_file_size(file)

    def test_exact_limit_passes(self):
        file = SimpleUploadedFile("exact.mp4", b"\x00", content_type="video/mp4")
        file.size = MAX_VIDEO_FILE_SIZE
        validate_video_file_size(file)


# ── Event Detail Past Events Visible Tests ────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class EventDetailPastEventsTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def test_future_event_returns_200(self):
        event = Event.objects.create(
            title="Future",
            date=timezone.now() + timedelta(days=7),
            is_published=True,
        )
        resp = self.client.get(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 200)

    def test_past_event_returns_200(self):
        event = Event.objects.create(
            title="Past",
            date=timezone.now() - timedelta(days=30),
            is_published=True,
        )
        resp = self.client.get(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 200)

    def test_old_event_still_visible(self):
        event = Event.objects.create(
            title="Old",
            date=timezone.now() - timedelta(days=365),
            is_published=True,
        )
        resp = self.client.get(f"/api/events/{event.pk}/")
        self.assertEqual(resp.status_code, 200)


# ── Contact Email Content & Failure Tests ─────────────────────────────────────

@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    CONTACT_EMAIL='test@forcerare.com',
    DEFAULT_FROM_EMAIL='noreply@forcerare.com',
)
class ContactEmailContentTest(SimpleTestCase):

    def _post(self, data):
        return self.client.post(
            "/api/contact/",
            data=json.dumps(data),
            content_type="application/json",
        )

    def test_email_subject_contains_selected_subject(self):
        self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Question générale",
            "message": "Bonjour",
        })
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Question générale", mail.outbox[0].subject)

    def test_email_subject_uses_custom_subject_for_autre(self):
        self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Autre",
            "customSubject": "Mon sujet",
            "message": "Bonjour",
        })
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Mon sujet", mail.outbox[0].subject)

    def test_email_body_contains_sender_info(self):
        self._post({
            "name": "Jean Dupont",
            "email": "jean@test.com",
            "subject": "Question générale",
            "message": "Mon message ici",
        })
        body = mail.outbox[0].body
        self.assertIn("Jean Dupont", body)
        self.assertIn("jean@test.com", body)
        self.assertIn("Mon message ici", body)

    def test_email_sent_to_contact_email(self):
        self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Question générale",
            "message": "Hi",
        })
        self.assertEqual(mail.outbox[0].to, ["test@forcerare.com"])

    def test_email_from_is_default_from_email(self):
        self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Question générale",
            "message": "Hi",
        })
        self.assertEqual(mail.outbox[0].from_email, "noreply@forcerare.com")

    @patch('api.views.send_mail', side_effect=Exception("SMTP down"))
    def test_email_failure_returns_500(self, mock_send):
        resp = self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Question générale",
            "message": "Hi",
        })
        self.assertEqual(resp.status_code, 500)
        self.assertIn("detail", resp.json())

    @patch('api.views.send_mail', side_effect=Exception("SMTP down"))
    def test_email_failure_does_not_leak_exception_details(self, mock_send):
        resp = self._post({
            "name": "Jean",
            "email": "jean@test.com",
            "subject": "Question générale",
            "message": "Hi",
        })
        body = resp.json()
        self.assertNotIn("SMTP", str(body))
        self.assertNotIn("Traceback", str(body))


# ── Event List Ordering Tests ─────────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class EventListOrderingTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def test_events_ordered_by_date(self):
        Event.objects.create(title="Later", date=timezone.now() + timedelta(days=10), is_published=True)
        Event.objects.create(title="Sooner", date=timezone.now() + timedelta(days=1), is_published=True)
        data = self.client.get("/api/events/").json()
        self.assertEqual(data[0]["title"], "Sooner")
        self.assertEqual(data[1]["title"], "Later")

    def test_event_images_ordered_by_display_order(self):
        event = Event.objects.create(
            title="Test",
            date=timezone.now() + timedelta(days=1),
            is_published=True,
        )
        EventImage.objects.create(event=event, file=_create_test_image(), display_order=2, alt_text="second")
        EventImage.objects.create(event=event, file=_create_test_image(), display_order=1, alt_text="first")
        data = self.client.get("/api/events/").json()
        images = data[0]["images"]
        self.assertEqual(images[0]["alt_text"], "first")
        self.assertEqual(images[1]["alt_text"], "second")


# ── Video List Ordering Tests ─────────────────────────────────────────────────

@override_settings(MEDIA_ROOT=TEMP_MEDIA)
class VideoListOrderingTest(TestCase):

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(TEMP_MEDIA, ignore_errors=True)
        super().tearDownClass()

    def test_videos_ordered_by_display_order(self):
        VideoAsset.objects.create(file=_create_test_video(), title="Second", display_order=2, is_published=True)
        VideoAsset.objects.create(file=_create_test_video(), title="First", display_order=1, is_published=True)
        data = self.client.get("/api/videos/").json()
        self.assertEqual(data[0]["title"], "First")
        self.assertEqual(data[1]["title"], "Second")