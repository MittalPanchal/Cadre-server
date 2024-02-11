const mongoose = require('mongoose');


const taskSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    lead: {
        type: Object,
        default: {},
    },
    assigned: {                                                                                
        type: Array,
        default: [],
    },
    status: {
        type: String,
        required: true
    },
    priority: {
        type: Boolean,
        default: false
    },
    deadline: {
      type: Date
    }
}, {collection: 'Tasks'});

module.exports = mongoose.model('task', taskSchema);