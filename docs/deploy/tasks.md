# Чек-лист Задач по Развертыванию Продукта (Deployment Tasks)

Этот документ содержит пошаговый список задач для вывода проекта **Qallcert** (`qallcert.com`) в продакшен.

---

## Чек-лист Задач

### 📋 ЭТАП 1: Настройка DNS и Доменов
- [ ] **1.1** Купить / настроить домен `qallcert.com`.
- [ ] **1.2** Добавить A-запись для `@` (или CNAME) со значением `76.76.21.21` (Vercel IP).
- [ ] **1.3** Добавить CNAME-запись для `www` со значением `cname.vercel-dns.com`.
- [ ] **1.4** Добавить A-запись для `api.qallcert.com` со значением IP-адреса вашего VPS.

---

### 📋 ЭТАП 2: Развертывание Front-end на Vercel
- [ ] **2.1** Авторизоваться на Vercel и привязать GitHub репозиторий `maoroch/edu-tech_lms`.
- [ ] **2.2** Выбрать поддиректорию `front-end` как Root Directory проекта.
- [ ] **2.3** Добавить переменные окружения Vercel:
  - `NEXT_PUBLIC_API_URL` = `https://api.qallcert.com/api`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
- [ ] **2.4** Запустить сборку и привязать домен `qallcert.com`.

---

### 📋 ЭТАП 3: Подготовка VPS Сервера
- [ ] **3.1** Установить Docker и Docker Compose на VPS (`curl -fsSL https://get.docker.com | sh`).
- [ ] **3.2** Установить Certbot (`apt install -y certbot`).
- [ ] **3.3** Клонировать репозиторий в `/var/www/qallcert`:
  ```bash
  git clone https://github.com/maoroch/edu-tech_lms.git /var/www/qallcert
  ```
- [ ] **3.4** Получить SSL-сертификат для `api.qallcert.com`:
  ```bash
  certbot certonly --standalone -d api.qallcert.com
  ```
- [ ] **3.5** Создать `.env` файл в `/var/www/qallcert/back-end/.env` на основе шаблона `.env.production.example` и заполнить безопасными секретами.

---

### 📋 ЭТАП 4: Первый запуск Back-end на VPS
- [ ] **4.1** Перейти в `/var/www/qallcert/back-end` и выполнить запуск:
  ```bash
  docker compose -f docker-compose.prod.yml up -d --build
  ```
- [ ] **4.2** Проверить статус контейнеров (`docker compose -f docker-compose.prod.yml ps`).
- [ ] **4.3** Проверить доступность эндпоинта здоровья:
  ```bash
  curl https://api.qallcert.com/health
  ```
- [ ] **4.4** Настроить Cron автообновления SSL сертификатов на VPS:
  ```cron
  0 3 * * * certbot renew --quiet && docker compose -f /var/www/qallcert/back-end/docker-compose.prod.yml exec nginx nginx -s reload
  ```

---

### 📋 ЭТАП 5: Автоматизация CI/CD через GitHub Actions
- [ ] **5.1** Сгенерировать SSH-ключ для GitHub Actions на VPS или использовать существующий.
- [ ] **5.2** Добавить секреты в GitHub (**Settings -> Secrets and variables -> Actions**):
  - `VPS_HOST`: IP-адрес VPS
  - `VPS_USERNAME`: `root` (или имя деплой-пользователя)
  - `VPS_SSH_KEY`: Содержимое приватного SSH ключа
  - `VPS_PORT`: `22`
  - `VPS_APP_DIR`: `/var/www/qallcert`
- [ ] **5.3** Сделать тестовый пуш в `main` и убедиться в успешном прохождении работы `.github/workflows/deploy-backend.yml`.

---

### 📋 ЭТАП 6: Файловая проверка и Валидация
- [ ] **6.1** Зарегистрировать тестового пользователя через фронтенд `https://qallcert.com`.
- [ ] **6.2** Проверить работу загрузки обложки курса и генерации превью из MinIO.
- [ ] **6.3** Убедиться в корректной работе платежных вебхуков Stripe (`https://api.qallcert.com/api/orders/webhook`).
