# 🚀 CareerConnect - Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Prerequisites Check

Make sure you have installed:
- ✅ Node.js (v16+): Run `node --version`
- ✅ MySQL (v8.0+): Run `mysql --version`
- ✅ npm: Run `npm --version`

---

### 2️⃣ Database Setup

1. **Start MySQL Server** (if not running)

2. **Open MySQL Command Line or Workbench**

3. **Create Database:**
```sql
CREATE DATABASE careerconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. **Import Schema:**
```bash
# Navigate to backend folder
cd backend

# Import database (Windows)
mysql -u root -p careerconnect < database.sql
```

**OR manually in MySQL Workbench:**
- File → Open SQL Script → Select `backend/database.sql` → Execute

---

### 3️⃣ Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure .env file:**
Edit `backend/.env` and update:
```env
DB_PASSWORD=your_mysql_password_here
```

4. **Start backend server:**
```bash
npm run dev
```

✅ Backend should now be running on: **http://localhost:5000**

---

### 4️⃣ Frontend Setup

1. **Open a NEW terminal window**

2. **Navigate to frontend folder:**
```bash
cd frontend
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start frontend server:**
```bash
npm run dev
```

✅ Frontend should now be running on: **http://localhost:5173**

---

### 5️⃣ Access the Application

Open your browser and go to: **http://localhost:5173**

---

## 🔑 Login Credentials

### Admin
- Email: `admin@careerconnect.com`
- Password: `admin123`

### Employer
- Email: `employer@techcorp.com`
- Password: `employer123`

### Job Seeker
- Email: `seeker@example.com`
- Password: `seeker123`

---

## 🐛 Troubleshooting

### Database Connection Error
- Make sure MySQL is running
- Check DB_PASSWORD in `.env`
- Verify database `careerconnect` exists

### Port Already in Use
- Backend (5000): Change PORT in `backend/.env`
- Frontend (5173): Change port in `frontend/vite.config.js`

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

## 📦 Project Structure

```
CareerConnect2.0/
├── backend/          # Node.js + Express API
├── frontend/         # React.js Application
└── README.md         # Main documentation
```

---

## ✅ Verify Installation

1. Backend health check: http://localhost:5000/api/health
2. Frontend loads: http://localhost:5173
3. Login works with demo credentials
4. Browse jobs page

---

## 🎉 You're All Set!

Start exploring CareerConnect:
- **Job Seekers**: Browse and apply for jobs
- **Employers**: Post jobs and manage applications
- **Admins**: Manage users and approve jobs

---

Need help? Check the main README.md for detailed documentation!
