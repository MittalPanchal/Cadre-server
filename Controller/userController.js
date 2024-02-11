const User = require("../Model/userModel");
const Chat = require('../Model/chatModel')
// const Project = require('../Model/projectModel');
const jwt = require("jsonwebtoken");

const generateJWT = (user) => {
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "12 hours" }
  );
  return token;
};

const signUp = async (req, res) => {
  const { name, email, password, role_name,contact_number} = req.body;
  try {
    let user = await User.signup(name, email, password, role_name, contact_number);
    let token = generateJWT(user);
    res.status(200).send({ _id: user._id, name: user.name, email: user.email, role_name: user.role_name, jwt: token, contact_number:user.contact_number });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.login(email, password);
    let token = generateJWT(user);

    res.status(200).send({ _id: user._id, name: user.name, email: user.email, role_name: user.role_name, jwt: token, img:user.img,contact_number:user.contact_number});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    await User.findById(id).then((data) => {
        res.send({ _id: data._id, name: data.name, email: data.email, role_name: data.role_name }).status(200);
    }).catch((err) => {
        res.status(500).send({ message: err.message });
    });
};

const getAllUser = async (req, res) => {
    const { column, order } = JSON.parse(req.query.sort);
    const sort = {};
    sort[`${column}`] = order 
    await User.find({}).collation({locale: "en"}).sort(sort).then((data) => {
        res.send(data).status(200);
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
};

const getUsersBySearch = async (req, res) => {
  const { search } = req.query;
  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' }},
      { email: { $regex: search, $options: 'i'}},
      { role_name: { $regex: search, $options: 'i' }}
    ]
  };
  try {
    const results = await User.find(query);
    res.json(results).status(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  };
};

const updateUser = async (req, res) => {
    const { name, contact_number,role_name } = req.body;
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { name, contact_number,role_name}, { new: true }).then((data) => {
        res.status(200).send({ success: true, message: "Details update successfully",
        _id: data._id, name: data.name, contact_number: data.contact_number,role_name:data.role_name
      });
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id).then((data) => {
        res.status(200).send({ message: "User delete successfully", res: data });
    }).catch((error) => {
      res.status(500).send({ message: error.message });
    });
};


const searchUser = async(req,res)=>{
  const { search } = req.query;
  const query = {
    name: { $regex: search, $options: "i" },
  };
  try {
    const user = await User.find(query);
    if (user) {
      res.status(200).send({
        success: true,
        message: "user get successfully",
        res: user,
      });
    } else {
      res.status(402).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

const getUserAndProjectBySearch = async (req, res) => {
  const { id } = req.params;
  const { search } = req.query;
  let userQuery = {}
  let projectQuery = {}
  if(search)
  {
    let temp = {};
    temp['$regex'] = search;
    temp['$options'] = "i";
    projectQuery['project_name'] = temp;
    userQuery['name'] = temp;
    projectQuery['chatName'] = temp
  }
  const users = await User.find({$and:[{...userQuery},{ _id:{$ne:id} }]}, {password: 0});
  const usersProject = await Chat.find({$and: [{ isGroupChat: true },{ users: id }, { ...projectQuery }]}).populate('latestMessage');
  if (users, usersProject) {
    res.status(200).send([
      ...users, ...usersProject
   ])
  } else {
    res.status(403).send({
      message: 'Something went wrong'
    })
  }
};

module.exports = {
  signUp,
  signIn,
  getUserById,
  getAllUser,
  updateUser,
  deleteUser,
  getUsersBySearch,
  searchUser,
  getUserAndProjectBySearch
};
