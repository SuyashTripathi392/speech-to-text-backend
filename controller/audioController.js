import { supabase } from "../config/supabaseClient.js";





export const uploadAudio = async (req, res) => {
    const file = req.file;
    console.log(file)

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }
    const fileName = `${Date.now()}.${file.originalname.split(".").pop()}`;
    // const fileName = `${uuidv4()}.${file.originalname.split(".").pop()}`;
    console.log(fileName)

    const { data, error } = await supabase.storage.from("audio-files").upload(fileName, file.buffer, {
        contentType: file.mimetype,
    });

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    const { publicUrl } = supabase.storage.from('audio-files').getPublicUrl(fileName).data;

    if (!publicUrl) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate public URL"
        });
    }

    res.json({
        success: true,
        message: 'Audio uploaded successfully',
        fileName: file.originalname,
        url: publicUrl
    });
};
