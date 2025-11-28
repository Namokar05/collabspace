# CollabSpace - Project & Team Management Platform

> **Advanced full-stack application for project collaboration, task management, and team coordination**
Login Window
![WhatsApp Image 2025-11-28 at 22 38 02_3b8f9d52](https://github.com/user-attachments/assets/892e2578-dd7d-4b0a-bd83-132c5021c283)

Collab Space Dahboard
<img width="1575" height="902" alt="image" src="https://github.com/user-attachments/assets/203b8466-07d3-4315-9a2d-d1a5b787437d" />

Project Section
<img width="1569" height="756" alt="image" src="https://github.com/user-attachments/assets/d137deab-9db2-4b0a-959b-bfcd2d36a519" />

Task Section
<img width="1472" height="859" alt="image" src="https://github.com/user-attachments/assets/3e6fd595-870d-4d19-b34e-2d62ff2d4103" />

Teams Section
<img width="1465" height="633" alt="image" src="https://github.com/user-attachments/assets/0036d6ad-fd5d-4996-aa42-35361416e617" />

Creating New Project
<img width="1504" height="874" alt="image" src="https://github.com/user-attachments/assets/5384cd1a-aba2-4182-a0a4-c6ddb9b5d917" />

Creating New Tasks for any project
<img width="1541" height="885" alt="image" src="https://github.com/user-attachments/assets/47127ed5-3e10-4d26-9aec-fd3c835aec2c" />

Making new team 
<img width="1611" height="868" alt="image" src="https://github.com/user-attachments/assets/427caa07-f2e0-4e77-8995-f5587d5d5299" />
---

## 🎯 ProU Technology Assessment - All 3 Tracks

### ✅ Track 1: Frontend Development
- Modern React 18 with Hooks
- Vite build tool for fast development
- Tailwind CSS for responsive design
- Interactive UI with Lucide icons
- Recharts for data visualization
- Mobile-first responsive design

### ✅ Track 2: Backend Development
- Node.js + Express RESTful API
- MongoDB Atlas cloud database
- Mongoose ODM with schema validation
- JWT authentication & authorization
- Full CRUD operations
- Comprehensive error handling

### ✅ Track 3: Full-stack Integration
- Complete frontend-backend integration
- Secure authentication flow
- Real-time data synchronization
- API-driven architecture
- Production-ready deployment configuration

---

## ✨ Unique Features (What Makes This Stand Out)
*(content preserved in your version)*

---

## ✨ Unique Features

### 🎮 Gamification System
- Points & Levels
- Badges & Achievements
- Leaderboards
- Motivation-driven productivity

### 📊 Analytics Dashboard
- Real-time statistics
- Visual charts
- Progress tracking
- Activity feed

### 👥 Team Collaboration
- Team management
- Role-based access
- Member assignment
- Team productivity stats

### 📝 Advanced Task Management
- 6-step status workflow
- Priority system
- Story points
- Checklists
- Dependencies
- Time tracking

### 💬 Communication
- Comments
- Mentions
- Attachments
- Notifications

---

## 📦 Installation

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git installed
- Modern web browser

---

## 🚀 Complete Step-by-Step Setup (FULL GUIDE — No External Links)

# 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/collabspace.git
cd collabspace
```

# 2. Setup MongoDB Atlas
1. Create cluster  
2. Get connection string  
3. Allow 0.0.0.0/0  
4. Replace <password>  

# 3. Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=your_string
JWT_SECRET=your_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

Run backend:
```bash
npm run dev
```

# 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```


