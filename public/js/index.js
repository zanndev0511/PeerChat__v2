let express = require('express');
const path = require('path');
let app = express();
let httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

let connections = [];
let drawings = [];

io.on('connect', (socket) => {
  connections.push(socket);
  console.log(`${socket.id} connected`);

  socket.on('draw', (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('ondraw', { x: data.x, y: data.y });
      }
    });
  });
  socket.on('savedraw', (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('onsavedraw', { drawings: data.drawings });
      }
    });
  });

  socket.on('down', (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit('ondown', { x: data.x, y: data.y });
      }
    });
  });

  socket.on('share', (data) => {
    console.log('success', data);
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('onshare', { shareBoard: data.shareBoard });
      }
    });
  });

  socket.emit('drawings', drawings);

  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} disconnected`);
    connections = connections.filter((con) => con.id != socket.id);
  });
});

app.use(
  express.static(path.join('D:/baitap/LapTrinhMang/PeerChat_v2', 'public'))
);

app.use((req, res) => {
  res.status(404);
  res.send(`<h1>Error 404: Not found</h1>`);
});

let PORT = process.env.PORT || 5502;
httpServer.listen(PORT, () => console.log(`Server listening on ${PORT}`));
