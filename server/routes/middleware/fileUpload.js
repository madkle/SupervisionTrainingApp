

import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Ensure the downloads directory exists
const DOWNLOADS_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true, mode: 0o777 });
}


// Multer configuration for saving uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOWNLOADS_DIR); // Save files to the downloads directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});
export const upload = multer({ storage });