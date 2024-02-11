const projectModel = require("../Model/projectModel");
const timesheet = require("../Model/timesheetModel");
const userModel = require("../Model/userModel");

const addTimeSheet = async (req, res) => {
  const { user, works, Date } = req.body;
  const users = await timesheet.findOne({
    $and: [{ Date: Date }, { user: user }],
  });
  if (users) {
    let work = [...users.works, ...works];
    await timesheet
      .findOneAndUpdate(users._id, { works: work }, { new: true })
      .then((data) => {
        res.json(data).status(200);
      })
      .catch((error) => {
        res.json(error).status(500);
      });
  } else {
    await timesheet
      .create({ user, works, Date })
      .then((data) => {
        res.json(data).status(200);
      })
      .catch((error) => {
        res.json(error).status(500);
      });
  }
};

const getTimeSheetByIdandDate = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  var query = {
    user: id,
  };
  if (date) {
    query["Date"] = date;
  }
  const users = await userModel.findById({ _id: id });
  if (users.role_name === "Admin") {
    delete query.user;
  }
  if (users.role_name === "Sr Devloper") {
    const usersProject = await projectModel.find({ "lead._id": id });
    let userId = [];
    var projectName = [];
    usersProject.map((res) => {
      projectName.push(res.project_name);
      userId.push(res.lead._id);
      for (let i = 0; i < res.member.length; i++) {
        userId.push(res.member[i]._id);
      }
    });
    query = {
      user: { $in: userId },
      Date: date,
    };
  }
  await timesheet
    .find(query)
    .populate("user")
    .then((data) => {
      if (users.role_name === "Sr Devloper") {
        for (let i = 0; i < data.length; i++) {
          data[i]["works"] = data[i].works.filter((e) =>
            projectName.includes(e.projectName)
          );
        }
      }
      res.json(data).status(200);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
};

const getAllTimeSheet = async (req, res) => {
  await timesheet
    .find()
    .then((data) => {
      res.json(data).status(200);
    })
    .catch((error) => {
      res.json({ message: error.message });
    });
};

module.exports = { addTimeSheet, getTimeSheetByIdandDate, getAllTimeSheet };
