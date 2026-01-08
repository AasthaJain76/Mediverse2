# 🌐 MediVerse – Full-Stack Community Platform

MediVerse is a **full-stack MERN platform** that enables real-time discussions, content sharing, and AI-driven career tools. It leverages **React.js**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO** for a responsive, interactive, and scalable user experience.

---

## 🚀 Features

- 💬 **Real-Time Discussions** – Users can post, comment, and interact in threads using **Socket.IO**  
- 📄 **Posts & Content Management** – CRUD operations for posts with user authentication  
- 📊 **Live Contest Integration** – Auto-fetch coding contests from **Clist.by API** with filtering and sorting  
- 🤖 **AI Resume Analyzer & Career Roadmap** – Provides actionable insights and career guidance  
- ⚡ **Performance & Scalability** – Optimized backend and frontend code for maintainability and speed  

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS / CSS  
- Socket.IO client  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- REST APIs & JWT Authentication  
- Socket.IO server  

### AI & External APIs
- OpenAI API (Resume analysis)  
- Clist.by API (Contest data)  

### Deployment
- Frontend: **Vercel**  
- Backend: **Render**  

---

## 📂 Project Structure

MediVerse/
  client/        # React frontend
    components/   # Reusable UI components
    pages/        # React pages
    services/     # API calls
  server/        # Node.js backend
    controllers/  # Request handlers
    routes/       # API endpoints
    models/       # Mongoose models
    middleware/   # Auth, error handling
  README.md       # Documentation

