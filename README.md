# Job Tracker

A fullstack application for tracking job applications during your job search. Built with React (Vite), Express.js, and MongoDB Atlas.

## Problem it solves

Keeping track of multiple job applications, interview dates, and contact information across different companies is messy. This app centralizes everything in one place with real-time statistics and status tracking.

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas account with a cluster and connection string
- Git

## Setup (under 5 minutes)

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd job-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Replace `MONGODB_URI` with your actual MongoDB Atlas connection string
   - Keep `PORT=5000`

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   cd ..
   npm run dev
   ```
   - Frontend runs at `http://localhost:5173`
   - Backend API runs at `http://localhost:5000`

## Database Collections

- **companies** — Employers with location, industry, and size
- **applications** — Job applications linked to companies via ObjectId, with salary range, status, and notes
- **contacts** — People at companies for networking and follow-ups

## API Endpoints

### Applications (main entity)
- `GET /api/applications` — List all (optional `?status=` filter)
- `GET /api/applications/:id` — Get one with populated company
- `POST /api/applications` — Create new
- `PUT /api/applications/:id` — Update
- `DELETE /api/applications/:id` — Delete

### Relational endpoints
- `GET /api/applications/company/:companyId` — All applications for a company
- `GET /api/companies/:id` — Company details
- `GET /api/contacts` — Contacts with company info

### Statistics
- `GET /api/stats/application-summary` — Total count, status breakdown, avg response time, recent applications
- `GET /api/stats/company-stats` — Application count per company

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Express.js + Mongoose
- **Database:** MongoDB Atlas
- **Dev tools:** concurrently, nodemon

## Project Structure

```
job-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   └── src/
│       └── components/
│           ├── ApplicationForm.jsx
│           ├── ApplicationList.jsx
│           └── StatsCard.jsx
└── package.json
```
