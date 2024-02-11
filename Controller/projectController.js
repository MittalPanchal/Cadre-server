const Project = require("../Model/projectModel");
const task = require("../Model/taskModel");
const userModel = require("../Model/userModel");

const addProject = async (req, res) => {
  const {
    project_name,
    description,
    assigned_date,
    deadline,
    completed,
    is_completed,
    lead,
    member,
    stack,
    progress,
  } = req.body;

  await Project.create({
    project_name,
    description,
    assigned_date,
    deadline,
    completed,
    is_completed,
    lead,
    member,
    stack,
    progress,
  })
    .then((data) => {
      res.json(data).status(200);
    })
    .catch((err) => {
      res.json({ message: err.message }).status(500);
    });
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let projectData = await Project.findById(id);
    let taskData = await task.find({ project: projectData._id });
    res.json({ ...projectData._doc, task: taskData }).status(200);
  } catch (error) {
    res.json({ message: error.message }).status(500);
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    project_name,
    description,
    assigned_date,
    deadline,
    completed,
    is_completed,
    lead,
    member,
    task,
    stack,
    progress,
  } = req.body;
  await Project.findByIdAndUpdate(
    id,
    {
      project_name,
      description,
      assigned_date,
      deadline,
      completed,
      is_completed,
      lead,
      member,
      task,
      stack,
      progress,
    },
    { new: true }
  )
    .then((data) => {
      res.json(data).status(200);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id)
    .then((data) => {
      res.json(data).status(200);
    })
    .catch((error) => {
      res.json({ message: error.message }).status(500);
    });
};

const getAllProject = async (req, res) => {
  const { column, order } = JSON.parse(req.query.sort);
  var sort = {};
  sort[`${column}`] = order;
  await Project.find({})
    .collation({ locale: "en" })
    .sort(sort)
    .then((data) => {
      res.json(data).status(200);
    })
    .catch((error) => {
      res.json({ message: error.message }).status(500);
    });
};

const getProjectByUserRole = async (req, res) => {
  const { id } = req.params;
  const { column, order } = JSON.parse(req.query.sort);
  var sort = {};
  sort[`${column}`] = order;
  const users = await userModel.findById({ _id: id });
  var query = {
    $or: [
      {
        "member._id": id,
      },
      {
        "lead._id": id,
      },
    ],
  };
  if (users.role_name === "Admin") {
    query = {};
  }
  const usersProject = await Project.find(query)
    .collation({ locale: "en" })
    .sort(sort);
  if (usersProject) {
    res.status(200).send({
      res: usersProject,
    });
  } else {
    res.status(402).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getProjectsBySearch = async (req, res) => {
  const { id } = req.params;
  const { search } = req.query;
  const query = {
    project_name: { $regex: search, $options: "i" },
    // $or: [{ project_name: { $regex: search, $options: "i" } }],
  };
  try {
    const users = await userModel.findById({ _id: id });
    var isAdmin = {
      $or: [{ "member._id": id }, { "lead._id": id }],
    };
    if (users.role_name === "Admin") {
      isAdmin = {};
    }

    const projects = await Project.find({
      $and: [isAdmin, { ...query }],
    });
    if (projects) {
      res.status(200).send({
        success: true,
        message: "Project get successfully",
        res: projects,
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
};

module.exports = {
  addProject,
  getProjectById,
  updateProject,
  deleteProject,
  getAllProject,
  getProjectByUserRole,
  getProjectsBySearch,
};
