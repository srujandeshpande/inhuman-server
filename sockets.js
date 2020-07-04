import socketio from 'socket.io';

var socketConfig = {};

socketConfig.init = (server) => {
    const io = socketio(server);
    io.on('connection', (socket) => {
        console.log(`SOCKET CONNECT ID:${socket.id}`);
    })
}

export default socketConfig;