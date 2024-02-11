const express = require('express');
const taskRouter = express.Router();


const { addTask, updateTask, getAllTasks } = require('../Controller/taskController');





taskRouter.post('/add-task', addTask);
taskRouter.put('/update-task/:id',updateTask);
taskRouter.get('/get-all-task', getAllTasks)


module.exports = taskRouter;