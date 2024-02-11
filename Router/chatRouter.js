const express = require('express');
const chatRouter = express.Router();

const { accessChat, fetchChat, groupChat } = require('../Controller/chatController');
const authenticateJWT = require('../Middleware/userAuth');

chatRouter.post('/chat',authenticateJWT,accessChat);
chatRouter.post('/Groupchat',authenticateJWT,groupChat);
chatRouter.get('/chat',authenticateJWT,fetchChat);


module.exports = chatRouter;