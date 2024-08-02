const path=require('path')
const multer=require('multer')

var storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'uploads/')
    },
    filename: function (req, file, cb) {
        let ext=path.extname(file.originalname)
        cb(null,Date.now() + ext)
    }
})
const uploadImage = multer({
     storage: storage,
     fileFilter:function(req,file,callback){
        if(
            file.mimetype =='image/png'||
            file.mimetype =='image/jpg' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/webp' ||
            file.mimetype == 'image/avif'
            ){
                callback(null,true)

        }else{
            console.log('select valid image format');
            callback(null,false)
        }
     },
     limits:{
        fieldSize: 1024 * 1024 * 5
     }
     });


module.exports = uploadImage;