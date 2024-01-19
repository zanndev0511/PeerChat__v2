let express = require('express');

const path = require('path');
let app = express();
let httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

let connections = [];

let members = [];

let share_uid;
let share_result;

io.on('connect', (socket) => {
  connections.push(socket);
  console.log(`${socket.id} connected`);
  console.log(share_result);

  socket.on('draw', (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('ondraw', { x: data.x, y: data.y });
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

  socket.on('shareboard', (data) => {
    console.log('success', data.shareResult);
    connections.forEach((con) => {
      if (con.id != socket.id) {
        share_uid = data.userId;
        share_result = data.shareResult;

        con.emit('onshareboard', {
          userId: data.userId,
          shareResult: data.shareResult,
          shareBoard: data.shareBoard,
        });
      }
    });
  });
  socket.on('closeboard', (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('oncloseboard', {
          shareBoard: data.shareBoard,
        });
      }
    });
  });

  socket.on('keepdraw', (data) => {
    console.log('success', data);
    connections.forEach((con) => {
      if (con.id != socket.id) {
        con.emit('onkeepdraw', { points: data.points });
      }
    });
  });
  socket.on('member_review', (data) => {
    connections.forEach((con) => {
      if (con.id != socket.id) {
        members.push(data.nameReview);
        var uniqueArray = [...new Set(data.nameReview)];
        con.emit('onmember_review', { nameReview: uniqueArray });
      }
    });
  });
  socket.on('file', (data) => {
    connections.forEach((con) => {
      // if (con.id != socket.id) {
      con.emit('onfile', {
        fileName: data.fileName,
        fileType: data.fileType,
        displayName: data.displayName,
        fileContent: data.fileContent,
      });
      // }
    });
  });

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
