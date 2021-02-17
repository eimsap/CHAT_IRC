const mongoose = require("mongoose");

const chatroomSchema = mongoose.Schema({
  title: {
    type: String,
    required: "Name is required!",
  },
  title: {
    type: String,
    required: "Name is required!",
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
