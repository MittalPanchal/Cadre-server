require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const RootRouter = require("./Router");
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/public", express.static("public"));

app.use(RootRouter);

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Increase timeout to 30 seconds
    socketTimeoutMS: 30000,
    // Optionally increase the connection timeout as well
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log("connect successfully");
  })
  .catch((error) => {
    console.log("Connection Error", error);
  });
mongoose.set("strictQuery", true);

const server = app.listen(process.env.PORT, () => {
  console.log(`Your server is running on ${process.env.PORT}`);
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connection socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user join room" + room);
  });
  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
