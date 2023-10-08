const express = require('express');
const app = express();
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.send('This is root page');
});


app.get('/healthcheck', (req, res) => {
    res.send('This is health check page');
});

app.listen(3000, () => {
    console.log('It is running on 3000!')
});