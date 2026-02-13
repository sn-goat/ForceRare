# ForceRare — Production Notes (No Docker)

## Core security defaults

Set these in environment:

- `DEBUG=False`
- strong random `SECRET_KEY`
- strict `ALLOWED_HOSTS` (domain only)
- `CORS_ALLOWED_ORIGINS` only for trusted frontend origins (or empty if same-origin)

---

## Reverse proxy model

Expose only Nginx to internet (`80/443`).

- Nginx public
- Django (gunicorn) bound to `127.0.0.1:8000` (or private network)
- Firewall allows `80/443`, blocks direct app port

---

## Admin protection

`/admin/` should not be public-open.

Use one or more:

- IP allowlist
- VPN-only access
- Reverse-proxy auth/SSO
- strong admin passwords + MFA

---

## Media and static

- Keep persistent media storage (`MEDIA_ROOT`)
- Serve media through Nginx (or object storage like S3)
- Back up DB and media together

---

## Database

- Use managed MySQL/PostgreSQL in production
- Run migrations during deploy:

```bash
python manage.py migrate
```

---

## Basic pre-deploy checklist

- [ ] `DEBUG=False`
- [ ] secure `SECRET_KEY`
- [ ] correct `ALLOWED_HOSTS`
- [ ] HTTPS enabled
- [ ] admin path restricted
- [ ] DB backups configured
- [ ] media backups configured
