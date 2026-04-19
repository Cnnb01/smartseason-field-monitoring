# SmartSeason: Field Monitoring System

A full-stack monorepo designed for agricultural field management, enabling real-time status tracking and role-based access for Admins and Field Agents.

## Project Overview
SmartSeason allows agents to log field activities and observations. The system automatically calculates field health based on activity logs, marking fields as **"AT RISK"** if certain keywords (pest, disease, or wilt.) are detected or if no updates have been logged for over 7 days.

### Tech Stack
* **Backend:** Django (Python 3.12+), Django REST Framework, SimpleJWT.
* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Axios.
* **Database:** SQLite (Development/Demo).
* **Environment:** Developed on Fedora Linux.

---

## Key Design Decisions

### 1. Custom User Model & RBAC
Used a custom `User` model to implement **Role-Based Access Control (RBAC)**.
* **Admins:** Have a global view of all fields and status summaries.
* **Agents:** Restricted to viewing and updating only the fields assigned to them.
* **Security:** Filtering is performed at the **Database level** within the Django ViewSet `get_queryset` method to ensure data isolation.

### 2. Computed Field Status
The `status` of a field is not a static database column but a **computed property**.
* **Active:** Recent updates with no issues.
* **At Risk:** Automatically triggered if the latest note contains keywords like *"pest"* or *"disease"*, or if the field has not been updated for over 7 days.
* **Timezone:** Optimized for `Africa/Nairobi` to ensure accurate tracking for local agricultural cycles.

### 3. Authentication & Security
Implemented **JWT (JSON Web Tokens)** for stateless authentication. The frontend uses a custom Axios instance to automatically attach the `Authorization` header to all secured requests.

---

## Local Setup & Demo Instructions

### Prerequisites
* Python 3.12+
* Node.js (v18+)

### 1. Backend Setup
```bash
cd Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations 
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend Setup
```bash
# In a new terminal
cd Frontend
npm install
npm run dev
```