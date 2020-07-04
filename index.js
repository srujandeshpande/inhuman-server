const express = require('express');
const app = express();

const http = require('http').Server(app)
const io = require('socket.io')(http);

//imports
const { join } = require('path');

//templating using mustache
const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', join(__dirname, '/views'))

//static
app.use(express.static(join(__dirname, '/static')))

//port
const PORT = process.env.PORT || 5000;

//api calls
app.get('/', (req, res) => {
    res.send('Server running successfully. welcome to server');
})

//start server
http.listen(PORT, () => {
    console.log(`SERVER LISTENING ON port ${PORT}`);
})