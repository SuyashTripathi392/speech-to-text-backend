import express from 'express';
import { transcribeAudio } from '../controller/transcriptionController.js';

const transcriptionRoute = express.Router();

transcriptionRoute.post('/transcribe', transcribeAudio);

export default transcriptionRoute;
