# Onyx Detailing: Car Detailing Booking System

A full-stack appointment booking system for a single-bay car detailing shop. Customers choose a service, see the real free slots for any day and book in seconds. The shop owner manages bookings, services and time off from a protected admin dashboard.

**Stack:** Java 21 · Spring Boot 3 · Spring Security + JWT · PostgreSQL · Liquibase · React 19 · Vite · Tailwind CSS 4 · Docker
**Deployment:** backend on Railway (Docker), frontend on Vercel

---

## Features

### For customers
- **Service catalogue:** active services with price, duration and category (exterior, interior, packages, premium).
- **Live availability:** pick a date and get only the slots that actually fit the selected service.
- **Booking form:** contact and vehicle details plus optional notes. No account needed.
- **Gallery and About pages** for the shop.

### For the shop owner (admin)
- **JWT-protected dashboard** at `/admin`.
- **Bookings:** view all bookings and move them through their lifecycle: `PENDING → CONFIRMED → COMPLETED`, or `CANCELLED` / `NO_SHOW`.
- **Service management:** create and edit services, change prices and durations, and deactivate services without deleting their history.
- **Time off:** block date ranges (holidays, maintenance) so they never show up as bookable.

---

## How availability works

The scheduling logic lives in `AvailabilityService` and `BookingService`:

1. Look up the **business hours** for that weekday. Closed days return no slots.
2. Generate candidate start times every **30 minutes** between opening and closing.
3. Keep a candidate only if the **whole service duration** fits before closing time and the slot:
   - is not in the past,
   - does not overlap an **active booking** (`PENDING` or `CONFIRMED`),
   - does not overlap an admin **time-off** range.
4. When a booking is submitted, the server **re-checks the slot** instead of trusting the client's earlier availability response. If someone else just took it, the API returns a `409 Conflict` with a friendly message.

Cancelled, completed and no-show bookings free their slot automatically, because only `PENDING`/`CONFIRMED` count as active.

---

## Architecture

```
React SPA (Vite + Tailwind)  ──/api──►  Spring Boot REST API  ──JPA──►  PostgreSQL
   Vercel (SPA + /api rewrite)            Railway (Docker)               schema managed by Liquibase
```

**Backend layout** (`src/main/java/com/ciprian/detailing`):

| Package | Responsibility |
|---|---|
| `web.controller` | `PublicController` (services, availability, bookings), `AdminController`, `AuthController` |
| `web.dto` | Request/response records with Bean Validation |
| `service` | Availability calculation, booking creation and status changes, admin catalogue |
| `entity` / `repository` | JPA entities (`Booking`, `DetailingService`, `BusinessHours`, `TimeOff`, `AdminUser`) and Spring Data repositories |
| `security` | Stateless JWT filter, token service, Spring Security config, CORS |
| `exception` | Global handler mapping domain errors to clean HTTP responses (`404`, `409`, validation `400`) |

**Database:** versioned Liquibase changelogs create every table and seed the default services. Hibernate runs in `validate` mode, so the schema is never changed implicitly.

---

## API overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/services` | Public | Active services, cheapest first |
| `GET` | `/api/availability?serviceId=&date=` | Public | Free slots for a service on a date |
| `POST` | `/api/bookings` | Public | Create a booking (`409` if the slot is taken) |
| `POST` | `/api/auth/login` | Public | Admin login, returns a JWT |
| `POST` | `/api/auth/bootstrap-admin` | Public, once | Creates the first admin account, then permanently disables itself |
| `GET` | `/api/admin/bookings` | Admin | All bookings, newest first |
| `PATCH` | `/api/admin/bookings/{id}/status` | Admin | Change a booking's status |
| `GET` `POST` `PUT` | `/api/admin/services[/{id}]` | Admin | Manage the service catalogue |
| `GET` `POST` `DELETE` | `/api/admin/time-off[/{id}]` | Admin | Manage blocked time ranges |

---

## Running locally

### Prerequisites
Java 21, Maven, Node.js 20+, PostgreSQL (or Docker)

### 1. Database
```bash
docker run -d --name detailing-db -p 5432:5432 \
  -e POSTGRES_DB=car_detailing \
  -e POSTGRES_USER=car_detailing_user \
  -e POSTGRES_PASSWORD=changeme \
  postgres:16
```

### 2. Backend (http://localhost:8080)
```bash
mvn spring-boot:run
```
Liquibase creates the schema and seeds the services on first start.

### 3. Frontend (http://localhost:5173)
```bash
cd frontend
npm install
npm run dev
```

### 4. Create the admin account (one time only)
```bash
curl -X POST http://localhost:8080/api/auth/bootstrap-admin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"choose-a-strong-password"}'
```
Then log in at http://localhost:5173/admin.

### Run the backend with Docker
```bash
docker build -t car-detailing-booking .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/car_detailing \
  -e DB_USERNAME=car_detailing_user -e DB_PASSWORD=changeme \
  -e JWT_SECRET=<a-long-random-secret> \
  car-detailing-booking
```

---

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | HTTP port |
| `DB_URL` | `jdbc:postgresql://localhost:5432/car_detailing` | JDBC URL |
| `DB_USERNAME` / `DB_PASSWORD` | `car_detailing_user` / `changeme` | Database credentials |
| `JWT_SECRET` | dev-only value | **Must** be overridden in production |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated allowed frontend origins |

---

## Deployment

- **Backend:** built with the multi-stage `Dockerfile` (Maven build stage, then a slim JRE 21 runtime) and deployed on **Railway**, configured entirely through environment variables.
- **Frontend:** deployed on **Vercel**. `frontend/vercel.json` proxies `/api/*` to the Railway backend and rewrites every other route to `index.html`, so client-side routes like `/admin` work after a page refresh.
