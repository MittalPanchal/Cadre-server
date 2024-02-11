const Stack = require("../Model/stackModel");

const getAllStack = async (req, res) => {
    await Stack.find().then(data => {
        res.json(data).status(200);
    }).catch(error => {
        res.json({message: error.message}).status(500);
    });
};
module.exports={
     getAllStack
}