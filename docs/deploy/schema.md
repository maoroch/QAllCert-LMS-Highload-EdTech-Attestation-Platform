# Схема Деплоя Проекта Qallcert (Deployment Architecture & Flow)

Документ описывает архитектурную схему развертывания, поток сетевого трафика и процесс автоматизации CI/CD для проекта **Qallcert** (`qallcert.com`).

---

## 1. Общая Архитектура Продакшена

```
                                  +-------------------------------------------------+
                                  |                    ПОЛЬЗОВАТЕЛЬ                 |
                                  +------------------------+------------------------+
                                                           |
                                      +--------------------+--------------------+
                                      |                                         |
                               HTTPS (qallcert.com)                    HTTPS (api.qallcert.com)
                                      |                                         |
                                      v                                         v
                      +-------------------------------+         +-------------------------------+
                      |        Vercel Edge Cloud      |         |          VPS Hosting          |
                      |                               |         |                               |
                      |  +-------------------------+  |         |  +-------------------------+  |
                      |  | Front-end (Next.js 16)  |  |         |  | Nginx Reverse Proxy     |  |
                      |  | App Router & Static SSG |  |         |  | (SSL / Certbot 443)    |  |
                      |  +-------------------------+  |         |  +------------+------------+  |
                      +-------------------------------+         |               |               |
                                                                |               v               |
                                                                |  +-------------------------+  |
                                                                |  | Node.js API (Express)   |  |
                                                                |  | Container (Port 3000)   |  |
                                                                |  +----+--------+--------+--+  |
                                                                |       |        |        |     |
                                                                |       |        |        v     |
                                                                |       |        |   +-------+  |
                                                                |       v        v   | MinIO |  |
                                                                |   +-------+ +----+ | S3    |  |
                                                                |   |Postgre| |Re- | +-------+  |
                                                                |   |SQL 16 | |dis |            |
                                                                |   +-------+ +----+            |
                                                                +-------------------------------+
```

---

## 2. Потоки трафика и взаимодействия

### 2.1 Фронтенд -> Бэкенд (API Requests)
1. Браузер пользователя обращается к `https://qallcert.com` (Vercel).
2. Фронтенд отправляет AJAX/REST запросы на `https://api.qallcert.com/api/...`.
3. Запрос поступает на Nginx на VPS (`port 443`).
4. Nginx выполняет терминирование SSL, проверяет rate-limit и проксирует запрос на контейнер `api:3000`.

### 2.2 Публичные ассеты и обложки (MinIO)
1. Изображения курсов запрашиваются по URL `https://api.qallcert.com/public-assets/...`.
2. Nginx перенаправляет данный путь в контейнер `minio:9000/public-assets/...`.
3. Включаются заголовки кэширования `Cache-Control: public, max-age=604800` (7 дней).

---

## 3. Схема CI/CD (GitHub Actions)

```
[ Developer Commit ] ──> Push to `main` branch
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   [ GitHub Action: CI ]        [ GitHub Action: CD ]
   - Validate Node syntax       - Connect via SSH to VPS
   - Build Next.js app          - git pull origin main
                                - docker compose up -d --build
                                - Clean dangling images
              │                             │
              ▼                             ▼
     (Passed / Success)            (Deployed to VPS)
```

---

## 4. Спецификация Контейнеров на VPS

| Контейнер | Образ | Назначение | Порты в Docker | Volume / Данные |
|---|---|---|---|---|
| `nginx` | `nginx:1.27-alpine` | SSL терминирование, реверс-прокси | `80:80`, `443:443` | `certbot_certs`, `certbot_www` |
| `api` | `node:20-alpine` (Custom) | Express REST API сервер | `3000` (внутренний) | - |
| `postgres` | `postgres:16-alpine` | Реляционная БД | `5432` (внутренний) | `postgres_prod_data` |
| `redis` | `redis:7-alpine` | Кэш и очередей задач BullMQ | `6379` (внутренний) | `redis_prod_data` |
| `minio` | `minio/minio:latest` | S3 хранилище файлов | `9000`, `9001` (внутр.) | `minio_prod_data` |
