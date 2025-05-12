import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const filename = generateFileName(file.originalname);
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

const generateFileName = (originalname: string): string => {
  const randomName = randomBytes(32).toString('hex');
  const ext = originalname.split('.').pop();

  return `${randomName}.${ext}`;
};
