# HRMS Lite

A lightweight, modern Human Resource Management System built with **Django REST Framework** (backend) and **React + Vite** (frontend), backed by **PostgreSQL**.




- <img width="1906" height="950" alt="Screenshot 2026-03-12 035450" src="https://github.com/user-attachments/assets/ec26f04b-5440-4b05-a266-98533b81c2e1" />





---

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React 19, Vite, Axios, React Router |
| Backend   | Django 4, Django REST Framework |
| Database  | PostgreSQL                     |
| Styling   | Vanilla CSS (dark theme, Inter font) |

---

## Features

- **Dashboard** — summary cards (total employees, attendance, present/absent)
- **Employee Management** — add, search, delete employees with validation
- **Attendance Tracking** — mark daily attendance, filter by date/employee/status
- **Employee Summary** — per-employee present/absent stats
- **Validation** — unique employee ID, unique email, no duplicate attendance per day
- **UX** — loading spinners, empty states, error alerts, responsive layout

---

## Project Structure

```
hh/
├── backend/                  # Django project
│   ├── hrms/                 # project settings & urls
│   ├── employees/            # app: models, serializers, views, urls
│   ├── .env                  # local env vars (do not commit)
│   ├── .env.example
│   ├── requirements.txt
│   ├── Procfile
│   └── manage.py
├── frontend/                 # React + Vite project
│   ├── src/
│   │   ├── api/axios.js      # Axios instance & API helpers
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Dashboard, Employees, Attendance
│   │   ├── App.jsx
│   │   └── App.css           # Full design system
│   ├── .env                  # local env vars (do not commit)
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
└── README.md
```

---

## How to Run Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running on `localhost:5432`

### 1. Backend

```bash
cd backend

# Create & activate virtual env (optional)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Start dev server
python manage.py runserver
```

Backend runs at **http://localhost:8000**

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Endpoints

| Method | URL                              | Description                      |
|--------|----------------------------------|----------------------------------|
| GET    | `/api/dashboard/`               | Dashboard summary counts         |
| GET    | `/api/employees/`               | List all employees               |
| POST   | `/api/employees/`               | Create new employee              |
| GET    | `/api/employees/{id}/`          | Get single employee              |
| DELETE | `/api/employees/{id}/`          | Delete employee                  |
| GET    | `/api/attendance/`              | List attendance (filterable)     |
| POST   | `/api/attendance/`              | Mark attendance                  |
| GET    | `/api/attendance/{employee_id}/`| Employee attendance + summary    |

---

## Environment Variables

### Backend (`backend/.env`)
```env
DEBUG=True
SECRET_KEY=********
DATABASE_NAME=********
DATABASE_USER=********
DATABASE_PASSWORD=********
DATABASE_HOST=********
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Assumptions

- Single admin user — no authentication required
- PostgreSQL is pre-installed and running locally
- The database `postgres` already exists (default PostgreSQL database)
- CORS is open for development; restrict in production
- Attendance status is limited to **Present** or **Absent**
- One attendance record per employee per day (enforced by unique constraint)
-









































































