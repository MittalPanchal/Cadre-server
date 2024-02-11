const express = require("express");
const RootRouter = express.Router();
const userRouter = require("./Router/userRouter");
const projectRouter = require("./Router/projectRouter");
const stackRouter = require("./Router/stackRouter");
const taskRouter = require("./Router/taskRouter");
const timesheetRouter = require("./Router/timesheetRouter");
const nodemail = require("./Controller/nodemailer");
const chatRouter = require('./Router/chatRouter');
const messageRouter = require('./Router/messageRouter');

RootRouter.use("/", userRouter);
RootRouter.use("/", projectRouter);
RootRouter.use("/", stackRouter);
RootRouter.use("/", taskRouter);
RootRouter.use("/", timesheetRouter);
RootRouter.post('/mail',nodemail);
RootRouter.use('/', chatRouter);
RootRouter.use('/', messageRouter);

module.exports = RootRouter;
