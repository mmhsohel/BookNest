// routes/versionRoutes.js
import express from 'express';
import { getVersion } from '../controller/versionController.js';

const router = express.Router();

router.get('/version', getVersion);

export default router;
