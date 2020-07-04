//imports
import express from 'express';
import mustache from 'mustache-express';
import { join } from 'path';
import socketConfig from './sockets';
import http from 'http';

//server config
const app = express();
const server = http.Server(app)

//templating using mustache
app.engine('html', mustache());
app.set('view engine', 'mustache');
app.set('views', join(__dirname, '/views'))

//static
app.use(express.static(join(__dirname, '/static')))

//port
const PORT = process.env.PORT || 5000;

//api calls
app.get('/', (req, res) => {
    res.render('index.html');
})

//start server
server.listen(PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${PORT}`);
})

//running sockets
socketConfig.init(server);