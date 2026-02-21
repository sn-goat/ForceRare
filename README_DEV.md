# ForceRare — Dev Runbook (Docker)

## Quick start

```bash
cd /home/snfib/ForceRare
docker compose up -d --build
```

Use this when dependencies/Dockerfiles changed or after a long pause.

---

## URLs

- Frontend (nginx): `http://localhost:8080/`
- API list: `http://localhost:8080/api/images/`
- Backend direct: `http://localhost:8000/`
- Django admin (current setup): `http://localhost:8000/admin/`


---

## Backend workflow

Start backend only:

```bash
docker compose up backend
```

Run backend lint/tests:

```bash
docker compose exec backend flake8 core api
docker compose exec backend pytest
```

Run migrations:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Create/reset admin user:

```bash
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py changepassword <username>
```

---

## Frontend workflow

Start frontend only:

```bash
docker compose up frontend
```

Run frontend lint/tests:

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run test
```

---

## Combined startup options

```bash
docker compose up backend frontend
docker compose up
```

---

## Shutdown order

1. `Ctrl+C` (stop foreground process)
2. Stop all containers:

```bash
docker compose down
```

3. Confirm nothing is still running:

```bash
docker compose ps
```

---

## If backend mismatch iptables-legacy vs nf_tables

1. Stop everything cleanly (service + socket)
sudo systemctl stop docker docker.socket containerd

2. Use nft backend consistently
sudo update-alternatives --set iptables /usr/sbin/iptables-nft
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-nft
sudo update-alternatives --set arptables /usr/sbin/arptables-nft 2>/dev/null || true
sudo update-alternatives --set ebtables /usr/sbin/ebtables-nft 2>/dev/null || true

3. Remove stale Docker networks/bridges
docker network prune -f || true
sudo ip link delete docker0 2>/dev/null || true

4. Start Docker again
sudo systemctl start docker

5.  Verify backend now
iptables --version
ip6tables --version
docker info | grep -i -E "Firewall Backend|iptables"

6.  Retry compose
docker compose up -d

## Database check (MySQL)

Confirm Django DB engine:

```bash
docker compose exec backend python manage.py shell -c "from django.conf import settings; print(settings.DATABASES['default']['ENGINE'])"
```

Count image rows:

```bash
docker compose exec db sh -lc 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE; SELECT COUNT(*) AS image_count FROM api_imageasset;"'
```

---

## Image flow (current)

1. Login to Django admin
2. Add `ImageAsset`
3. Upload file
4. Set `is_published=True`
5. Save
6. Verify via `GET /api/images/`
