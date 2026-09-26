# QAllCert LMS — Highload EdTech & Attestation Platform

> **QAllCert** is a high-performance, fault-tolerant e-learning and teacher attestation management platform built for the Republic of Kazakhstan educational sector. Powered by **Next.js 16 (App Router)**, **Node.js (Express 5)**, **PostgreSQL 16**, **Redis 7 / BullMQ**, and **MinIO (S3)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)
[![MinIO](https://img.shields.io/badge/MinIO-S3--Compatible-purple.svg)](https://min.io/)
[![Benchmark: 10k+ RPS](https://img.shields.io/badge/Benchmark-10%2C000%2B%20RPS-brightgreen.svg)](#load-testing--resilience-benchmarks)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Accreditation & Kazakh Pedagogical Context](#accreditation--kazakh-pedagogical-context)
- [System Architecture](#system-architecture)
- [Highload & Resilience Engineering](#highload--resilience-engineering)
- [Load Testing & Resilience Benchmarks](#load-testing--resilience-benchmarks)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [SEO & Open Web Architecture](#seo--open-web-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Running with Docker](#running-with-docker)
  - [Running Locally (Dev)](#running-locally-dev)
- [Performance & Stress Testing](#performance--stress-testing)
- [API Reference](#api-reference)
- [License](#license)

---

## Overview

**QAllCert LMS** is designed to satisfy the strict requirements of state educational attestation and continuous professional development for pedagogical workers in Kazakhstan:

- **Teachers / Educators:** Browse accredited courses (80 / 86 academic hours), study theory, pass interactive practice modules, complete final attestation tests, and automatically receive accredited digital certificates with unique verification codes and QR links.
- **Instructors / Methodologists:** Manage curriculum modules, upload lessons and materials (up to 200MB), review and grade homework assignments with structured feedback.
- **Attestation Commissions & Ministry Auditors:** Instant verification of certificate authenticity via the public portal (`/certificates/verify/:code`) powered by Redis in-memory lookup.
- **Enterprise Administrators:** Supervise user roles, course publication statuses, revenue reporting, and student enrollments.

---

## Accreditation & Kazakh Pedagogical Context

The platform delivers programs aligned with the pedagogical qualification framework of the Ministry of Education of the Republic of Kazakhstan:

- **Operating Entity:** ТОО «QAllCert»
- **Business Identification Number (BIN / БИН):** `250240001104`
- **Certificate of Accreditation (Куәлік):** `CAAAE № 25/20КА0003` (Accreditation of entities carrying out scientific and scientific-technical activities).
- **Core Certification Courses:**
  1. *«Математика пәні мұғалімдеріне тригонометриялық теңдеулер мен теңсіздіктер» тарауына проблемалық оқыту технологиясын пайдалану* (80 сағат)
  2. *«Python бағдарламалау тілі: теориясы мен практикасы»* (80 сағат)
  3. *«STEAM білім беру: білім алушылармен жұмыс жасау технологиялары мен формалары»* (80 сағат)
  4. *«Білім берудегі жасанды интеллект технологиялары: теориясы мен практикасы»* (86 сағат)

---

## System Architecture

```
                                 ┌──────────────────────────────────────────────┐
                                 │                   Clients                    │
                                 │      Web Browser · Mobile Web · Auditors     │
                                 └──────────────────────┬───────────────────────┘
                                                        │
                                                        ▼
                                 ┌──────────────────────────────────────────────┐
                                 │                 Nginx Proxy                  │
                                 │     :80/:443 · SSL Termination · GZip        │
                                 └──────────────┬────────────────┬──────────────┘
                                                │                │
                        ┌───────────────────────┘                └────────────────────────┐
                        ▼                                                                 ▼
         ┌──────────────────────────────┐                                  ┌──────────────────────────────┐
         │       Next.js Frontend       │                                  │      Express 5 Backend       │
         │   Port 3001 (SSR/SSG/ISR)    │                                  │   Port 3000 (REST / API)     │
         │  Trilingual i18n (KK/RU/EN)  │                                  │   Clean Layered Architecture │
         └──────────────────────────────┘                                  └──────────────┬───────────────┘
                                                                                          │
                                ┌─────────────────────────────────────────────────────────┼────────────────────────────────────────┐
                                │                                                         │                                        │
                                ▼                                                         ▼                                        ▼
                 ┌──────────────────────────────┐                          ┌──────────────────────────────┐         ┌──────────────────────────────┐
                 │        PostgreSQL 16         │                          │           Redis 7            │         │          MinIO (S3)          │
                 │   Pool: Max 30 connections   │                          │      BullMQ Job Queues       │         │   Buckets: `public-assets`   │
                 │ 5s timeout · Connection tune │                          │ 24h Cert Verification Cache  │         │            `course-files`    │
                 └──────────────────────────────┘                          └──────────────┬───────────────┘         └──────────────────────────────┘
                                                                                          │
                                                                                          ▼
                                                                           ┌──────────────────────────────┐
                                                                           │      BullMQ Background       │
                                                                           │     Certificate Worker       │
                                                                           │   Non-blocking PDF/QR gen    │
                                                                           └──────────────────────────────┘
```

---

## Highload & Resilience Engineering

To guarantee zero downtime and maintain sub-second response times during peak teacher attestation periods, the backend implements battle-tested resilience patterns:

1. **Non-Blocking PDF Generation (BullMQ + Redis):**
   - PDF creation with vector seals and QR codes is CPU-heavy. Generating it synchronously would freeze the single Node.js thread for 1–2 seconds.
   - Certificate requests are queued in BullMQ (`certificate-queue`). If the queue is free, it awaits up to 2.5s; otherwise it immediately responds with `{ status: "processing", jobId }`, and the frontend polls for completion.
2. **Streaming Uploads with Zero-RAM Overhead (OOM Protection):**
   - Lesson materials and video files (up to 200MB) are buffered directly to ephemeral disk storage (`multer.diskStorage`) instead of memory buffers.
   - Files are piped straight to MinIO S3 via `fPutObject` with guaranteed cleanup in `finally { fs.promises.unlink() }`.
3. **Database Connection Pool Tuning (PostgreSQL):**
   - Strict connection pool bounds (`max: 30`, `idleTimeoutMillis: 30000`, `connectionTimeoutMillis: 5000`).
   - Global `pool.on('error')` handling prevents uncaught socket exceptions from crashing the process.
4. **Redis Hot-Path Caching:**
   - Public certificate verification (`GET /api/certificates/verify/:code`) queries are cached in Redis with a 24-hour TTL (`EX 86400`). Subsequent checks respond in < 5ms without touching PostgreSQL.
5. **Adaptive Rate Limiting:**
   - Tiered rate limits protecting against brute force and DDoS, with full bypass support (`DISABLE_RATE_LIMIT=true`) for CI/CD load testing.

---

## Load Testing & Resilience Benchmarks

Stress testing executed with `autocannon` against live endpoints:

| Test Scenario | Concurrency | Duration | Total Requests | Average RPS | Latency (p50) | Latency (p97.5) | Latency (p99) | Error Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Load Test (Baseline)** | 50 conns | 25s | **250,157** | **10,006 req/s** | 4 ms | 6 ms | 7 ms | **0.00%** (0 err) |
| **2. Spike Test (Surge)** | 250 conns | 15s | **152,678** | **10,178 req/s** | 23 ms | 31 ms | 39 ms | **0.00%** (0 err) |
| **3. Stress Step 1** | 50 conns | 10s | **104,000** | **10,365 req/s** | 4 ms | 6 ms | 7 ms | **0.00%** (0 err) |
| **4. Stress Step 2** | 150 conns | 10s | **116,000** | **10,556 req/s** | 13 ms | 18 ms | 21 ms | **0.00%** (0 err) |
| **5. Stress Step 3** | 300 conns | 10s | **105,000** | **10,474 req/s** | 27 ms | 35 ms | 43 ms | **0.00%** (0 err) |
| **6. Stress Step 4 (Peak)** | 500 conns | 10s | **106,000** | **10,502 req/s** | 46 ms | 57 ms | 63 ms | **0.00%** (0 err) |

> 🏆 **Result:** Sustained **10,500+ RPS** across >840,000 requests with zero dropped connections and sub-65ms p99 latency at 500 concurrent connections.

---

## Core Features

- 🎓 **Accredited Course Catalog:** Modular structure (Modules → Lessons → Practice → Final Test) with academic hours counter.
- 📜 **QR & PDF Certificate Engine:** Automated generation with official legal entity seal (`CAAAE № 25/20КА0003`, `BIN 250240001104`).
- 🔍 **Certificate Verification Portal:** Accessible by QR code with public validation screen and PDF download.
- 💳 **Payment Processing:** Integrated with Stripe Checkout (ready for Kazakhstani payment gateways: Kaspi Pay, Halyk, Freedom Pay).
- 🌍 **Trilingual Localization:** Kazakh (Қазақша), Russian (Русский), and English (English).
- 🏙️ **Regional Geo-Landing Pages:** Pre-rendered regional landing pages targeting major cities (Алматы, Астана, Шымкент, Қарағанды, Ақтөбе, etc.).
- ✍️ **Pedagogical Blog & SEO Magnets:** Articles and guides tailored to teacher attestation rules.
- 📁 **Object Storage (MinIO):** Secure storage of lesson attachments and course assets with presigned download URLs.

---

## Tech Stack

### Backend
- **Runtime:** Node.js 20+ (ES Modules)
- **Framework:** Express 5
- **Database:** PostgreSQL 16 (Raw SQL queries with connection pooling, zero heavy ORM overhead)
- **Caching & Queues:** Redis 7 + BullMQ
- **Object Storage:** MinIO S3 SDK
- **Document Engine:** PDFKit + QRCode
- **Security:** Helmet, express-rate-limit, Joi validation, JWT (access + refresh)
- **Load Testing:** Autocannon

### Frontend
- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit + Redux Persist
- **Icons:** Lucide React
- **Markdown:** react-markdown + remark-gfm

### Infrastructure
- **Orchestration:** Docker Compose
- **Reverse Proxy:** Nginx (Gzip compression, caching headers, rate limiting)

---

## SEO & Open Web Architecture

- **Semantic HTML & Metadata:** Full OpenGraph, Twitter Cards, and canonical tags generated per course.
- **Structured Data (Schema.org):**
  - `Course` and `EducationalOccupationalCredential` on each course page.
  - `Organization` and `EducationalOrganization` on root layout with official accreditation credentials.
- **Sitemap & Robots:** Dynamic `sitemap.xml` indexing all accredited courses, geo-landings, and blog posts with `hreflang` alternate references (`kk-KZ`, `ru-KZ`).

---

## Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose v2
- Node.js 20+ (for local development)
- PostgreSQL 16+ & Redis 7+ (if running outside Docker)

### Environment Configuration

#### 1. Backend (`back-end/.env`)
```bash
cd back-end
cp .env.example .env
```
Key configuration items:
```env
PORT=3000
NODE_ENV=development

POSTGRES_URI=postgresql://ilassalimov@localhost:5432/lms_edu
REDIS_URL=redis://localhost:6379

JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 2. Frontend (`front-end/.env.local`)
```bash
cd front-end
cp .env.example .env.local
```
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

### Running with Docker

To boot all platform services (PostgreSQL, Redis, MinIO, Backend, Frontend, Nginx):

```bash
docker compose up -d --build
```

Access points:
- **Frontend App:** `http://localhost` (or `http://localhost:3001` direct)
- **Backend API:** `http://localhost/api` (or `http://localhost:3000` direct)
- **API Swagger Docs:** `http://localhost:3000/api-docs`
- **MinIO Console:** `http://localhost:9001` (login: `minioadmin` / `minioadmin`)

---

### Running Locally (Dev)

```bash
# 1. Start auxiliary infrastructure
docker run -d --name minio -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin minio/minio server /data --console-address ":9001"
brew services start redis
brew services start postgresql@17

# 2. Run backend (terminal 1)
cd back-end
npm install
npm run dev

# 3. Run frontend (terminal 2)
cd front-end
npm install
npm run dev
```

---

## Performance & Stress Testing

Run automated benchmarks using the built-in test suite:

```bash
cd back-end

# 1. Baseline Load Test (50 connections, 25 seconds)
npm run test:load

# 2. Spike Test (250 connections burst, 15 seconds)
npm run test:spike

# 3. Multi-Stage Stress Test (50 -> 150 -> 300 -> 500 connections)
npm run test:stress

# 4. Master Sequential Suite (All tests with cooldown pauses)
npm run test:perf
```

> **Tip:** You can target different endpoints by passing the `TEST_ENDPOINT` variable:
> ```bash
> TEST_ENDPOINT=/health npm run test:load
> TEST_ENDPOINT=/api/certificates/verify/SAMPLE_CODE npm run test:load
> ```

---

## API Reference

Interactive API documentation with Swagger UI is hosted at:
- **Local:** `http://localhost:3000/api-docs`

### Key Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Service health & liveness probe |
| `GET` | `/api/courses` | Public | Course catalog (with Redis cache) |
| `GET` | `/api/courses/:id` | Public | Course curriculum & modules |
| `GET` | `/api/certificates/verify/:code` | Public | Public certificate verification (cached) |
| `GET` | `/certificates/:fileName` | Public | Stream certificate PDF from MinIO |
| `POST` | `/api/courses/:id/certificate` | Student | Trigger asynchronous certificate generation |
| `POST` | `/api/orders` | Student | Initiate course purchase checkout |
| `POST` | `/api/orders/stripe/webhook` | Stripe | Webhook for automated instant enrollment |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

© 2026 **QAllCert LMS**. All rights reserved.