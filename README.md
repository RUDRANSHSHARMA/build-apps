# Rudransh Sharma Design & Content

Full-stack website with public pages, client dashboard, admin dashboard, and REST API.

## Features
- Public marketing site with services, portfolio, blog, and contact
- Client dashboard (orders, new order, profile, payments, messages)
- Admin dashboard (orders, clients, blog, settings)
- REST API with JWT authentication
- PostgreSQL database schema
- File uploads (up to 10MB)

## Tech Stack
- Frontend: Static HTML + Tailwind CDN + Vanilla JS
- Backend: Node.js + Express
- Database: PostgreSQL

## Setup Instructions

### 1) Install dependencies
```bash
cd /home/user/webapp
npm install
```

### 2) Configure environment
```bash
cp .env.example .env
```
Update the `.env` with PostgreSQL and SMTP credentials.

### 3) Create database
```bash
createdb rudransh_website
psql -d rudransh_website -f database/schema.sql
```

### 4) Run the server
```bash
npm run dev
```
Visit `http://localhost:5000`.

## File Structure
```
public/            # HTML, CSS, JS
server/            # Express API
database/schema.sql
```

## API Summary
- POST /api/register
- POST /api/login
- GET /api/services
- GET /api/blog
- GET /api/portfolio
- POST /api/orders (auth)
- GET /api/orders (auth)
- /api/admin/* (admin)

## Notes
- API requests require `Authorization: Bearer <token>` for protected routes.
- Uploads are served from `/uploads`.
