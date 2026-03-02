import io
import shutil
import tempfile

from PIL import Image
from django.contrib.admin.sites import AdminSite
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, TestCase, override_settings

from .admin import ImageAssetAdmin, VideoAssetAdmin
from .models import ImageAsset, VideoAsset

TEMP_MEDIA = tempfile.mkdtemp()


def _create_test_image(name="test.png", size=(1, 1), fmt="PNG"):
    buf = io.BytesIO()
    Image.new("RGB", size, color="red").save(buf, format=fmt)
    buf.seek(0)
    content_type = f"image/{fmt.lower()}"
    return SimpleUploadedFile(name, buf.read(), content_type=content_type)


def _create_test_video(name="test.mp4"):
    return SimpleUploadedFile(name, b"\x00" * 64, content_type="video/mp4")


# ──────────────────────────────────────────────
# Model unit tests
# ──────────────────────────────────────────────
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
        self.assertEqual(ordered[0], c.pk)  # order=1, newest
        self.assertEqual(ordered[1], b.pk)  # order=1, older
        self.assertEqual(ordered[2], a.pk)  # order=2

    def test_file_stored_under_uploads_images(self):
        img = self._create()
        self.assertTrue(img.file.name.startswith("uploads/images/"))

    def test_default_category_general(self):
        img = self._create()
        self.assertEqual(img.category, "general")

    def test_category_can_be_set(self):
        img = self._create(category="hero")
        self.assertEqual(img.category, "hero")


# ──────────────────────────────────────────────
# API delivery layer tests
# ──────────────────────────────────────────────
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


# ──────────────────────────────────────────────
# Admin registration tests
# ──────────────────────────────────────────────
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


# ──────────────────────────────────────────────
# VideoAsset model tests
# ──────────────────────────────────────────────
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


# ──────────────────────────────────────────────
# Video API delivery layer tests
# ──────────────────────────────────────────────
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


# ──────────────────────────────────────────────
# Video admin tests
# ──────────────────────────────────────────────
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
