const express = require('express');
const timesheetRouter = express.Router();

const { addTimeSheet, getTimeSheetByIdandDate, getAllTimeSheet } = require('../Controller/timesheetController');

timesheetRouter.post('/add-timesheet', addTimeSheet);
timesheetRouter.get('/get-timesheet/:id', getTimeSheetByIdandDate);
timesheetRouter.get('/get-all-timesheet', getAllTimeSheet);

module.exports = timesheetRouter