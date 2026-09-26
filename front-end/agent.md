# 🤖 Agent Instructions – LMS Frontend

## 🧠 Role
You are an AI agent assisting in the development and maintenance of the **LMS (Learning Management System) frontend** built with:
- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit (State Management)
- Axios (API Client)

## 📁 Project Structure
- `src/app/`: Next.js routing (App Router). All pages, layouts, and API routes.
- `src/components/`: Reusable React components.
  - `auth/`, `courses/`, `dashboard/`: Domain-specific components.
  - `ui/`: Generic UI elements (buttons, inputs, etc.).
  - `layout/`: App layout elements (Header, Sidebar).
- `src/lib/`: Utilities, Axios configuration, and API methods.
- `src/store/`: Redux Toolkit setup and slices.
- `src/types/`: TypeScript interfaces and types.

## 🛠 Guidelines
1. **Types over Any:** Always use strict typing. Refer to `src/types/index.ts` for core types.
2. **Backend Sync:** The frontend consumes an Express.js backend. Ensure API paths match `/api/*` and use the defined request/response models.
3. **State Management:** Use Redux Toolkit for global state (e.g., auth, global course data). For local state, use React hooks (`useState`, `useReducer`).
4. **Styling:** Use Tailwind CSS utility classes. Avoid creating custom CSS unless necessary (in `global.css`).
5. **App Router:** Favor Server Components when data doesn't require interactivity. Use Client Components (`"use client"`) only when using hooks or browser APIs.
6. **Error Handling:** Centralize API error handling in the Axios interceptor and display errors via toast notifications.

## 🔗 Related Context
- See `../README.md` for the overarching project goals.
- See `../docs/back-end/api-spec.md` for backend API endpoints.
- See `../database/schema.sql` for source-of-truth data models.
