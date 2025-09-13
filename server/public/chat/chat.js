const socket = io("https://mini-chat-app-xeeh.onrender.com");
const msgInput = document.querySelector("#message");
const chatRoom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const roomsList = document.querySelector(".roomList");
const chatDisplay = document.querySelector(".chatDisplay");
const imageLogo = document.querySelector(".chatLogo");
const canvasLogo = document.querySelector(".canvasLogo");
const ctx = canvasLogo.getContext("2d");

const escapeHTML = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/  /g, "&#8239;&#8239;")
    .replace(/\u2028|\u2029|(\r\n|\n|\r)/g, "<br>");
}
const sendMessage = (e) => {
  try {
    e.preventDefault();
  } catch (error) {
    error;
  }
  if (msgInput.value) {
    if (chatRoom.value) {
      socket.emit("message", { name: localStorage.getItem("username"), text: escapeHTML(msgInput.value) });
      msgInput.value = "";
    } else {
      console.log("Error 400: Missing room");
      alert("Missing room");
    }
  }
  msgInput.focus();
};
const enterRoom = (e) => {
  try {
    e.preventDefault();
  } catch (error) {
    error;
  }
  if (chatRoom.value) {
    socket.emit("enterRoom", {
      name: localStorage.getItem("username"),
      room: chatRoom.value.toLowerCase(),
    });
  }
};
const verifyToken = () => {
  const expiry = localStorage.getItem("exp");
  if (Date.now() - expiry >= 86400000) {
    localStorage.clear();
    window.location.href = '../login';
    alert("You are not connected");
  } else {
    document.querySelector(":root").style.setProperty("--random-color-one", localStorage.getItem("colorA") ? localStorage.getItem("colorA") : "#93EC9C");
    document.querySelector(":root").style.setProperty("--random-color-two", localStorage.getItem("colorB") ? localStorage.getItem("colorB") : "#2CA254");
    document.querySelector('.pseudo').innerText = localStorage.getItem("username");
    if (localStorage.getItem("colorA") === "#93EC9C" && localStorage.getItem("colorB") === "#2CA254") {
      imageLogo.style.display = "auto";
      canvasLogo.style.display = "none";
    } else {
      imageLogo.style.display = "none";
      canvasLogo.style.display = "auto";
      handleColorImg(hexaToRGB(localStorage.getItem("colorA")), hexaToRGB(localStorage.getItem("colorB")));
    }
  }
}
const random = () => {
  return `#${Math.floor(Math.random() * 255 ** 3).toString(16)}`;
};
const showUsers = (users) => {
  for (let i = 0; i < users.length; i++) {
    for (let y = 0; y < users[i].users.length; y++) {
      if (y === 0) {
        document.querySelectorAll('.oneUsers')[i].innerText = users[i].users[y];
        document.querySelectorAll('.oneUsers')[i].title = users[i].users[y];
      } else {
        document.querySelectorAll('.oneUsers')[i].innerText += `, ${users[i].users[y]}`;
        document.querySelectorAll('.oneUsers')[i].title += `, ${users[i].users[y]}`;
      }
    }
  }
};
const showRooms = (rooms, users) => {
  roomsList.innerHTML = "";
  if (rooms && rooms.length !== 0) {
    rooms.forEach((room, i) => {
      let li = document.createElement('li');
      let thisRoom = document.createElement('p');
      let users = document.createElement('p');
      li.className = "oneInfo";
      thisRoom.className = "oneRoom"
      users.className = "oneUsers";
      thisRoom.innerText = `${room.substring(0, 1).toUpperCase() + room.substring(1, room.length)}`;
      roomsList.appendChild(li);
      document.querySelectorAll('.oneInfo')[i].appendChild(thisRoom);
      document.querySelectorAll('.oneInfo')[i].appendChild(users);
      document.querySelectorAll('.oneInfo')[i].addEventListener('click', () => {
        chatRoom.value = document.querySelectorAll('.oneRoom')[i].innerText;
        enterRoom();
      })
    });
    showUsers(users);
  } else {
    let noth = document.createElement('p');
    noth.className = "noRoom";
    noth.innerText = "No room";
    roomsList.appendChild(noth);
  }
};
const colorDistance = (c1, c2, tolerance=50) => {
  return Math.abs(c1[0] - c2[0]) < tolerance &&
        Math.abs(c1[1] - c2[1]) < tolerance &&
        Math.abs(c1[2] - c2[2]) < tolerance;
}
const hexaToRGB = (hexa) => {
  hexa = hexa.substring(1, hexa.length);
  return [parseInt(hexa.substring(0, 2), 16), parseInt(hexa.substring(2, 4), 16), parseInt(hexa.substring(4, 6), 16)];
}
const handleColorImg = (colora, colorb) => {
  canvasLogo.width = 539;
  canvasLogo.height = 107;
  ctx.drawImage(imageLogo, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvasLogo.width, canvasLogo.height);
  const data = imageData.data;
  const oldColors = [
    [147, 236, 156],
    [44, 162, 84]
  ];
  const newColors = [colora, colorb];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    for (let j = 0; j < oldColors.length; j++) {
      if (colorDistance([r, g, b], oldColors[j], 65)) {
        data[i] = newColors[j][0];
        data[i + 1] = newColors[j][1];
        data[i + 2] = newColors[j][2];
        break;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
verifyToken();

document.querySelector(".randomer").addEventListener("click", async () => {
  const colorA = random();
  const colorB = random();
  document
    .querySelector(":root")
    .style.setProperty("--random-color-one", colorA);
  document
    .querySelector(":root")
    .style.setProperty("--random-color-two", colorB);
  localStorage.setItem("colorA", colorA);
  localStorage.setItem("colorB", colorB);
  await axios.patch(`https://mini-chat-app-xeeh.onrender.com/colors/`, { username: localStorage.getItem("username"), colorA, colorB });
});
document.addEventListener("click", (event) => {
  if (event.target.className === "postText") {
    navigator.clipboard.writeText(event.target.innerHTML.replace(/<br>/g, "\n"));
    alert("Copied !");
  }
});
document.querySelector(".pseudo").addEventListener("click", () => {
  const disconnect = confirm("Do you want to log out ?");
  if (disconnect) {
    window.location.href = '../';
    localStorage.clear();
  }
});

document.querySelector(".formMsg").addEventListener("submit", sendMessage);
document.querySelector(".formJoin").addEventListener("submit", enterRoom);
msgInput.addEventListener("keypress", () => socket.emit("activity", localStorage.getItem("username")));
msgInput.addEventListener("input", (key) => {
  if (key.inputType === "insertLineBreak") {
    sendMessage();
  } else {
    if (msgInput.value.length <= 26) {
      msgInput.style.height = "23px";
    } else if (msgInput.value.length > 26 && msgInput.value.length <= 53) {
      msgInput.style.height = `${22 * 2}px`;
    } else if (msgInput.value.length > 53 && msgInput.value.length <= 80) {
      msgInput.style.height = `${22 * 3}px`;
    } else {
      msgInput.style.height = `${22 * 4}px`;
    }
  }
})

socket.on("hello", (data) => {
  let roomer = "";
  if (data[1] && data[1] !== "") {
    roomer = `- ${data[1]} `;
  }
  document.title = `ChatWings ${roomer}💬`;
});
socket.on("message", (data) => {
  activity.textContent = "";
  const { name, text, time } = data;
  const li = document.createElement("li");
  li.className = "post";
  if (name === localStorage.getItem("username")) {
    li.className = "postLeft";
  }
  if (name !== localStorage.getItem("username") && name !== "Admin") {
    li.className = "postRight";
  }
  if (name !== "Admin") {
    li.innerHTML = `<div class="postHeader ${
      name === localStorage.getItem("username") ? "postHeaderUser" : "postHeaderReply"
    }">
    <span class="postHeaderTime">${time}</span><span class="postHeaderName">${name}</span>
    </div>
    <div class="postText">${text}</div>`;
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

socket.on("roomList", ({ rooms, users }) => {
  showRooms(rooms, users);
});
