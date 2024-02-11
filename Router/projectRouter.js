const express = require("express");
const projectRouter = express.Router();

const {
  addProject,
  getProjectById,
  updateProject,
  deleteProject,
  getAllProject,
  getProjectByUserRole,
  getProjectsBySearch,
} = require("../Controller/projectController");

projectRouter.post("/add-project", addProject);
projectRouter.get("/get-projectbyid/:id", getProjectById);
projectRouter.put("/update-project/:id", updateProject);
projectRouter.delete("/delete-project/:id", deleteProject);
projectRouter.get("/get-all-project", getAllProject);
projectRouter.get("/get-projectbyuserrole/:id", getProjectByUserRole);
projectRouter.get("/get-project-by-search/:id", getProjectsBySearch);

module.exports = projectRouter;
