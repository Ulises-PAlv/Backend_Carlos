const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const connection = require("./conexion");
const misrutas = require('./routes/rutas');
const cors = require("cors");
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    options: {
        cors: '*'
    }
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', misrutas);

connection.connect((err, res) => {
    if (err) {
    console.log(err)
    console.log('Error de conexion con sql')
    return;
    }
    console.log('Conexion exitosa a la base de datos')
});

app.listen(3000, (err, res) => {
 if (err) {
 console.log('Error al levantar servidor')
 return;
 }
 console.log('Apis escuchando en el puerto 3000')
})

const port = 3002;

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        const roomName = data.roomName;
        socket.join(roomName);
        socket.to(roomName).broadcast.emit('new-user', data)

        socket.on('disconnect', () => {
            socket.to(roomName).broadcast.emit('bye-user', data)
        })
    })
})

server.listen(port, () => {
    console.log(`Server running port ${port}`)
});