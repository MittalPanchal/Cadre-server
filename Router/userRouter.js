const express = require('express');
const userRouter = express.Router();

const { signUp, signIn, getUserById, getAllUser, updateUser, deleteUser, getUsersBySearch, getUserAndProjectBySearch } = require('../Controller/userController')
const { imageUpload } = require('../Multer/Multer')





userRouter.get('/', async (req, res) => {
    res.send('Hello World');
});
userRouter.post('/user-register', signUp);
userRouter.post('/user-login', signIn);
userRouter.get('/get-userbyid/:id', getUserById);
userRouter.get('/get-alluser', getAllUser);
userRouter.patch('/user-details-update/:id', updateUser);
userRouter.delete('/delete-user/:id', deleteUser);
userRouter.get('/get-users-by-search', getUsersBySearch);
userRouter.get('/get-user-and-project/:id', getUserAndProjectBySearch);
userRouter.post("/update-user-dp", imageUpload.single('Image'), (req, res) => {
    res.send("Image Uploaded");
    console.log(req.data,req.body,req.files);
});


module.exports = userRouter





