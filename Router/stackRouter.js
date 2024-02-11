const express = require('express');
const stackRouter = express.Router();

const { getAllStack } = require('../Controller/stackController')


stackRouter.get('/get-all-stack', getAllStack)

module.exports = stackRouter
