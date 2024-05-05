import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}+${file.originalname.replace(
      /\s/g,
      ''
    )}`;
    cb(null, uniqueFileName);
  },
});

export const upload = multer({ storage });

/**
 * @param {string[]} urls
 * @returns {void}
 */
export const clearFiles = (...urls) => {
  urls.forEach((url) => {
    try {
      if (!url) return;
      const index = url.indexOf('public');
      if (index == -1) return;

      const filePath = path.resolve(url.slice(index));

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('failed to remove file', err);
          // throw err;
        }
      });
    } catch (error) {
      console.log('failed to remove file', error);
    }
  });
};
