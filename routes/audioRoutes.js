import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadAudio } from "../controller/audioController.js";

export const audioRoutes = express.Router();

audioRoutes.post('/uploads', upload.single("audio"), uploadAudio);


