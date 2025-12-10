import multer from 'multer';
import fs from 'fs';

fs.mkdirSync('./public/temp', { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });