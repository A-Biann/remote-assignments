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

// Use the user routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/healthcheck', (req, res) => {
    res.send('This is health check page');
});

app.post('/try/users', (req, res) => {
    try {
        const { name, email, password } = req.body;
  
      // validate the data
        if (!validateUserData(name, email, password)) {
            console.log('Error Message: Invalid data')
            return res.status(400).json({ error: 'Error Message: Invalid data' });
        }
  
        const insertQuery = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
        connection.query(insertQuery, [name, email, password], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                console.log('Error Message: Email already exists');
                return res.status(409).json({ error: 'Error Message: Email already exists' });
                }
                console.log(err);
                return res.status(500).json({ error: 'Error Message: Server error when inserting' });
            }
  
            const userId = results.insertId;
            const userObject = {
                id: userId,
                name,
                email
            };
  
            const response = {
                data: {
                    user: userObject, 
                    'request-date': new Date().toUTCString() 
                }   
            };
    
            res.status(200).json(response);
        });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error Message: Server error' });
    }
});

app.listen(port, () => {
    console.log(`It is running on ${port}`);
});


