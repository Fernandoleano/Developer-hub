const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.get('/', (req, res) => res.send("API is running"));

// define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

// conncting the database
connectDB();

// init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000; // This will default to 5000

app.listen(PORT, () => console.log(`Server has staterd on port: ${PORT}`));