const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

// Add a comment
router.post('/:id/comment', authorization, async (req, res) => {
    try {
        const { id } = req.params; // template_id
        const { comment_text } = req.body;
        const userId = req.user;

        const result = await pool.query(
            `INSERT INTO comments (user_id, template_id, content) 
             VALUES ($1, $2, $3) RETURNING *`,
            [userId, id, comment_text] // Corrected the order of parameters
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a comment
router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM comments WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Comment not found');
        }

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;