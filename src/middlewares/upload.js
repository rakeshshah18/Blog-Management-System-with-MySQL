const multer = require('multer');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/resources'); 
    },
    filename: (req, file, cb) => {
        const filename = file.originalname
        console.log("files form multer.", filename)
        cb(null, filename);
    },
});


// Multer Upload Middleware
const upload = multer({ storage: storage });

module.exports = upload;
