const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const geoip = require('geoip-lite');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let visitorCount = 0;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    visitorCount++;

    const ip = socket.handshake.address;
    const geo = geoip.lookup(ip) || { country: 'Unknown' };

    io.emit('visitorInfo', { count: visitorCount, location: geo.country });

    socket.on('newComment', (comment) => {
        io.emit('displayComment', comment);
    });

    socket.on('disconnect', () => {
        visitorCount--;
        io.emit('visitorInfo', { count: visitorCount, location: geo.country });
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
