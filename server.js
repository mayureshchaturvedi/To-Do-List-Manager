require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'mayuresh';

app.use(express.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    else console.log('✅ Connected to SQLite database.');
});

// Create Tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        due_date TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
});

// ✅ Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract actual token
    if (!token) return res.status(401).json({ error: 'Unauthorized - No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// ✅ Register User (Prevents Duplicate Username)
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (user) return res.status(400).json({ error: "Username already exists. Please choose another." });

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: err.message });

            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'User registered successfully' });
            });
        });
    });
});

// ✅ Login User
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });

        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// ✅ Get Tasks (Filters by Date if Provided)
app.get('/tasks', authenticate, (req, res) => {
    const userId = req.user.id;
    const { date } = req.query;

    let query = `SELECT * FROM tasks WHERE user_id = ?`;
    let params = [userId];

    if (date) {
        query += ` AND due_date = ?`;
        params.push(date);
    }

    db.all(query, params, (err, tasks) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(tasks);
    });
});

// ✅ Add Task
app.post('/tasks', authenticate, (req, res) => {
    const { title, due_date } = req.body;

    db.run(`INSERT INTO tasks (user_id, title, due_date) VALUES (?, ?, ?)`, [req.user.id, title, due_date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, due_date, completed: 0 });
    });
});

// ✅ Update Task (Mark as Completed)
app.put('/tasks/:id', authenticate, (req, res) => {
    const { completed } = req.body;

    db.run(`UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?`, [completed, req.params.id, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task updated successfully' });
    });
});

// ✅ Delete Task
app.delete('/tasks/:id', authenticate, (req, res) => {
    db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Task deleted successfully' });
    });
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));