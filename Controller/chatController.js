const chatModel = require("../Model/chatModel");
const User = require("../Model/userModel");

const accessChat = async (req, res) => {
  var { userId } = req.body;
  if (!userId) {
    return res.send().status(400);
  }

  var ischat = chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");
  ischat = await User.populate(ischat, {
    path: "latestMessage.sender",
    select: "name email img",
  });
  if (ischat.length > 0) {
    res.send(ischat[0]);
  } else {
    let chatdata = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createchat = await chatModel.create(chatdata);
      const fullchat = await chatModel
        .findOne({ _id: createchat._id })
        .populate("users", "-password");
      res.status(200).send(fullchat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};
const fetchChat = async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email img",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
  }
};
const groupChat = async(req,res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "pleace fill this filed" });
  }
  let users = JSON.parse(req.body.users);
  if (req.body.user < 2) {
    return res.status(400).send({ message: "send mor than two users" });
  }
  users.push(req.user)
  try{
    let Groupchatdata = {
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin:req.user
    }
    const createGroupchat = await chatModel.create(Groupchatdata);
    const fullchat = await chatModel
      .findOne({ _id: createGroupchat._id })
      .populate("users", "-password");
    res.status(200).send(fullchat);

  }catch(err){
    res.status(400);
      throw new Error(err.message);
  }
};
module.exports = {
  accessChat,
  fetchChat,
  groupChat,
};
