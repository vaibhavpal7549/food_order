# Copilot Instructions for this Repository

## Build, test, and lint commands

### Frontend (`frontend/`)

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

- `npm run dev` starts Vite (with API proxy to `http://localhost:8000` for `/api` requests).
- `npm run build` is the production build.
- `npm run lint` runs ESLint for `js/jsx`.

### Backend (`backend/`)

```bash
npm install
node server.js
```

- Backend package scripts exist (`start`, `dev`, `prod`, `seeder`), but there is currently no configured backend lint or test script.

### Tests

- There is currently no automated test runner configured in either `backend/package.json` or `frontend/package.json`, so there is no single-test command yet.

## High-level architecture

This is a split MERN-style app with:

1. **Express + MongoDB backend** in `backend/`
2. **React + Vite frontend** in `frontend/`

Backend flow:

- `server.js` loads env from `backend/config/config.env`, connects MongoDB via `db.js`, and starts Express from `app.js`.
- `app.js` mounts versioned API routes under `/api/v1/*`:
  - `/api/v1/eats/stores` (restaurants)
  - `/api/v1/eats/menus` + nested `/:storeId/menus`
  - `/api/v1/eats/items`
  - `/api/v1/eats/cart`
  - `/api/v1/eats/orders`
  - `/api/v1/users` (auth/profile)
  - `/api/v1/payment/*`, `/api/v1/stripeapi`
- Controllers mostly use `catchAsyncErrors` and throw `ErrorHandler`; terminal error formatting is centralized in `middlewares/errors.js`.
- Persistence is Mongoose-based (`models/*`) with cross-model refs (`Restaurant`, `Menu`, `FoodItem`, `Cart`, `Order`, `User`).

Frontend flow:

- `src/main.jsx` wraps the app in Redux Provider (`redux/store.js`).
- `src/App.jsx` defines top-level routes and shared layout (`Header`, `Footer`).
- API requests go through `src/utils/api.js` (`axios` with `baseURL: '/api'` and `withCredentials: true`), which relies on Vite proxy in `vite.config.js`.
- Redux Toolkit is used for app state:
  - `redux/actions/*` for async calls
  - `redux/slices/*` for reducers and UI state

## Key conventions in this codebase

- **Versioned API namespace**: backend endpoints are consistently mounted under `/api/v1/...`.
- **Auth pattern**: protected routes use `authController.protect`; admin-only paths chain `authorizeRoles("admin")`.
- **JWT transport**: backend accepts JWT from either `Authorization: Bearer <token>` or `jwt` cookie; frontend API client always sends credentials.
- **Error handling convention**: async controller handlers are wrapped with `catchAsyncErrors`; operational errors use `ErrorHandler`.
- **Restaurant/menu data modeling**:
  - Menus are grouped categories (`Menu.menu[]`) where each category stores `items` referencing `FoodItem`.
  - Restaurant route nests menu route via `router.use("/:storeId/menus", menuRoutes)`.
- **Cart behavior**: cart is effectively single-restaurant scoped; adding an item from a different restaurant replaces the existing cart.
- **Media object shape**: image/avatar fields are stored as `{ public_id, url }` objects (often in arrays like `images[]`).
- **Env-driven backend behavior**: DB target and keys are sourced from `config/config.env`; `db.js` switches URI based on `NODE_ENV`.
