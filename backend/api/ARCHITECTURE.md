# API architecture (v1)

## Goal
Public read-only image delivery for the Angular frontend.

## Current scope
- Public users can only **read** published images.
- Admin users manage images in Django Admin for now.
- No public create/update/delete endpoints yet.

## Layers
1. **Storage layer**
   - Django media storage (`MEDIA_ROOT`, `MEDIA_URL`).
   - File manager foundation (local storage in dev).

2. **Catalog layer**
   - `ImageAsset` model stores metadata and publication status.
   - Key fields: `file`, `title`, `alt_text`, `is_published`, `display_order`.

3. **Delivery layer (public API)**
   - `GET /api/images/` list published images.
   - `GET /api/images/<id>/` fetch one published image.

4. **Back-office layer**
   - Django Admin is used for upload/edit/publish ordering.

## Why this structure
- Fast to ship now.
- Clean upgrade path for later admin-only API actions.
- Keeps frontend contract stable while backend grows.

## Planned v2 additions
- Auth endpoints under `/api/auth/...`.
- Admin-only image endpoints (create/update/delete).
- Validation (max size, mime type, dimensions).
- Optional cloud storage (S3-compatible).
- Pagination and filtering for image list.
