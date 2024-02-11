const task = require("../Model/taskModel");

const addTask = async (req, res) => {
  const newtask = await task.create({ ...req.body, status: "pending" });
  if (newtask) {
    res.status(200).json(newtask)
  } else {
    res.status(401).send({
      message: "Something went wrong"
    });
  }
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { project, title, description, assigned, status } = req.body;
  task
    .findByIdAndUpdate( id, { project, title, description, assigned, status }, { new: true }).then((data) => {
      res.json(data).status(200);
    }).catch((err) => {
      res.json({ message: err.message }).status(500);
    });
};

const getAllTasks = async (req, res) => {
    await task.find().populate('project').then(data => {
      res.json(data).status(200);
    }).catch(error => {
      res.json({message: error.message});
    });
};

module.exports = { addTask, updateTask,  getAllTasks};
