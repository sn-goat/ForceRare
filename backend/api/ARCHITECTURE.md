# API Architecture

## Overview
Public read-only API for the Angular frontend + Django Admin for content management.

## Models

### ImageAsset
| Field | Type | Notes |
|-------|------|-------|
| `file` | ImageField | Upload to `uploads/images/`, validated (extensions + 10MB max) |
| `title` | CharField(255) | |
| `alt_text` | CharField(255) | Accessibility text |
| `category` | CharField(20) | `hero`, `founder`, `partner`, `about`, `general` |
| `is_published` | BooleanField | Default `False` |
| `display_order` | PositiveIntegerField | Default `0` |

### VideoAsset
| Field | Type | Notes |
|-------|------|-------|
| `file` | FileField | Upload to `uploads/videos/`, validated (extensions + 500MB max) |
| `title` | CharField(255) | |
| `description` | TextField | |
| `category` | CharField(20) | `hero`, `campaign`, `testimonial`, `general` |
| `thumbnail` | ImageField | Optional |
| `is_published` | BooleanField | Default `False` |
| `display_order` | PositiveIntegerField | Default `0` |

### Event / EventImage
| Field | Type | Notes |
|-------|------|-------|
| `title` | CharField(255) | |
| `description` | TextField | |
| `date` | DateTimeField | |
| `location` | CharField(255) | |
| `images` | EventImage (FK) | Multiple images per event, validated |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/images/` | GET | List published images (`?category=` filter) |
| `/api/images/<id>/` | GET | Single published image |
| `/api/videos/` | GET | List published videos (`?category=` filter) |
| `/api/videos/<id>/` | GET | Single published video |
| `/api/events/` | GET | List published events |
| `/api/events/<id>/` | GET | Single published event |
| `/api/contact/` | POST | Contact form submission (rate limited) |

## Security
- File upload validation: allowed extensions + max file size
- Input sanitization via `html.escape()`
- Admin panel protected by 2FA (TOTP)
- Login brute-force protection via `django-axes`
- Rate limiting on contact endpoint (nginx: 5 req/min)
- Audit logging via `django-auditlog`

## Storage
- **Dev**: local filesystem (`MEDIA_ROOT`)
- **Production**: DigitalOcean Spaces via `django-storages` + `boto3` (S3-compatible)
