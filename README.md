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
<details>
  <summary>📁 MediVerse/</summary>
  
</details>

<details>
  <summary>📌 Folder Details</summary>

- **client/components** → ⚛️ Reusable UI elements like buttons, cards, modals, navigation bars.  
- **client/pages** → 📄 Individual pages for the app (Home, Profile, Contests, Forum).  
- **client/services** → 🔗 Frontend service files for communicating with backend REST APIs.  
- **server/controllers** → 🎛️ Handles request logic, e.g., creating posts, fetching threads.  
- **server/routes** → 🌐 Defines REST API endpoints and links to controllers.  
- **server/models** → 🗄️ MongoDB schemas using Mongoose (User, Post, Thread, Profile).  
- **server/middleware** → 🛡️ Functions for authentication, authorization, error handling, etc.  
- **README.md** → 📝 Documentation, setup instructions, and project info.  

</details>


