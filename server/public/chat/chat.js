const socket = io("localhost:3500");

const msgInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room");
const activity = document.querySelector(".activity");
const roomsList = document.querySelector(".roomList");
const chatDisplay = document.querySelector(".chatDisplay");
let errors;
fetch('../assets/json/errors.json')
  .then(response => {
    if (!response.ok) {
      console.log("Error : " + response.status);
    }
    return response.json();
  })
  .then(data => {
    errors = data;
  })
  .catch(error => {
    console.error("❌ Erreur lors du chargement JSON :", error);
  });

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
    if (nameInput.value) {
      if (chatRoom.value) {
        socket.emit("message", { name: nameInput.value, text: escapeHTML(msgInput.value) });
        msgInput.value = "";
      } else {
        alert(errors["err101"]);
      }
    } else {
      alert(errors["err102"]);
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
    navigator.clipboard.writeText(event.target.innerHTML.replace(/<br>/g, "\n"));
    alert("Copied !");
  }
});

document.querySelector(".formMsg").addEventListener("submit", sendMessage);
document.querySelector(".formJoin").addEventListener("submit", enterRoom);
msgInput.addEventListener("keypress", () => socket.emit("activity", nameInput.value));
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
socket.on("error", (code) => {
  console.log("Error : " + code)
  alert(errors[`err${code}`]);
})

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
