let localStream;
let remoteStream1;
let micro_active = true;
let cameraActive = true;
let cameraTrack;

let memberReview = [];

var io = io.connect('http://localhost:5502');

let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById('user').srcObject = localStream;
  document.getElementById('camera-btn').classList.add('active');
  document.getElementById('mic-btn').classList.add('active');

  cameraTrack = localStream.getVideoTracks()[0];
};

let toggleCam = async (e) => {
  let button = e.currentTarget;

  if (!cameraActive) {
    button.classList.add('active');
    cameraActive = true;
    sessionStorage.setItem('camera_active', cameraActive);
    cameraTrack.enabled = true;
  } else {
    button.classList.remove('active');
    cameraActive = false;
    sessionStorage.setItem('camera_active', cameraActive);
    cameraTrack.enabled = false;
  }
};
let toggleMicro = async (e) => {
  let button = e.currentTarget;

  if (!micro_active) {
    button.classList.add('active');
    micro_active = true;
    sessionStorage.setItem('micro_active', micro_active);
  } else {
    button.classList.remove('active');
    micro_active = false;
    sessionStorage.setItem('micro_active', micro_active);
  }
};
document.getElementById('camera-btn').addEventListener('click', toggleCam);
document.getElementById('mic-btn').addEventListener('click', toggleMicro);

let inviteCode = sessionStorage.getItem('inviteCode');

let join = () => {
  window.location.href = `../pages/room.html?room=${inviteCode}`;
};
document.getElementById('join-btn').addEventListener('click', join);

init();
