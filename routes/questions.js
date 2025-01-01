const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

// Add a question to a template
router.post('/', authorization, async (req, res) => {
    try {
        const { template_id, content, type } = req.body; // Adjusted column names
        const userId = req.user;

        // Check if the template belongs to the user
        const template = await pool.query(
            `SELECT * FROM templates WHERE id = $1 AND user_id = $2`,
            [template_id, userId]
        );

        if (template.rows.length === 0) {
            return res.status(403).json("Not Authorized or Template not found");
        }

        // Insert the question
        const result = await pool.query(
            `INSERT INTO questions (template_id, content, type) 
             VALUES ($1, $2, $3) RETURNING *`,
            [template_id, content, type]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a question
router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params; // Question ID
        const { content, type } = req.body; // Fields to update
        const userId = req.user;

        // Check if the question exists and belongs to a template owned by the user
        const question = await pool.query(
            `SELECT q.* FROM questions q 
             JOIN templates t ON q.template_id = t.id
             WHERE q.id = $1 AND t.user_id = $2`,
            [id, userId]
        );

        if (question.rows.length === 0) {
            return res.status(403).json("Not Authorized or Question not found");
        }

        // Update the question
        const updatedQuestion = await pool.query(
            `UPDATE questions 
             SET content = $1, type = $2 
             WHERE id = $3 RETURNING *`,
            [content, type, id]
        );

        res.json(updatedQuestion.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a question
router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params; // Question ID
        const userId = req.user;

        // Check if the question exists and belongs to a template owned by the user
        const question = await pool.query(
            `SELECT q.* FROM questions q 
             JOIN templates t ON q.template_id = t.id
             WHERE q.id = $1 AND t.user_id = $2`,
            [id, userId]
        );

        if (question.rows.length === 0) {
            return res.status(403).json("Not Authorized or Question not found");
        }

        // Delete the question
        await pool.query(`DELETE FROM questions WHERE id = $1`, [id]);

        res.json("Question deleted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;