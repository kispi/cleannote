---
trigger: always_on
---

# Project Development Rules

## 0. Agent Behavior & Workflow

- **Language:** The agent's final response **MUST always be in Korean**.
- **Env:** The author is mainly using Windows 11, so always try PowerShell cmd first.
- **Documentation:** When implementing new features or critical changes, always review `README.md` and update it to reflect the current state.
- **Cleanup:** Do not leave temporary log files (e.g., `.txt`) used for checking results. Always clean them up.

## 1. Core Philosophy (UX & Performance)

- **Toss-like Simplicity:** The UI must be extremely intuitive. Minimal inputs, clear text, and big interactive elements. If a user needs a tutorial, the design is wrong.
- **Low-End Optimization:** Prioritize FCP (First Contentful Paint) and minimize main-thread blocking. Keep bundle size small.

## 2. Coding Standards & Tech Stack

- **General:** 2 spaces indent, no semicolon, always try single quote first when possible.
- **Framework:** SvelteKit (Latest) + Svelte 5 Runes (`$state`, `$derived`, `$effect`).
- **Styling:** Tailwind CSS.
- **Avoid using 'any':** While it's almost impossible not to use any 'any', avoid using it when possible.
- **Date Handling:** `dayjs` only. (No `moment`, avoid raw `Date` complexity).
- **State Management:**
  - **Server:** TanStack Query.
  - **Client:** Svelte 5 Runes.
- **Dependencies:** Minimize 3rd-party libraries. Use native web APIs where possible.
- **Functional Programming:** Avoid using Classes. Use simple functions or factory functions with closures for state management and logic.

## 3. Database Modeling (Drizzle ORM)

- **Naming:**
  - Table names **MUST be Plural** (e.g., `users`, `buildings`).
  - Columns: `snake_case`.
  - TS Properties: `camelCase`.
  - JSON Fields: **MUST be camelCase**. No `snake_case` in JSON data stored in DB or used in App.
- **Base Model Structure:**
  - `id`: BigInt, Autoincrement, Primary Key.
  - `created_at`: Timestamp, default `CURRENT_TIMESTAMP`.
  - `updated_at`: Timestamp, default `CURRENT_TIMESTAMP`, on update now.
  - `deleted_at`: Timestamp, Nullable (for Soft Delete).
- **Soft Delete:** REQUIRED for all models. Queries must explicitly filter `WHERE deleted_at IS NULL`.
- **Timezone:** All timestamps stored in the database MUST be in **UTC**.

## 4. API Design (Strict REST)

- **Endpoints:** Noun-based only (e.g., `/api/buildings`). NO verbs in URLs.
- **Methods:**
  - `GET`: Read
  - `POST`: Create
  - `PUT`: Update (Full/Partial)
  - `DELETE`: Soft Delete action
- **Parameters:** `DELETE` and `PUT` requests MUST use URL parameters (e.g., `/api/items/123`), NOT query parameters (e.g., `/api/items?id=123`).
- **Response:** JSON format.
- **Architecture:** Do NOT use SvelteKit Server Actions (`?/action`). All mutations MUST be done via client-side `fetch` calls to these REST API endpoints.

## 5. UI Components & Patterns

- **Global UI Helpers:**
  - Do NOT embed Modal/Toast components in pages.
  - Use global helpers via Javascript: e.g., `ui.modal.show()`, `ui.toast.show()`.
- **Form Elements:**
  - Use `<Dropdown />` instead of native `<select>` for better styling and control.
- **Modal Conventions:**
  - **Path:** All modal components must be in `@/lib/components/modals/`.
  - **Naming:** Must start with `Modal` (e.g., `ModalBuildingAdd.svelte`).
- **Optimistic UI:** Implement only when requested or critical for perceived performance.
- **Component Class Naming:** ALL components must have a root-level class name corresponding to their filename in `dash-case` (e.g., `LoginButton.svelte` -> `class="login-button"`).
- **Responsive Breakpoints:** Use standard Tailwind breakpoints.
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - App should utilize full screen on desktop, not limited to mobile view.
- **Button Styling:**
  - Use `.btn-default` (Gray/Secondary) and `.btn-primary` (Brand Color) classes defined in global CSS.
  - Avoid ad-hoc Tailwind utility strings for buttons (e.g. `bg-blue-600 rounded-xl ...`).
- **Internationalization (i18n):**
  - Use structured JSON objects for translation keys (e.g. `building: { add: "..." }`).
  - NEVER hardcode locale checks in templates (e.g. `locale === 'ko' ?`). Always use translation keys.
- **Formatting:**
  - Always use 2-space indentation for all new files.

## 6. Directory Structure

- `src/lib/server/db`: Schema and connection.
- `src/lib/components/modals`: Modal components only.
- `src/lib/store`: Global runes-based stores (UI helpers).