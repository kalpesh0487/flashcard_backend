const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL2 for better async/await support
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your needs
    queueLimit: 0
});

app.get('/flashcards', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${process.env.DATABASE_TABLE_NAME}`);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching flashcards:', err);
        res.status(500).send('Error fetching flashcards');
    }
});

app.post('/flashcards', async (req, res) => {
    const { question, answer } = req.body;
    try {
        await pool.query(`INSERT INTO ${process.env.DATABASE_TABLE_NAME} (question, answer) VALUES (?, ?)`, [question, answer]);
        res.send('Flashcard added');
    } catch (err) {
        console.error('Error adding flashcard:', err);
        res.status(500).send('Error adding flashcard');
    }
});

app.put('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
        await pool.query(`UPDATE ${process.env.DATABASE_TABLE_NAME} SET question = ?, answer = ? WHERE id = ?`, [question, answer, id]);
        res.send('Flashcard updated');
    } catch (err) {
        console.error('Error updating flashcard:', err);
        res.status(500).send('Error updating flashcard');
    }
});

app.delete('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`DELETE FROM ${process.env.DATABASE_TABLE_NAME} WHERE id = ?`, [id]);
        res.send('Flashcard deleted');
    } catch (err) {
        console.error('Error deleting flashcard:', err);
        res.status(500).send('Error deleting flashcard');
    }
});

const PORT = process.env.PORT || 3000; // Fixed port assignment
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
