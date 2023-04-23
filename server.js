const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const WebSocketServer = require('websocket').server;

function CreateRoomManager() {
    this.rooms = [];

    this.addPlayer = player => {
        let room;

        room = this.rooms.find(r => r.accepting);

        if (room) {
            if (room.players.a) {
                room.players.b = player;
            }
            else {
                room.players.a = player;
            }

            player.room = room;

            if (Object.values(room.players).every(p => p)) {
                room.accepting = false;

                this.onRoomReady(room)
            }
        } else {
            room = {
                players: {
                    a: player,
                    b: null,
                },
                accepting: true,
            };

            player.room = room;

            this.rooms.push(room);
        }
    };

    this.onRoomReady = room => {
        console.log('Room ready', room);

        Object.entries(room.players).forEach(([key, player]) => {
            console.log({ key })
            player.connection.sendUTF(JSON.stringify({
                action: 'start',
                userId: player.userId,
                position: key,
            }));
        })
    };

    this.onPlayerDisconnect = player => {
        Object.entries(player.room.players).forEach(([k, v]) => {
            if (v === player.userId) {
                player.room.players[k] = null;
            }
        })
    };

    return this;
}

const roomManager = new CreateRoomManager();

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

app.set('port', 3000);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './dist')));

function originIsAllowed(origin) {
    if(origin === 'http://localhost:10001'){
        return true;
    }
    return false;
}



wsServer.on('request', request => {
    if (!originIsAllowed(request.origin)) {
        // Allowed only
        request.reject();
        console.log((new Date()) + ' Conexión del origen ' +request.origin+ ' rechazada.');
        return;
    }

    const userId = request.resourceURL.query.userId;

    const connection = request.accept(null, request.origin);

    const player = {
        connection,
        userId,
        room: null,
    };

    roomManager.addPlayer(player);

    connection.on('message', (message) => {
        // console.log('Message received: ' + message.utf8Data);

        Object.values(player.room.players).forEach(player => {
            if (!player)
                return;

            player.connection.sendUTF(message.utf8Data);
        });
    });

    connection.on('close', (reasonCode, description) => {
        console.log('Player disconnected', reasonCode, description);
        roomManager.onPlayerDisconnect(player);

    });
});

server.listen(app.get('port'), () => {
    console.log('Listening port: ' + app.get('port'));
})




