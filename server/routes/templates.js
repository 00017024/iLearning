const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');


router.get('/', authorization, async (req, res) => {
    try {
        const userId = req.user;

        const templates = await pool.query(
            `SELECT * FROM templates WHERE user_id = $1`,
            [userId]
        );

        res.json(templates.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post('/', authorization, async (req, res) => {
    try {
        const { title, description, topic } = req.body;
        const userId = req.user;

        const newTemplate = await pool.query(
            `INSERT INTO templates (title, description, topic, user_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description || null, topic, userId]
        );

        res.json(newTemplate.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, topic, is_favorite } = req.body;
        const userId = req.user;

        const template = await pool.query(
            `SELECT * FROM templates WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (template.rows.length === 0) {
            return res.status(403).json("Not Authorized or Template not found");
        }

        const updatedTemplate = await pool.query(
            `UPDATE templates 
             SET title = $1, description = $2, topic = $3, is_favorite = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 RETURNING *`,
            [title, description || null, topic, is_favorite || false, id]
        );

        res.json(updatedTemplate.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// Delete a template
router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user;

        console.log("User ID from token:", userId);
        console.log("Template ID provided:", id);

        
        const template = await pool.query(
            `SELECT * FROM templates WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        console.log("Template query result:", template.rows);

        if (template.rows.length === 0) {
            return res.status(403).json("Not Authorized or Template not found");
        }

        
        await pool.query(`DELETE FROM templates WHERE id = $1`, [id]);

        res.json("Template deleted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;