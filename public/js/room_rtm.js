var io = io.connect('http://localhost:5502');

const threshold = 0.8; // our minimum threshold

let handleMemberJoined = async (MemberId) => {
  console.log('A new member has joined the room:', MemberId);
  addMemberToDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);

  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);
  addBotMessageToDom(`Welcome to the room ${name}! 👋`);
};

let addMemberToDom = async (MemberId) => {
  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);

  let membersWrapper = document.getElementById('member__list');
  let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`;

  membersWrapper.insertAdjacentHTML('beforeend', memberItem);
};

let updateMemberTotal = async (members) => {
  let total = document.getElementById('members__count');
  total.innerText = members.length;
};

let handleMemberLeft = async (MemberId) => {
  removeMemberFromDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);
};

let removeMemberFromDom = async (MemberId) => {
  let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
  let name = memberWrapper.getElementsByClassName('member_name')[0].textContent;
  addBotMessageToDom(`${name} has left the room.`);

  memberWrapper.remove();
};

let getMembers = async () => {
  let members = await channel.getMembers();
  updateMemberTotal(members);
  for (let i = 0; members.length > i; i++) {
    addMemberToDom(members[i]);
    shareMember(members[i]);
  }
};

let handleChannelMessage = async (messageData, MemberId) => {
  console.log('A new message was received');
  let data = JSON.parse(messageData.text);

  if (data.type === 'chat') {
    addMessageToDom(data.displayName, data.message);
  }

  if (data.type === 'user_left') {
    document.getElementById(`user-container-${data.uid}`).remove();

    if (userIdInDisplayFrame === `user-container-${uid}`) {
      displayFrame.style.display = null;

      for (let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.height = '300px';
        videoFrames[i].style.width = '300px';
      }
    }
  }
};

let sendMessage = async (e) => {
  e.preventDefault();

  let message = e.target.message.value;

  // const predictions = await classify(model, message);
  // if (predictions.length == 0) {
  //   addMessageToDom(displayName, message);
  // } else {
  //   addMessageToDom(displayName, '***');
  // }
  main(message, displayName);
  // addMessageToDom(displayName, message);

  e.target.reset();
};

let addMessageToDom = (name, message) => {
  let messagesWrapper = document.getElementById('messages');

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`;

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage);

  let lastMessage = document.querySelector(
    '#messages .message__wrapper:last-child'
  );
  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};
let addFileToDom = (name, fileName, fileUrl) => {
  let messagesWrapper = document.getElementById('messages');

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p><a class="message__text" href=${fileUrl} download=${fileName}>${fileName}</a></p>
                        </div>
                    </div>`;

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage);

  let lastMessage = document.querySelector(
    '#messages .message__wrapper:last-child'
  );
  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};

let addBotMessageToDom = (botMessage) => {
  let messagesWrapper = document.getElementById('messages');

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 GIT Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`;

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage);

  let lastMessage = document.querySelector(
    '#messages .message__wrapper:last-child'
  );
  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};

let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

window.addEventListener('beforeunload', leaveChannel);
let messageForm = document.getElementById('message__form');
messageForm.addEventListener('submit', sendMessage);

let shareMember = async (MemberId) => {
  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name']);

  let nameReview = [];

  nameReview.push(name);

  io.emit('member_review', { nameReview });
};

let classify = async (model, text) => {
  const sentences = [text]; // The model takes list as input
  // I used model.predict instead of model.classify
  let predictions = await model.classify(sentences);
  predictions = predictions.map((prediction) => ({
    label: prediction['label'],
    match: prediction.results[0]['match'],
  })); // Label is like "identity_threat", "toxicity"
  // match is whether the text matches the label
  return predictions.filter((p) => p.match).map((p) => p.label); // This gives us a list like ["identity_threat", "toxocity"]
};

const main = async (text, displayName) => {
  const model = await toxicity.load(threshold);

  const predictions = await classify(model, text);
  if (predictions.length == 0) {
    addMessageToDom(displayName, text);
    channel.sendMessage({
      text: JSON.stringify({
        type: 'chat',
        message: text,
        displayName: displayName,
      }),
    });
  } else {
    addMessageToDom(displayName, '***');
    channel.sendMessage({
      text: JSON.stringify({
        type: 'chat',
        message: '***',
        displayName: displayName,
      }),
    });
  }
};
