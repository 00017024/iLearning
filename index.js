const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Auth and Dashboard Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));

// New Routes
app.use('/api/templates', require('./routes/templates'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/comments', require('./routes/comments'));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
