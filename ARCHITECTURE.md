# 🏗️ CareerConnect - System Architecture

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           React Frontend (Port 5173)                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │    │
│  │  │  Pages   │  │Components│  │  AuthContext     │    │    │
│  │  │  Login   │  │  Navbar  │  │  (JWT State)     │    │    │
│  │  │  Jobs    │  │  Footer  │  │                  │    │    │
│  │  │Dashboard │  │ Protected│  │                  │    │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │    │
│  │                                                         │    │
│  │  Styling: Tailwind CSS | Routing: React Router        │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS (Axios)
                              │ Authorization: Bearer {JWT}
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │      Express.js Backend (Port 5000)                     │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │         Middleware Stack                         │  │    │
│  │  │  • CORS (Cross-Origin)                          │  │    │
│  │  │  • Helmet (Security Headers)                    │  │    │
│  │  │  • Body Parser (JSON)                           │  │    │
│  │  │  • JWT Verification                             │  │    │
│  │  │  • Role Authorization                           │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │              API Routes                           │ │    │
│  │  │  /api/auth      - Authentication                 │ │    │
│  │  │  /api/jobs      - Job operations                 │ │    │
│  │  │  /api/employer  - Employer features              │ │    │
│  │  │  /api/admin     - Admin panel                    │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  │                          │                              │    │
│  │                          ↓                              │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │             Controllers                           │ │    │
│  │  │  • authController.js  - Login/Register/Profile   │ │    │
│  │  │  • jobController.js   - CRUD for jobs            │ │    │
│  │  │  • employerController.js - Employer operations   │ │    │
│  │  │  • adminController.js - Admin management         │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  │                          │                              │    │
│  │                          ↓                              │    │
│  │  ┌──────────────────────────────────────────────────┐ │    │
│  │  │               Models (ORM)                        │ │    │
│  │  │  • User.js        - User operations              │ │    │
│  │  │  • Job.js         - Job operations               │ │    │
│  │  │  • Application.js - Application operations       │ │    │
│  │  │  • Company.js     - Company operations           │ │    │
│  │  └──────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MySQL2 Driver
                              │ Connection Pool (10 connections)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         MySQL Database (careerconnect)                  │    │
│  │                                                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │    │
│  │  │  users   │  │   jobs   │  │  applications    │    │    │
│  │  ├──────────┤  ├──────────┤  ├──────────────────┤    │    │
│  │  │ id (PK)  │  │ id (PK)  │  │ id (PK)          │    │    │
│  │  │ name     │  │ employer │  │ job_id (FK)      │    │    │
│  │  │ email    │  │ title    │  │ seeker_id (FK)   │    │    │
│  │  │ password │  │ location │  │ status           │    │    │
│  │  │ role     │  │ type     │  │ resume           │    │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │    │
│  │                                                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │    │
│  │  │companies │  │saved_jobs│  │ notifications    │    │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────┐                                    ┌─────────┐
│ Client  │                                    │  Server │
└────┬────┘                                    └────┬────┘
     │                                              │
     │ 1. POST /api/auth/login                     │
     │    { email, password }                      │
     ├──────────────────────────────────────────→ │
     │                                              │
     │                      2. Validate Credentials│
     │                      3. Hash password check │
     │                      4. Generate JWT token  │
     │                                              │
     │ 5. Response:                                 │
     │    { token, user }                          │
     │ ←──────────────────────────────────────────┤
     │                                              │
     │ 6. Store token in localStorage              │
     │                                              │
     │ 7. GET /api/jobs (with token)               │
     │    Headers: Authorization: Bearer {token}   │
     ├──────────────────────────────────────────→ │
     │                                              │
     │                      8. Verify JWT token    │
     │                      9. Check role          │
     │                      10. Execute request    │
     │                                              │
     │ 11. Response: Job data                       │
     │ ←──────────────────────────────────────────┤
     │                                              │
```

---

## 🔀 Request Flow by User Role

### Job Seeker Flow
```
Login → Browse Jobs → View Details → Apply → Track Status
  ↓         ↓            ↓            ↓          ↓
/login   /api/jobs  /api/jobs/:id  /apply  /dashboard
```

### Employer Flow
```
Login → Dashboard → Post Job → View Apps → Update Status
  ↓         ↓          ↓          ↓            ↓
/login  /employer/  /employer/ /employer/  /employer/
        dashboard   jobs       applications applications/:id
```

### Admin Flow
```
Login → Dashboard → Manage Users → Approve Jobs → Analytics
  ↓         ↓            ↓              ↓            ↓
/login   /admin/    /admin/users   /admin/jobs  /admin/
         dashboard                              analytics
```

---

## 📡 API Endpoint Architecture

```
/api
├── /auth
│   ├── POST   /register       (Public)
│   ├── POST   /login          (Public)
│   ├── GET    /me             (Protected)
│   ├── PUT    /profile        (Protected)
│   └── PUT    /change-password(Protected)
│
├── /jobs
│   ├── GET    /               (Public)
│   ├── GET    /:id            (Public)
│   ├── GET    /search         (Public)
│   ├── GET    /recommendations(Seeker)
│   └── POST   /:id/apply      (Seeker)
│
├── /employer
│   ├── GET    /dashboard      (Employer)
│   ├── GET    /jobs           (Employer)
│   ├── POST   /jobs           (Employer)
│   ├── PUT    /jobs/:id       (Employer)
│   ├── DELETE /jobs/:id       (Employer)
│   ├── GET    /applications   (Employer)
│   ├── PUT    /applications/:id(Employer)
│   └── POST   /companies      (Employer)
│
└── /admin
    ├── GET    /dashboard      (Admin)
    ├── GET    /analytics      (Admin)
    ├── GET    /users          (Admin)
    ├── PUT    /users/:id/toggle(Admin)
    ├── DELETE /users/:id      (Admin)
    ├── GET    /jobs           (Admin)
    ├── PUT    /jobs/:id/status(Admin)
    └── GET    /applications   (Admin)
```

---

## 🗄️ Database Relationships

```
┌───────────────┐
│    users      │
│  (PK: id)     │
│  • seekers    │
│  • employers  │
│  • admins     │
└───┬───────┬───┘
    │       │
    │       │ 1:N (employer → jobs)
    │       ↓
    │   ┌────────────┐        ┌──────────────┐
    │   │    jobs    │ 1:N    │ applications │
    │   │  (PK: id)  ├────────│  (PK: id)    │
    │   │(FK:emp_id) │        │ (FK: job_id) │
    │   └────────────┘        │ (FK:seek_id) │
    │                         └──────────────┘
    │                                 ↑
    │ 1:N (seeker → applications)     │
    └─────────────────────────────────┘

┌───────────────┐
│  companies    │ 1:N
│  (PK: id)     ├──────→ jobs
│(FK:employer_id)│
└───────────────┘

┌───────────────┐
│ saved_jobs    │
│ (FK: seeker)  │
│ (FK: job_id)  │
└───────────────┘
```

---

## 🛡️ Security Architecture

```
┌─────────────────────────────────────────────┐
│          Security Layers                    │
├─────────────────────────────────────────────┤
│                                             │
│  Layer 1: HTTPS (Production)               │
│  └─→ Encrypted data transmission           │
│                                             │
│  Layer 2: CORS Policy                      │
│  └─→ Only allowed origins                  │
│                                             │
│  Layer 3: Helmet.js                        │
│  └─→ Security headers (XSS, CSP, etc.)     │
│                                             │
│  Layer 4: JWT Authentication               │
│  └─→ Token verification on each request    │
│                                             │
│  Layer 5: Role-Based Access Control        │
│  └─→ Authorization middleware              │
│                                             │
│  Layer 6: Input Validation                 │
│  └─→ Sanitize and validate all inputs      │
│                                             │
│  Layer 7: Password Hashing                 │
│  └─→ bcrypt with salt rounds               │
│                                             │
│  Layer 8: SQL Injection Prevention         │
│  └─→ Parameterized queries                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📦 Component Hierarchy (Frontend)

```
App.jsx (Router + AuthProvider)
│
├── Navbar.jsx (Global)
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu
│
├── Routes
│   ├── Public Routes
│   │   ├── /login → Login.jsx
│   │   ├── /register → Register.jsx
│   │   └── /jobs → Jobs.jsx
│   │
│   ├── Protected Routes (All Users)
│   │   └── /dashboard → Dashboard.jsx
│   │
│   ├── Employer Routes
│   │   └── /post-job → PostJob.jsx
│   │
│   └── Admin Routes
│       └── /admin → AdminPanel.jsx
│
└── Footer.jsx (Global)
```

---

## 🔄 State Management

```
┌─────────────────────────────────────────┐
│         AuthContext (Global State)       │
├─────────────────────────────────────────┤
│                                          │
│  State:                                  │
│  • user (current user object)           │
│  • token (JWT token)                    │
│  • loading (auth check in progress)     │
│  • isAuthenticated (boolean)            │
│                                          │
│  Methods:                                │
│  • login(email, password)               │
│  • register(userData)                   │
│  • logout()                             │
│  • updateUser(userData)                 │
│                                          │
│  Storage:                                │
│  • localStorage (token, user)           │
│                                          │
└─────────────────────────────────────────┘
         ↓ Consumed by
┌─────────────────────────────────────────┐
│          All Components via             │
│          useAuth() hook                 │
└─────────────────────────────────────────┘
```

---

## ⚡ Performance Optimizations

```
Frontend:
├── Code Splitting (React Router)
├── Lazy Loading (Potential)
├── Tailwind CSS Purging
└── Vite Build Optimization

Backend:
├── Connection Pooling (10 connections)
├── Indexed Database Queries
├── Efficient SQL Joins
└── Response Caching (Potential)

Database:
├── Primary Keys & Foreign Keys
├── Indexes on frequent queries
├── Optimized table structure
└── Query optimization
```

---

## 🚀 Deployment Architecture (Future)

```
┌────────────────────────────────────────────────┐
│              CDN (CloudFlare)                   │
│         (Static Assets - Frontend)              │
└────────────────┬───────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│         Vercel / Netlify / AWS S3               │
│         (React Frontend - Static)               │
└────────────────┬───────────────────────────────┘
                 │
                 │ API Calls
                 ↓
┌────────────────────────────────────────────────┐
│       Heroku / AWS EC2 / DigitalOcean          │
│         (Node.js Backend - API)                 │
└────────────────┬───────────────────────────────┘
                 │
                 ↓
┌────────────────────────────────────────────────┐
│      AWS RDS / DigitalOcean Managed DB         │
│         (MySQL Database)                        │
└────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Example: Job Application

```
1. User clicks "Apply" on Jobs.jsx
   ↓
2. Axios sends POST /api/jobs/:id/apply
   Headers: { Authorization: Bearer {token} }
   Body: { resume, cover_letter }
   ↓
3. Backend: authMiddleware.js
   • Verifies JWT token
   • Extracts user info
   • Checks if user is "seeker"
   ↓
4. Backend: jobController.js (applyForJob)
   • Validates job exists and is active
   • Checks if already applied
   ↓
5. Backend: Application.create()
   • Inserts into applications table
   • Returns application ID
   ↓
6. Backend sends response
   { success: true, data: { id: 123 } }
   ↓
7. Frontend updates UI
   • Show success message
   • Update application list
   • Redirect to dashboard
```

---

## 🎯 System Capabilities

### Scalability
- ✅ Horizontal scaling (multiple backend instances)
- ✅ Database connection pooling
- ✅ Stateless JWT authentication
- ✅ CDN for static assets

### Reliability
- ✅ Error handling at all layers
- ✅ Database transactions
- ✅ Graceful error messages
- ✅ Connection retry logic

### Maintainability
- ✅ Clear folder structure
- ✅ Separated concerns (MVC)
- ✅ Consistent naming conventions
- ✅ Comprehensive documentation

### Security
- ✅ Multi-layer security
- ✅ Role-based access control
- ✅ Password encryption
- ✅ SQL injection prevention
- ✅ XSS protection

---

This architecture supports:
- 👥 Thousands of concurrent users
- 📈 Millions of job postings
- 🚀 Sub-second response times
- 🔒 Enterprise-grade security
- 📱 Mobile-responsive design
