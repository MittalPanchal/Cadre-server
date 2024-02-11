const mongoose = require("mongoose");

const stackSchema = mongoose.Schema({
  url: String,
  title: String,
});

module.exports = mongoose.model("techstacks", stackSchema);
