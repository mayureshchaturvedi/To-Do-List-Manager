# To-Do List Manager

## 📌 Project Overview
The **To-Do List Manager** is a full-stack web application designed to help users efficiently manage their daily tasks. This project includes a **frontend**, a **Node.js backend**, and an **SQLite database** for persistent storage.

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express.js
- **Database:** SQLite

## 🚀 Features
- **User Authentication** (Register/Login)
- **CRUD Operations for Tasks** (Create, Read, Update, Delete)
- **Task Filtering** (By Date and Completion Status)
- **Responsive UI** (Works on all devices)

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/mayureshchaturvedi/To-Do-List-Manager.git
cd To-Do-List-Manager
```

### 2️⃣ Install Dependencies
#### Backend Setup
```sh
cd backend
npm install
```
#### Frontend Setup
No additional setup required. You can directly open `index.html` in a browser.

### 3️⃣ Initialize the Database
```sh
node setupDatabase.js
```
(This will create the SQLite database and necessary tables.)

### 4️⃣ Start the Backend Server
```sh
node server.js
```
(Default port: `http://localhost:5000`)

### 5️⃣ Run the Frontend
Open `index.html` in a browser or use a local server:
```sh
npx serve .
```

---

## 🔥 API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user |
| GET | `/tasks` | Fetch all tasks for logged-in user |
| POST | `/tasks` | Add a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## 🤝 Contributing
Contributions are welcome! Please follow the standard GitHub workflow:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit changes and push to GitHub
4. Open a Pull Request

---
