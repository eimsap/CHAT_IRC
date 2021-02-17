const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cross Origin
app.use(require("cors")());

//Bring in the routes
app.use("/chatroom", require("./routes/chatroom"));

//Setup Error Handlers


module.exports = app;
