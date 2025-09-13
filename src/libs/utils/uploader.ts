import path from "path";
import multer from "multer";
import { v4 } from "uuid";
import fs from "fs";


function getTargetImageStorage(address: any) {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "..", "..", "uploads", address);

        // 📁 Papka mavjudligini tekshirish va yaratish
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: function (req, file, cb) {
        const extension = path.parse(file.originalname).ext;
        const random_name = v4() + extension;
        cb(null, random_name);
      },
    });
  }
  
  const makeUploader = (address: string) => {
    const storage = getTargetImageStorage(address);
    return multer({ storage: storage });
  };
  
  export default makeUploader;
