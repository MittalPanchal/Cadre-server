const { model } = require("mongoose");
const chatModel = require("../Model/chatModel");
const messageModel = require("../Model/messageModel");
const userModel = require("../Model/userModel");

const sendMessage = async (req, res) => {
  console.log(req.body)
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("invalid data");
    return res.status(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await messageModel.create(newMessage);
    message = await message.populate("sender", "name img");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name email img",
    });
    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.send(message);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
const getAllMessage = async (req,res) => {
  try {
    const message = await messageModel.find({ chat: req.params.chatId }).populate("sender").populate("chat");
    res.send(message);
  } catch (err) {
    res.status(400)
    throw new Error (err);
  }
};
module.exports = {
  sendMessage,
  getAllMessage
};
