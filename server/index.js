const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// API Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/answers', require('./routes/answers'));


// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
