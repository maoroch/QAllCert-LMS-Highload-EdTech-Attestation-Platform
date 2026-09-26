# Инструкция по развертыванию проекта Qallcert в Продакшен (Vercel + VPS)

Настоящее руководство описывает пошаговый процесс деплоя:
- **Front-end (Next.js)** -> **Vercel** (`https://qallcert.com`)
- **Back-end & DB (Express, PostgreSQL, Redis, MinIO)** -> **VPS** (`https://api.qallcert.com`)
- **CI/CD** -> **GitHub Actions**

---

## 1. Настройка DNS-записей

В панели вашего DNS-провайдера (Cloudflare, Reg.ru, Namecheap и др.) добавьте записи:

| Тип | Имя / Subdomain | Значение / Назначение | Примечание |
|---|---|---|---|
| **A** | `@` | IP Vercel (`76.76.21.21`) или CNAME `cname.vercel-dns.com` | Фронтенд на Vercel |
| **CNAME** | `www` | `cname.vercel-dns.com` | Редирект на основной фронтенд |
| **A** | `api` | `YOUR_VPS_IP_ADDRESS` | Серверный бэкенд на VPS |

---

## 2. Развертывание Front-end на Vercel

1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard) и нажмите **Add New -> Project**.
2. Подключите ваш GitHub репозиторий `maoroch/edu-tech_lms`.
3. Задайте параметры проекта:
   - **Framework Preset**: Next.js
   - **Root Directory**: `front-end` (обязательно выберите подпапку фронтенда!)
   - **Build Command**: `npm run build`
4. В разделе **Environment Variables** добавьте:
   - `NEXT_PUBLIC_API_URL` = `https://api.qallcert.com/api`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_your_key`
5. Нажмите **Deploy**.
6. Перейдите в **Project Settings -> Domains** и привяжите ваш домен `qallcert.com`.

---

## 3. Первичная настройка VPS хостинга

### 3.1 Установка Docker & Docker Compose

Подключитесь к VPS по SSH:
```bash
ssh root@YOUR_VPS_IP
```

Установите Docker и Docker Compose (для Ubuntu/Debian):
```bash
apt update && apt install -y curl git certbot
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 3.2 Клонирование репозитория

```bash
mkdir -p /var/www/qallcert
cd /var/www/qallcert
git clone https://github.com/maoroch/edu-tech_lms.git .
```

### 3.3 Выпуск SSL-сертификата (Let's Encrypt / Certbot)

Для выпуска SSL-сертификата для `api.qallcert.com`:
```bash
certbot certonly --standalone -d api.qallcert.com
```
*Сертификаты будут сохранены в `/etc/letsencrypt/live/api.qallcert.com/`.*

### 3.4 Настройка `.env` файла бэкенда

Перейдите в папку бэкенда и создайте рабочий `.env`:
```bash
cd /var/www/qallcert/back-end
cp .env.production.example .env
nano .env
```
Заполните продакшен-пароли и ключи:
- `POSTGRES_PASSWORD`
- `JWT_SECRET` (сгенерируйте через `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET`
- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

### 3.5 Запуск контейнеров бэкенда

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Проверьте статус контейнеров:
```bash
docker compose -f docker-compose.prod.yml ps
```
А также работоспособность эндпоинта:
```bash
curl https://api.qallcert.com/health
```
*(Ожидаемый ответ: `{"status":"ok",...}`)*

---

## 4. Настройка CI/CD в GitHub Actions

Для того чтобы бэкенд на VPS автоматически обновлялся при пуше в ветку `main`, добавьте секреты в GitHub Репозитории:

1. Перейдите в GitHub: **Settings -> Secrets and variables -> Actions -> New repository secret**.
2. Создайте следующие секреты:

| Имя Секрета | Описание | Пример значения |
|---|---|---|
| `VPS_HOST` | IP-адрес вашего VPS сервера | `185.123.45.67` |
| `VPS_USERNAME` | Имя SSH пользователя | `root` |
| `VPS_SSH_KEY` | Приватный SSH ключ для доступа к VPS | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT` | SSH порт (по умолчанию 22) | `22` |
| `VPS_APP_DIR` | Путь к директории проекта на VPS | `/var/www/qallcert` |

Теперь при каждом коммите/пуше в ветку `main` в папку `back-end/`:
- GitHub Actions запустит workflow `.github/workflows/deploy-backend.yml`.
- Автоматически подключится к VPS по SSH.
- Выполнит `git pull origin main`.
- Пересоберет и перезапустит Docker контейнеры в фоне без простоя.

---

## 5. Полезные команды обслуживания на VPS

### Просмотр логов бэкенда
```bash
cd /var/www/qallcert/back-end
docker compose -f docker-compose.prod.yml logs -f api
```

### Ручное обновление бэкенда (без GitHub Actions)
```bash
cd /var/www/qallcert
git pull origin main
cd back-end
docker compose -f docker-compose.prod.yml up -d --build
```

### Просмотр логов Nginx / SSL
```bash
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Автопродление SSL-сертификатов
Добавьте задачу в cron на VPS:
```bash
crontab -e
```
Добавьте строчку:
```cron
0 3 * * * certbot renew --quiet && docker compose -f /var/www/qallcert/back-end/docker-compose.prod.yml exec nginx nginx -s reload
```
