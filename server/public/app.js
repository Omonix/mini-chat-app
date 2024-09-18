const socket = io("https://mini-chat-app-xeeh.onrender.com"); //ws://localhost:3500

const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const usersList = document.querySelector(".userList");
const roomsList = document.querySelector(".roomList");
const chatDisplay = document.querySelector(".chatDisplay");

msgInput.focus();

const sendMessage = (e) => {
  e.preventDefault();
  const msgInput = document.querySelector(".message");
  if (msgInput.value && nameInput.value && chatRoom.value) {
    socket.emit("message", { name: nameInput.value, text: msgInput.value });
    msgInput.value = "";
  }
  msgInput.focus();
};
const enterRoom = (e) => {
  e.preventDefault();
  if (nameInput.value && chatRoom.value) {
    socket.emit("enterRoom", {
      name: nameInput.value,
      room: chatRoom.value.toLowerCase(),
    });
  }
};
const random = () => {
  return `#${Math.floor(Math.random() * 255 ** 3).toString(16)}`;
};

document.querySelector(".randomer").addEventListener("click", () => {
  document
    .querySelector(":root")
    .style.setProperty("--random-color-one", random());
  document
    .querySelector(":root")
    .style.setProperty("--random-color-two", random());
});
document.addEventListener("click", (event) => {
  if (event.target.className === "postText") {
    navigator.clipboard.writeText(event.target.innerHTML);
    alert("Copied !");
  }
});

document.querySelector(".formMsg").addEventListener("submit", sendMessage);
document.querySelector(".formJoin").addEventListener("submit", enterRoom);
msgInput.addEventListener("keypress", () => {
  socket.emit("activity", nameInput.value);
});

socket.on("hello", (data) => {
  let roomer = "";
  if (data[1] && data[1] !== "") {
    roomer = `- ${data[1]} `;
  }
  document.title = `ChatWing ${roomer}- ${data[0].substring(0, 5)}`;
});
socket.on("message", (data) => {
  activity.textContent = "";
  const { name, text, time } = data;
  const li = document.createElement("li");
  li.className = "post";
  if (name === nameInput.value) {
    li.className = "postLeft";
  }
  if (name !== nameInput.value && name !== "Admin") {
    li.className = "postRight";
  }
  if (name !== "Admin") {
    li.innerHTML = `<div class="postHeader ${
      name === nameInput.value ? "postHeaderUser" : "postHeaderReply"
    }">
    <span class="postHeaderTime">${time}</span><span class="postHeaderName">${name}</span>
    </div>
    <div class="postText">${
      text.substring(0, 1).toUpperCase() + text.substring(1, text.length)
    }</div>`;
  } else {
    li.className = "postAdmin";
    li.innerHTML = `<div class="postText">${
      text.substring(0, 1).toUpperCase() + text.substring(1, text.length)
    }</div>`;
  }
  document.querySelector(".chatDisplay").appendChild(li);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;

  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 3000);
});

socket.on("userList", ({ users }) => {
  showUsers(users);
});
socket.on("roomList", ({ rooms }) => {
  showRooms(rooms);
});

const showUsers = (users) => {
  usersList.textContent = "";
  if (users) {
    usersList.innerHTML = `<em>Users in "${
      chatRoom.value.substring(0, 1).toUpperCase() +
      chatRoom.value.substring(1, chatRoom.value.length).toLowerCase()
    }" :</em>`;
    users.forEach((user, i) => {
      usersList.textContent += ` ${user.name}`;
      if (users.length > 1 && i !== users.length - 1) {
        usersList.textContent += ",";
      }
    });
  }
};
const showRooms = (rooms) => {
  roomsList.textContent = "";
  if (rooms) {
    roomsList.innerHTML = `<em>Active rooms :</em>`;
    rooms.forEach((room, i) => {
      roomsList.textContent += ` ${
        room.substring(0, 1).toUpperCase() + room.substring(1, room.length)
      }`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomsList.textContent += ",";
      }
    });
  }
};
