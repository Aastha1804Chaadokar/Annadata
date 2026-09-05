import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  uploadSoilReportDocument,
  verifyAndSaveSoilReport,
  createSoilReport,
  getSoilReportsByFarm,
  getLatestVerifiedReport,
  getSoilTrends,
  getSoilReportById,
  getSoilReportFile,
  deleteSoilReport,
} from '../controllers/soilReport.controller.js';

const router = Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads', 'soil-reports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `soil_report_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter: Allow PDF, JPG, JPEG, PNG, WEBP up to 15MB
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 Megabytes
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|jpe?g|png|webp/i;
    const extMatch = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeMatch = allowed.test(file.mimetype) || file.mimetype === 'application/pdf';

    if (extMatch && mimeMatch) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'));
    }
  },
});

// Routes
router.post('/soil-reports/upload', upload.single('report'), uploadSoilReportDocument);
router.post('/soil-reports/verify', verifyAndSaveSoilReport);
router.get('/soil-reports/latest', getLatestVerifiedReport);
router.get('/soil-reports/trends/:farmId', getSoilTrends);
router.get('/soil-reports/file/:filename', getSoilReportFile);

router.post('/soil-reports', createSoilReport);
router.get('/soil-reports/farm/:farmId', getSoilReportsByFarm);
router.get('/soil-reports/:id', getSoilReportById);
router.delete('/soil-reports/:id', deleteSoilReport);

export default router;
