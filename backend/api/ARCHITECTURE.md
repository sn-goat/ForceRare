# API Architecture (v2)

## Goal
Public read-only media delivery (images + videos) for the Angular frontend.

## Current scope
- Public users can only **read** published images and videos.
- Admin users manage assets in Django Admin.
- No public create/update/delete endpoints yet.

## Models

### ImageAsset
| Field | Type | Notes |
|-------|------|-------|
| `file` | ImageField | Upload to `uploads/images/` |
| `title` | CharField(255) | |
| `alt_text` | CharField(255) | Accessibility text |
| `category` | CharField(20) | `hero`, `founder`, `partner`, `about`, `event`, `general` (default) |
| `is_published` | BooleanField | Default `False` |
| `display_order` | PositiveIntegerField | Default `0` |
| `created_at` | DateTimeField | Auto |
| `updated_at` | DateTimeField | Auto |

### VideoAsset
| Field | Type | Notes |
|-------|------|-------|
| `file` | FileField | Upload to `uploads/videos/` |
| `title` | CharField(255) | |
| `description` | TextField | Blank allowed |
| `category` | CharField(20) | `hero`, `campaign`, `testimonial`, `event`, `general` (default) |
| `thumbnail` | ImageField | Optional, upload to `uploads/videos/thumbnails/` |
| `is_published` | BooleanField | Default `False` |
| `display_order` | PositiveIntegerField | Default `0` |
| `created_at` | DateTimeField | Auto |
| `updated_at` | DateTimeField | Auto |

Both models ordered by `[display_order, -created_at]`.

## Layers
1. **Storage layer**
   - Django media storage (`MEDIA_ROOT`, `MEDIA_URL`).
   - Nginx proxies `/media/` to backend for binary delivery.
   - Local storage in dev; S3-compatible planned for prod.

2. **Catalog layer**
   - `ImageAsset` + `VideoAsset` models store metadata and publication status.
   - Category field enables frontend filtering by section (hero, founder, etc.).

3. **Delivery layer (public API)**
   - `GET /api/images/`        — list published images (`?category=` filter)
   - `GET /api/images/<id>/`   — fetch one published image
   - `GET /api/videos/`        — list published videos (`?category=` filter)
   - `GET /api/videos/<id>/`   — fetch one published video

4. **Back-office layer**
   - Django Admin for upload / edit / publish / ordering.
   - Both models registered with search, filter, display customisation.

## Test coverage
- **69 tests** covering models, API views, and admin config.
- Tests use SQLite `:memory:` (auto-detected via `pytest` in `sys.modules`).

## Why this structure
- Fast to ship now.
- Clean upgrade path for later admin-only API actions.
- Category system maps directly to frontend homepage sections.
- Keeps frontend contract stable while backend grows.

## Planned v3 additions
- Auth endpoints under `/api/auth/...`.
- Admin-only asset endpoints (create/update/delete).
- Validation (max size, mime type, dimensions).
- Optional cloud storage (S3-compatible).
- Pagination on list endpoints.
- Video transcoding / adaptive streaming.
