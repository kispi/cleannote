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
- **Date Handling:** `dayjs` only. (No `moment`, avoid raw `Date` complexity).
- **State Management:**
  - **Server:** TanStack Query.
  - **Client:** Svelte 5 Runes.
- **Dependencies:** Minimize 3rd-party libraries. Use native web APIs where possible.

## 3. Database Modeling (Drizzle ORM)

- **Naming:**
  - Table names **MUST be Plural** (e.g., `users`, `buildings`).
  - Columns: `snake_case`.
  - TS Properties: `camelCase`.
- **Base Model Structure:**
  - `id`: BigInt, Autoincrement, Primary Key.
  - `created_at`: Timestamp, default `CURRENT_TIMESTAMP`.
  - `updated_at`: Timestamp, default `CURRENT_TIMESTAMP`, on update now.
  - `deleted_at`: Timestamp, Nullable (for Soft Delete).
- **Soft Delete:** REQUIRED for all models. Queries must explicitly filter `WHERE deleted_at IS NULL`.

## 4. API Design (Strict REST)

- **Endpoints:** Noun-based only (e.g., `/api/buildings`). NO verbs in URLs.
- **Methods:**
  - `GET`: Read
  - `POST`: Create
  - `PUT`: Update (Full/Partial)
  - `DELETE`: Soft Delete action
- **Response:** JSON format.

## 5. UI Components & Patterns

- **Global UI Helpers:**
  - Do NOT embed Modal/Toast components in pages.
  - Use global helpers via Javascript: e.g., `ui.modal.show()`, `ui.toast.show()`.
- **Modal Conventions:**
  - **Path:** All modal components must be in `@/lib/components/modals/`.
  - **Naming:** Must start with `Modal` (e.g., `ModalBuildingAdd.svelte`).
- **Optimistic UI:** Implement only when requested or critical for perceived performance.

## 6. Directory Structure

- `src/lib/server/db`: Schema and connection.
- `src/lib/components/modals`: Modal components only.
- `src/lib/store`: Global runes-based stores (UI helpers).
