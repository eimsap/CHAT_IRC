require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
});

//Bring in the models
require("./models/Chatroom");
require("./models/Message");

const app = require("./app");

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

const io = require("socket.io")(server);

const Message = mongoose.model("Message");

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const newMessage = new Message({
        chatroom: chatroomId,
        user,
        message,
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.name,
      });
      await newMessage.save();
    }
  });
});
