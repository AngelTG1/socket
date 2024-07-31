import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://3.81.57.182"
    }
});

let locations = {};

app.get('/welcome', (req, res) => {
    res.json({ message: 'Bienvenido al servidor de ubicación en tiempo real' });
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('sendLocation', (data) => {
        console.log('Ubicación recibida: ', data, socket.id);

        locations[socket.id] = data;
        io.emit('updateLocations', locations);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
        delete locations[socket.id];
        io.emit('updateLocations', locations); // Emit update after deletion
    });
});

server.listen(4000, () => {
    console.log('Servidor corriendo en el puerto 4000');
});
