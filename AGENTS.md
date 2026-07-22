# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Map
- Backend: `backend/` (Express + MongoDB/Mongoose API).
- Frontend: `frontend/` (React + Vite + Redux Toolkit).
- API base path pattern: `/api/v1/*` (mounted in `backend/app.js`).

## Source Of Truth
- Start with top-level docs: [README.md](README.md)
- Frontend template notes: [frontend/README.md](frontend/README.md)
- Backend env and runtime config: `backend/config/config.env`

## Setup And Run
- Backend install: `cd backend && npm install`
- Backend dev: `npm run dev`
- Backend prod: `npm run prod`
- Backend seed data: `npm run seeder`
- Frontend install: `cd frontend && npm install`
- Frontend dev: `npm run dev`
- Frontend build: `npm run build`
- Frontend lint: `npm run lint`
- Frontend preview: `npm run preview`

## Architecture Boundaries
- Backend routing lives in `backend/routes/`; business logic in `backend/controllers/`; data schemas in `backend/models/`.
- Shared backend error flow:
  - Throw/create errors with `backend/utils/errorHandler.js`.
  - Wrap async controllers using `backend/middlewares/catchAsyncErrors.js`.
  - Keep global error middleware last in `backend/app.js`.
- Frontend state flow:
  - API calls in `frontend/src/redux/actions/`.
  - State in `frontend/src/redux/slices/`.
  - Root store in `frontend/src/redux/store.js`.
  - Axios client in `frontend/src/utils/api.js`.

## Conventions To Follow
- Keep existing CommonJS style in backend files (`require/module.exports`).
- Keep existing ESM style in frontend files (`import/export`).
- Reuse existing response/error handling patterns in touched areas; do not introduce a third response shape.
- When adding backend routes, mount them explicitly in `backend/app.js`.
- Prefer minimal, targeted edits; avoid broad refactors unless requested.

## Known Pitfalls
- Response and error payload shapes vary across controllers; frontend often uses fallback extraction (`message`, `errMessage`, etc.). Preserve compatibility for existing consumers.
- Frontend relies on Vite dev proxy (`/api`), while backend CORS uses `FRONTEND_URL` fallback `http://localhost:5173`.
- Some repo memory notes indicate recent fixes around auth/error middleware and Redux imports; verify imports/file names before editing related modules.

## Security And Secrets
- Never print, rotate, or commit real secrets from `backend/config/config.env`.
- If changing config behavior, keep env-variable based access patterns intact and avoid hardcoding credentials.

## High-Value Files
- `backend/app.js`
- `backend/server.js`
- `backend/middlewares/errors.js`
- `backend/middlewares/catchAsyncErrors.js`
- `backend/controllers/authController.js`
- `backend/routes/auth.js`
- `frontend/src/redux/store.js`
- `frontend/src/utils/api.js`
