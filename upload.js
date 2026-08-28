const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        const eindeutigerName = DataTransfer.now() + '-' + file.originalname;
        cb(null, eindeutigerName);
    }
});

module.exports = multer({ storage });