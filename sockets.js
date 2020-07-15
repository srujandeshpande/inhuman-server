class socketConfig{
    constructor(io){

        this.clients = {}
        this.players = {}
        this.games = {}
        //socket config
        this.io = io;
    }
    init(){
        this.io.on('connection', (socket) => {
            console.log(`SOCKET CONNECT ID:${socket.id}`);
            this.clients[socket.id] = socket;


            socket.on('lobby', (data) => {
                console.log(`socket ${socket.id} joined and game_id is:`,data.game_id, data.name)
                socket.join(data.game_id);
                this.handleRoom(data.game_id, socket);
            });


            socket.on('room', (data) => {
                console.log('game_id is:',data.game_id)
                socket.join(data.game_id);
                this.handleRoom(data.game_id, socket);
            });

            socket.on('ready', (data) => {
                this.handleReady(data.game_id, socket);
            })

            socket.on('assign-turn', () => {
                this.handleAssignTurn(socket);
            })

            socket.on('play-black-card',(data) => {
                socket.broadcast.to(data.game_id).emit('black-card',data)
            })

            socket.on('play-white-card',(data) => {
                var master = this.getMaster(data.game_id);
                console.log("MASTER IS",master)
                master = this.clients[master]

                this.io.to(master.id).emit("white-card",data)
            })

            socket.on('winner',(game_id,data)=>{
                this.io.to(master.id).emit("winner",data)
            })

            socket.on('next-turn',(game_id,socket)=>{
                this.handleAssignTurn(socket,game_id)
            })
            socket.on('disconnect', (socket) => {
                this.handleDisconnect(socket);
            });
        })
    }
    getMaster(game_id){
        var pl_list = this.players[game_id];
        //console.log("PLAYER LIST:",pl_list)
        var x = null;
        //console.log("CLIENTS ",this.clients)
        pl_list.forEach(player => {
            console.log(player.turn)
            if(player.turn){
                console.log(this.clients[player.socket].id)
                x = player.socket
            }
        });
        if(x)
            return x;
        return null;
    }

    handleAssignTurn(socket,game_id){
        var player = this.getPlayer(socket,game_id);
        console.log("here",player)
        if(player){

            if(this.players[game_id][player].turn == false)
                this.players[game_id][player].turn = true;
            else{
                this.players[game_id][player].turn = false;
                player = this.getNextPlayer(socket,game_id);
                this.players[game_id][player].turn = true;
            }
        }
        console.log('assigning turn to ',this.players[game_id][player])
        //console.log("HERE NEAR EMITING PLAYER STATUS")
        this.io.sockets.in(game_id).emit('player-status',{players:this.players[game_id]})
    }

    getPlayer(socket,game_id){
        var i = 0;
        var ans = null;
        //console.log("PLAYERS LIST IOS",this.players)
        for(i;i<this.players[game_id].length;i++){
            if (this.players[game_id][i].socket == socket.id)
            {

                ans =  i
            }
        }

        return ans;
    }

    getNextPlayer(socket,game_id){
        var i = 0;
        var ans = null;
        //console.log("PLAYERS LIST IOS",this.players)
        for(i;i<this.players[game_id].length;i++){
            if (this.players[game_id][i].socket == socket.id)
            {
                if(i == this.players[game_id].length-1){
                    ans = 0;
                }
                ans = i+1;
            }
        }
        return ans
    }

    handleRoom(game_id, socket) {
        //console.log(`Socket with id ${socket.id} asked to join game ${game_id}`);
        var player = {
            socket : socket.id,
            host: false,
            turn: false,
            //name: name,
        }
        this.games[game_id] = {
            in_progress : false,
        }
        if(this.players[game_id]){
           this.players[game_id].push(player);

        }
        else{
            player.host = true;
            var players = []
            players.push(player)
            this.players[game_id] = players ;

        }
        //console.log("PLAYER JOINED ROM:",this.players[game_id])
        var data = {
            player:player,
            players: this.players[game_id]
        }
        //inform other clients that you joined
        socket.broadcast.to(game_id).emit('joined-room',data);
    }

    handleDisconnect(socket) {
        console.log(`Socket with id ${socket.id} disconnected`)
    }

    handleReady(game_id, socket) {
        console.log(`Game ${game_id} started by ${socket.id}`);

        this.games[game_id].in_progress = true;
        //console.log("GAMES:",this.games)
        this.io.sockets.in(game_id).emit('start-game');
        this.handleAssignTurn(socket,game_id);
    }
}


export default socketConfig;
