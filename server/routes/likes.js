const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

// Like a template
router.post('/:id/like', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        await pool.query(
            `INSERT INTO likes (template_id, user_id) VALUES ($1, $2)`,
            [id, userId]
        );

        res.json({ message: 'Template liked' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Unlike a template
router.delete('/:id/like', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        await pool.query(
            `DELETE FROM likes WHERE template_id = $1 AND user_id = $2`,
            [id, userId]
        );

        res.json({ message: 'Template unliked' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
