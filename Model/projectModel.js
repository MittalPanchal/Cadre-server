const mongoose = require("mongoose");
const randomColor = require("randomcolor");

const projectSchema = mongoose.Schema(
  {
    project_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assigned_date: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
    },
    completed: {
      type: Date,
    },
    is_completed: {
      type: Boolean,
    },
    lead: {
      type: Object,
      default: {},
    },
    member: {
      type: Array,
      default: [],
    },
    stack: {
      type: Array,
      default: [],
    },
    progress: {
      type: Number,
    },
    hex: {
      type: String,
      default: randomColor({ luminosity: "light" }),
    },
  },
  { collection: "Projects" }
);

module.exports = mongoose.model("project", projectSchema);
