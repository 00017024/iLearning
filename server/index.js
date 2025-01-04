const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'https://ilearning-mm6o.onrender.com', // Replace with your front-end URL
    credentials: true, // Include credentials if necessary
}));

// API Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/comments', require('./routes/comments'));

// Serve static files from React app
const reactBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(reactBuildPath));

// Catch-all route to serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Resolved path:', path.join(reactBuildPath, 'index.html'));
});
