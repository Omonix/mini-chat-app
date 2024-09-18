import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";
const app = express();
app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});

const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} (${socket.id.substring(0, 5)}) connected`);
  socket.emit("hello", [socket.id, ""]);
  socket.emit("message", buildMsg(ADMIN, "Welcome on ChatWing !"));
  socket.on("enterRoom", ({ name, room }) => {
    const prevRoom = getUser(socket.id)?.room;
    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        "message",
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }
    const user = activateUser(socket.id, name, room);
    socket.emit("hello", [
      socket.id,
      user.room.substring(0, 1).toUpperCase() +
        user.room.substring(1, user.room.length),
    ]);
    if (prevRoom) {
      io.to(prevRoom).emit("userList", { users: getUserInRoom(prevRoom) });
    }
    socket.join(user.room);

    socket.emit(
      "message",
      buildMsg(
        ADMIN,
        `You have joined the ${
          user.room.substring(0, 1).toUpperCase() +
          user.room.substring(1, user.room.length)
        } room`
      )
    );
    socket.broadcast
      .to(user.room)
      .emit("message", buildMsg(ADMIN, `${user.name} have joined the room`));
    io.to(user.room).emit("userList", {
      users: getUserInRoom(user.room),
    });
    io.emit("roomList", { rooms: getAllActiveRooms() });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        buildMsg(ADMIN, `${user.name} has left the room`)
      );
      io.to(user.room).emit("userList", { users: getUserInRoom(user.room) });
      io.emit("roomList", {
        rooms: getAllActiveRooms(),
      });
    }
    console.log(
      `User ${socket.id} (${socket.id.substring(0, 5)}) disconnected`
    );
  });

  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });
  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

const buildMsg = (name, text) => {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
};
const activateUser = (id, name, room) => {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
};
const userLeaves = (id) => {
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
};
const getUser = (id) => {
  return UsersState.users.find((user) => user.id === id);
};
const getUserInRoom = (room) => {
  return UsersState.users.filter((user) => user.room === room);
};
const getAllActiveRooms = () => {
  return Array.from(new Set(UsersState.users.map((user) => user.room)));
};
