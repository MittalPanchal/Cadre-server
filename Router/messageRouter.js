const express = require("express");
const messageRouter = express.Router();

const { sendMessage, getAllMessage } = require("../Controller/messageController");
const authenticateJWT = require("../Middleware/userAuth");
messageRouter.post("/message", authenticateJWT, sendMessage);
messageRouter.get("/message/:chatId", authenticateJWT, getAllMessage);
module.exports = messageRouter;
