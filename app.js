require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const connection = require('./db');

//set up CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// Use the user routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('This is root page');
});

app.get('/healthcheck', (req, res) => {
    res.send('This is health check page');
});

app.listen(port, () => {
    console.log(`It is running on ${port}`);
});


