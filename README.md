# To-Do List Manager

## Overview
The To-Do List Manager is a full-stack web application designed to help users efficiently manage their daily tasks. Users can register, log in, add tasks, mark them as completed, filter tasks by date, and delete tasks. The application ensures persistent storage through a backend powered by Node.js and an SQLite database.

## Features
- User authentication (registration and login)
- Task management (add, view, mark as complete, delete)
- Persistent data storage using SQLite
- Task filtering by due date
- Responsive UI with Bootstrap
- Secure API communication using JWT authentication
- Backend integration with Express.js for handling API requests

## Technologies Used
### Frontend
- HTML, CSS, JavaScript
- Bootstrap for responsive design

### Backend
- Node.js (Express.js)
- SQLite (Database)
- bcrypt (Password hashing)
- jsonwebtoken (JWT authentication)

## Installation Guide
### Prerequisites
Ensure you have the following installed on your system:
- Node.js (Download from https://nodejs.org/)
- SQLite (Download from https://sqlite.org/download.html)

### Steps to Set Up
#### 1. Clone the Repository
```sh
git clone https://github.com/mayureshchaturvedi/To-Do-List-Manager.git
cd To-Do-List-Manager
```

#### 2. Install Dependencies
```sh
npm install
```

#### 3. Set Up Environment Variables
Create a `.env` file in the project root and add the following:
```
PORT=5000
SECRET_KEY="mayuresh"
```
#### 5. Start the Backend Server
```sh
node server.js
```
The server will start at `http://localhost:5000`.

#### 6. Open the Frontend
Simply open `index.html` in a browser to access the application.

## API Endpoints
### Authentication
- **POST** `/register` - Register a new user
- **POST** `/login` - Authenticate user and receive JWT token

### Task Management (Requires Authentication)
- **GET** `/tasks` - Retrieve tasks
- **POST** `/tasks` - Add a new task
- **PUT** `/tasks/:id` - Mark a task as completed
- **DELETE** `/tasks/:id` - Delete a task
