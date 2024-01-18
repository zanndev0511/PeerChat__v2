const io = require('socket.io-client');
const socket = io('http://localhost:5502'); // Thay đổi URL của máy chủ của bạn

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Khởi tạo WebRTC Connection
const peerConnection = new RTCPeerConnection();

// Tạo Data Channel
const dataChannel = peerConnection.createDataChannel('whiteboard');

dataChannel.onmessage = (event) => {
  const data = JSON.parse(event.data);
  drawOnWhiteboard(data.x, data.y);
};

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  drawOnWhiteboard(x, y);
  sendData({ x, y });
}

function draw(e) {
  if (!isDrawing) return;
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  drawOnWhiteboard(x, y);
  sendData({ x, y });
}

function stopDrawing() {
  isDrawing = false;
}

function drawOnWhiteboard(x, y) {
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function sendData(data) {
  dataChannel.send(JSON.stringify(data));
}
