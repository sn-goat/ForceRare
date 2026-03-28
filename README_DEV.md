# ForceRare — Dev Setup

## Quick Start

```bash
git clone <repo-url> && cd ForceRare
cp .env.example .env        # fill in your values
docker compose up -d --build
```

## URLs (dev)

| Service | URL |
|---------|-----|
| Frontend (via nginx) | `http://localhost:8080/` |
| API | `http://localhost:8080/api/images/` |
| Admin panel | `http://localhost:8080/forcerare-control-panel/admin/` |

## Common Commands

```bash
# Start / stop
docker compose up -d --build
docker compose down

# Backend
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
docker compose exec backend flake8 core api
docker compose exec backend pytest

# Frontend
docker compose exec frontend npm run lint
docker compose exec frontend npm run test
```

## Admin Panel

The admin panel requires 2FA (TOTP). On first login you'll be prompted to set up an authenticator app.

1. Go to `/forcerare-control-panel/admin/`
2. Log in with superuser credentials
3. Scan QR code with your authenticator app
4. Upload images/videos/events through the admin interface

## Image Upload Flow

1. Admin panel → Image Assets → Add
2. Select category (`hero`, `founder`, `partner`, `about`, `general`)
3. Set `display_order` (controls position on frontend)
4. Check `is_published`
5. Save → available at `GET /api/images/?category=<category>`
