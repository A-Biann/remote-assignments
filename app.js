require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());

// set connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('connection error', err);
    } else {
        console.log('connection success');
    }
  });

app.get('/', (req, res) => {
    res.send('This is root page');
});


app.get('/healthcheck', (req, res) => {
    res.send('This is health check page');
});

app.post('/users', (req, res) => {
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
                return res.status(400).json({ error: 'Error Message: Server error when inserting' });
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
      res.status(400).json({ error: 'Error Message: Server error' });
    }
});

app.get('/users', (req, res) => {
    const userId = req.query.id;

    const selectQuery = `SELECT * FROM user WHERE id = ?`;
    connection.query(selectQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error:', err.message);
            return res.status(400).json({ error: 'Error Message: Server error' });
        }

        if (results.length === 0) {
            return res.status(403).json({ error: 'Error Message: User does not exist' });
        }

        const user = results[0];
        const userObject = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const response = {
            data: {
                user: userObject, 
                'request-date': new Date().toUTCString() 
                }
        };

        res.status(200).json(response);
    });
});

  
app.listen(port, () => {
  console.log(`It is running on  ${port}`);
});

function validateUserData(name, email, password) {
    const nameRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=(?:[^A-Z]*[A-Z])?)(?=(?:[^a-z]*[a-z])?)(?=(?:\D*\d){1,})(?=[\s\S]*[~`!@#$%^&*()_+\-={[}\]|:;"'<,>.?/])[\s\S]*$/;
  
    if (!name.match(nameRegex)) {
        return false;
    }
  
    if (!email.match(emailRegex)) {
        return false;
    }
  
    if (!password.match(passwordRegex)) {
        return false;
    }
  
    return true;
}
  