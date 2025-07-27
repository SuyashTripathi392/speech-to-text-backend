import express from "express";
import cors from "cors";
import 'dotenv/config';
import { supabase } from "./config/supabaseClient.js";
import {audioRoutes} from "./routes/audioRoutes.js";

import transcriptionRoute from './routes/transcriptionRoute.js';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Speech-to-Text Backend Working");
});
app.use("/api/audio", audioRoutes);
app.use('/api', transcriptionRoute);

app.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("test_table").select("*");

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
