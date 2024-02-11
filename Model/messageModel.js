const mongoose = require('mongoose');


const messageModel = mongoose.Schema({

    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users" 
    },
    content: { 
        type: String, 
        trim: true
    },
    chat: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chat"
    }
    },

    {collection: 'Messages'},
    { timestamps: true }

);
  

module.exports = mongoose.model("Message", messageModel)