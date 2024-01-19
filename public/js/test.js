const APP_ID = '432f4e618da5403b8d85767b62915837';

let camera_active = sessionStorage.getItem('camera_active');
let mic_active = sessionStorage.getItem('micro_active');

let uid = sessionStorage.getItem('uid');
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem('uid', uid);
}

var io = io.connect('http://localhost:5502');

let token = null;
let client;

let rtmClient;
let channel;

let memberID;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get('room');

if (!roomId) {
  roomId = 'main';
}

let displayName = sessionStorage.getItem('display_name');
if (!displayName) {
  window.location = 'lobby.html';
}

let localTracks = [];
let remoteUsers = {};

let localScreenTracks;
let sharingScreen = false;

let sharingBoard = false;

let checkCamera = true;
let checkMic = true;
let checkBoard = false;

let database = firebase.database();

let joinRoomInit = async () => {
  rtmClient = await AgoraRTM.createInstance(APP_ID);
  await rtmClient.login({ uid, token });

  await rtmClient.addOrUpdateLocalUserAttributes({ name: displayName });

  channel = await rtmClient.createChannel(roomId);
  await channel.join();

  channel.on('MemberJoined', handleMemberJoined);
  channel.on('MemberLeft', handleMemberLeft);
  channel.on('ChannelMessage', handleChannelMessage);

  getMembers();
  addBotMessageToDom(`Welcome to the room ${displayName}! 👋`);

  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  await client.join(APP_ID, roomId, token, uid);

  client.on('user-published', handleUserPublished);
  client.on('user-left', handleUserLeft);

  joinStream();
};

let joinStream = async () => {
  // document.getElementById('join-btn').style.display = 'none';

  document.getElementsByClassName('stream__actions')[0].style.display = 'flex';

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
    {},
    {
      encoderConfig: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
    }
  );

  let player = `<div class="video__infor" id="video-${uid}">
                  <div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>  
                  </div>
                  <p id="displayName">${displayName}</p>
                </div> `;

  document
    .getElementById('streams__container')
    .insertAdjacentHTML('beforeend', player);
  document.getElementById(`video-${uid}`).addEventListener('click', (e) => {
    expandVideoFrame(e);
    memberID = uid;
  });

  if (camera_active == 'false') {
    await localTracks[1].setEnabled(false);
    document.getElementById('camera-btn').classList.remove('active');
    checkCamera = false;
    // await client.publish([localTracks[0]]);
  }
  if (mic_active == 'false') {
    await localTracks[0].setMuted(true);
    document.getElementById('mic-btn').classList.remove('active');
    checkMic = false;
  }

  // if (mic_active == 'false' && camera_active == 'false') {
  //   let player1 = `<div class="video__container" id="nonCam-container">
  //                   <div class="video-player" id="nonCam"></div>
  //                </div>`;

  //   document
  //     .getElementById('streams__container')
  //     .insertAdjacentHTML('beforeend', player1);
  //   localTracks[1].play(`nonCam`);

  // }
  // if (mic_active == 'true') {
  //   await localTracks[0].setMuted(false);
  //   document.getElementById('mic-btn').classList.add('active');
  // } else {
  //   await localTracks[0].setMuted(true);
  //   document.getElementById('mic-btn').classList.remove('active');
  // }

  // if (camera_active == 'true') {
  //   await localTracks[1].setMuted(false);
  //   document.getElementById('camera-btn').classList.add('active');
  //   checkCamera = true;
  // } else {
  // await localTracks[1].setMuted(true);
  // document.getElementById('camera-btn').classList.remove('active');
  // checkCamera = false;
  // }

  localTracks[1].play(`user-${uid}`);
  await client.publish([localTracks[0], localTracks[1]]);
};

let switchToCamera = async () => {
  let cameraButton = document.getElementById('camera-btn');
  let micButton = document.getElementById('mic-btn');
  let player = `
                  <div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>  
                   </div>
                   <p id="displayName">${displayName}</p>
                 `;
  document
    .getElementById(`video-${uid}`)
    .insertAdjacentHTML('beforeend', player);

  if (checkCamera) {
    await localTracks[1].setEnabled(true);
    cameraButton.classList.add('active');
  } else {
    await localTracks[1].setEnabled(false);
    cameraButton.classList.remove('active');
  }
  if (checkMic) {
    await localTracks[0].setMuted(false);
    micButton.classList.add('active');
  } else {
    await localTracks[0].setMuted(true);
    micButton.classList.remove('active');
  }
  // if (!localTracks[1].enabled) {
  //   await localTracks[1].setEnabled(true);
  //   await client.publish([localTracks[0], localTracks[1]]);
  //   button.classList.add('active');
  //   checkCamera = true;
  // } else {
  //   await localTracks[1].setEnabled(false);
  //   await client.publish([localTracks[0]]);
  //   button.classList.remove('active');
  //   checkCamera = false;
  // }
  // await localTracks[0].setMuted(true);

  // document.getElementById('mic-btn').classList.remove('active');
  document.getElementById('screen-btn').classList.remove('active');

  localTracks[1].play(`user-${uid}`);
  await client.publish([localTracks[1]]);
};

let handleUserPublished = async (user, mediaType) => {
  remoteUsers[user.uid] = user;

  await client.subscribe(user, mediaType);

  let { name } = await rtmClient.getUserAttributesByKeys(user.uid, ['name']);

  let player = document.getElementById(`user-container-${user.uid}`);
  if (player === null) {
    let player = `<div class="video__infor" id="video-${user.uid}">
                  <div class="video__container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-${user.uid}"></div>  
                  </div>
                  <p>${name}</p>
                </div> `;

    document
      .getElementById('streams__container')
      .insertAdjacentHTML('beforeend', player);
    document
      .getElementById(`video-${user.uid}`)
      .addEventListener('click', (e) => {
        expandVideoFrame(e);
        memberID = user.uid;
      });
  }

  // if (displayFrame.style.display) {
  //   let videoFrame = document.getElementById(`user-container-${user.uid}`);
  //   videoFrame.style.height = '100px';
  //   videoFrame.style.width = '100px';
  // }

  if (mediaType === 'video') {
    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
};

let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  let item = document.getElementById(`video-${user.uid}`);
  if (item) {
    item.remove();
  }

  if (userIdInDisplayFrame === `video-${user.uid}`) {
    displayFrame.style.display = null;

    let videoFrames = document.getElementsByClassName('video__container');

    for (let i = 0; videoFrames.length > i; i++) {
      videoFrames[i].style.height = '300px';
      videoFrames[i].style.width = '300px';
    }
  }
};

let toggleMic = async (e) => {
  let button = e.currentTarget;

  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    button.classList.add('active');
    checkMic = true;
  } else {
    await localTracks[0].setMuted(true);
    button.classList.remove('active');
    checkMic = false;
  }
};

let toggleCamera = async (e) => {
  let button = e.currentTarget;

  if (!localTracks[1].enabled) {
    await localTracks[1].setEnabled(true);
    await client.publish([localTracks[0], localTracks[1]]);
    button.classList.add('active');
    checkCamera = true;
  } else {
    await localTracks[1].setEnabled(false);
    await client.publish([localTracks[0]]);
    button.classList.remove('active');
    checkCamera = false;
  }

  document
    .getElementById(`video-${uid}`)
    .addEventListener('click', expandVideoFrame);
};

let toggleScreen = async (e) => {
  let screenButton = e.currentTarget;
  let cameraButton = document.getElementById('camera-btn');

  if (!sharingScreen) {
    addBotMessageToDom(`${displayName} is sharing the screen! 👀`);
    localScreenTracks = await AgoraRTC.createScreenVideoTrack();
    if (localScreenTracks.enabled) {
      sharingScreen = true;

      screenButton.classList.add('active');
      cameraButton.classList.remove('active');
      cameraButton.style.display = 'none';
    }
    localScreenTracks.on('track-ended', async () => {
      sharingScreen = false;
      cameraButton.style.display = 'block';

      document.getElementById(`video-${uid}`).remove();

      let videoFrames = document.getElementsByClassName('video__container');
      for (let i = 0; videoFrames.length > i; i++) {
        if (videoFrames[i].id != userIdInDisplayFrame) {
          videoFrames[i].style.height = '300px';
          videoFrames[i].style.width = '300px';
        }
      }

      await client.unpublish([localScreenTracks]);

      switchToCamera();
    });
    document.getElementById(`user-container-${uid}`).remove();
    document.getElementById(`displayName`).remove();
    displayFrame.style.display = 'block';

    let player = `<div class="video__infor" id="video-${uid}">
                  <div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>  
                  </div>
                  <p>${displayName}</p>
                </div> `;

    displayFrame.insertAdjacentHTML('beforeend', player);
    document
      .getElementById(`video-${uid}`)
      .addEventListener('click', expandVideoFrame);

    userIdInDisplayFrame = `video-${uid}`;
    localScreenTracks.play(`user-${uid}`);

    await client.unpublish([localTracks[1]]);
    await client.publish([localScreenTracks]);

    let videoFrames = document.getElementsByClassName('video__container');
    for (let i = 0; videoFrames.length > i; i++) {
      if (videoFrames[i].id != userIdInDisplayFrame) {
        videoFrames[i].style.height = '100px';
        videoFrames[i].style.width = '100px';
      }
    }
  } else {
    sharingScreen = false;
    cameraButton.style.display = 'block';

    document.getElementById(`video-${uid}`).remove();

    let videoFrames = document.getElementsByClassName('video__container');
    for (let i = 0; videoFrames.length > i; i++) {
      if (videoFrames[i].id != userIdInDisplayFrame) {
        videoFrames[i].style.height = '300px';
        videoFrames[i].style.width = '300px';
      }
    }

    await client.unpublish([localScreenTracks]);

    switchToCamera();
  }
};
let toggleBoard = async (e) => {
  let boardButton = e.currentTarget;
  if (!sharingBoard) {
    sharingBoard = true;

    miroBoardsPicker.open({
      clientId: '3458764576064619354',
      action: 'access-link',
      success: function (result) {
        console.log(result);

        boardButton.classList.add('active');

        io.emit('shareboard', {
          userId: uid,
          shareResult: result.accessLink,
        });

        document.getElementById('stream__box').innerHTML = result.embedHtml;
        document.getElementById('stream__box').style.display = 'flex';
      },
    });
  } else {
    sharingBoard = false;

    io.emit('closeboard', {
      shareBoard: sharingBoard,
    });

    boardButton.classList.remove('active');

    document.getElementById('stream__box').style.display = 'none';
    document.getElementById('miro-board').remove();
    database.ref('shareBoard/').remove();
  }
};
let leaveStream = async (e) => {
  localTracks[1].setEnabled(false);
  window.location.href = 'lobby.html';
};

let checkShareBoard = () => {
  database.ref('shareBoard/').on('value', function (snapshot) {
    var data = snapshot.val();
    let iframe = `<iframe class="miro-embedded-board" id="miro-board" src=${data.link} referrerpolicy="no-referrer-when-downgrade" allowfullscreen allow="fullscreen; clipboard-read; clipboard-write" style="background: transparent; border: 1px solid rgb(204, 204, 204);"></iframe>`;
    if (data.link != '') {
      document.getElementById('stream__box').innerHTML = iframe;
      document.getElementById('stream__box').style.display = 'flex';
    }
  });
};

document.getElementById('stream__box').addEventListener('click', (e) => {
  hideDisplayFrame(e, memberID);
});

document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('screen-btn').addEventListener('click', toggleScreen);
document.getElementById('board-btn').addEventListener('click', toggleBoard);

document.getElementById('leave-btn').addEventListener('click', leaveStream);

joinRoomInit();

checkShareBoard();

io.on('onshareboard', ({ userId, shareResult, shareBoard }) => {
  database.ref('shareBoard/uid').set(userId);

  if (shareResult) {
    database.ref('shareBoard/link').set(shareResult);
  }

  let iframe = `<iframe class="miro-embedded-board" id="miro-board" src=${shareResult} referrerpolicy="no-referrer-when-downgrade" allowfullscreen allow="fullscreen; clipboard-read; clipboard-write" style="background: transparent; border: 1px solid rgb(204, 204, 204);"></iframe>`;
  if (data.link != '') {
    document.getElementById('stream__box').innerHTML = iframe;
    document.getElementById('stream__box').style.display = 'flex';
  }
  io.on('onshareboard', ({ userId, shareResult }) => {
    console.log('hi ' + shareBoard);
    if (!shareBoard) {
      document.getElementById('stream__box').style.display = 'none';
      document.getElementById('miro-board').remove();
    }
  });
});
io.on('oncloseboard', ({ shareBoard }) => {
  console.log('hi ' + shareBoard);
  if (!shareBoard) {
    document.getElementById('stream__box').style.display = 'none';
    document.getElementById('miro-board').remove();
  }
});
