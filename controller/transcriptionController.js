import axios from "axios";
import { supabase } from "../config/supabaseClient.js";

const baseURL = "https://api.assemblyai.com/v2";
const headers = {
  authorization: process.env.ASSEMBLY_API_KEY,
};

export const transcribeAudio = async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) {
      return res.status(400).json({ success: false, message: "audioUrl is required" });
    }

    // Step 1: Send transcription request
    const { data: transcriptData } = await axios.post(
      `${baseURL}/transcript`,
      {
        audio_url: audioUrl,
        speech_model: "universal",
      },
      { headers }
    );

    const transcriptId = transcriptData.id;
    const pollingEndpoint = `${baseURL}/transcript/${transcriptId}`;

    // Step 2: Polling until transcription completes
    while (true) {
      const { data: pollingData } = await axios.get(pollingEndpoint, { headers });

      if (pollingData.status === "completed") {

        // ✅ Save to Supabase
        await supabase.from("transcriptions").insert([
          {
            audio_url: audioUrl,
            transcribed_text: pollingData.text,
          },
        ]);


        return res.status(200).json({ success: true, text: pollingData.text });
      } else if (pollingData.status === "error") {
        return res.status(500).json({ success: false, message: pollingData.error });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  } catch (error) {
    console.error("❌ Transcription Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
