const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    type: mongoose.Schema.Types.ObjectId,
    nameChat: {
      type: String,
      required: "Name is required!",
    },
    nameUser: {
      type: String,
      required: "Name is required!",
    },
    message: {
      type: String,
      required: "Name is required!",
    },
});

module.exports = mongoose.model("Message", messageSchema);
