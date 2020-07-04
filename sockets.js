import socketio from 'socket.io';

var socketConfig = {};

//game variables
var games = [];

socketConfig.init = (server) => {
    const io = socketio(server);

    //socket config.
    io.on('connection', (socket) => {
        console.log(`SOCKET CONNECT ID:${socket.id}`);

        socket.on('room', (game_id) => {
            handleRoom(game_id, socket);
        });

        socket.on('start-game', (game_id) => {
            handleStartGame(game_id, socket);
        })

        socket.on('disconnect', (socket) => {
            handleDisconnect(socket);
        });
    })
}

//handle socket events 
function handleRoom(game_id, socket) {
    console.log(`Socket with id ${socket.id} asked to join game ${game_id}`);
}

function handleDisconnect(socket) {
    console.log(`Socket with id ${socket.id} disconnected`)
}

function handleStartGame(game_id, socket) {
    console.log(`Game ${game_id} started by ${socket.id}`)
}
export default socketConfig;