const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.get('/flashcards', (req, res) => {
    db.query(`SELECT * FROM ${process.env.DATABASE_TABLE_NAME}`, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/flashcards', (req, res) => {
    const { question, answer } = req.body;
    db.query(`INSERT INTO ${process.env.DATABASE_TABLE_NAME} (question, answer) VALUES (?, ?)`, [question, answer], (err) => {
        if (err) throw err;
        res.send('Flashcard added');
    });
});

app.put('/flashcards/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    db.query(`UPDATE ${process.env.DATABASE_TABLE_NAME} SET question = ?, answer = ? WHERE id = ?`, [question, answer, id], (err) => {
        if (err) throw err;
        res.send('Flashcard updated');
    });
});

app.delete('/flashcards/:id', (req, res) => {
    const { id } = req.params;
    db.query(`DELETE FROM ${process.env.DATABASE_TABLE_NAME} WHERE id = ?`, [id], (err) => {
        if (err) throw err;
        res.send('Flashcard deleted');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3001');
});