const multer = require('multer');
const userModel = require('../Model/userModel');

const imageStorage = multer.diskStorage({
    destination: 'public/dp',
    filename: (req, file, cb) => {
        cb(null, req.body.Id + '.jpg')
        userModel.findByIdAndUpdate(req.body.Id,{img:req.body.Id+".jpg"}).then((res)=>{
        }).catch(err=>{
            res.json(err);
        });
    }
  });
  
const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
  });
  
module.exports = { imageUpload }