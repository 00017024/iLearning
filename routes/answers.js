const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

// Add an answer to a question
router.post('/', authorization, async (req, res) => {
    try {
        const { question_id, content } = req.body;

        // Check if the question exists
        const question = await pool.query(
            `SELECT * FROM questions WHERE id = $1`,
            [question_id]
        );

        if (question.rows.length === 0) {
            return res.status(404).json("Question not found");
        }

        // Insert the answer
        const result = await pool.query(
            `INSERT INTO answers (question_id, content) 
             VALUES ($1, $2) RETURNING *`,
            [question_id, content]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an answer
router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        // Update the answer
        const result = await pool.query(
            `UPDATE answers SET content = $1 WHERE id = $2 RETURNING *`,
            [content, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json("Answer not found");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an answer
router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the answer
        const result = await pool.query(
            `DELETE FROM answers WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json("Answer not found");
        }

        res.json({ message: "Answer deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all answers for a specific question
router.get('/question/:question_id', authorization, async (req, res) => {
    try {
        const { question_id } = req.params;

        // Retrieve all answers for the question
        const result = await pool.query(
            `SELECT * FROM answers WHERE question_id = $1`,
            [question_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a specific answer
router.get('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the answer
        const result = await pool.query(
            `SELECT * FROM answers WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json("Answer not found");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
