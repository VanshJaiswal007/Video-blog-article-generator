import axios from "axios";

export default async function getTranscript(req, res) {
  try {
    const { videoUrl } = req.body;

    let videoId;
    try {
      const urlObj = new URL(videoUrl);
      videoId = urlObj.searchParams.get("v");
    } catch {
      const match = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      videoId = match ? match[1] : videoUrl;
    }

    const response = await axios.get("https://youtube-transcriptor.p.rapidapi.com/transcript", {
      params: {
        video_id: videoId,
        lang: 'en'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com'
      }
    });

    const firstEntry = Array.isArray(response.data) ? response.data[0] : null;
    const transcript = firstEntry?.transcriptionAsText || "";

    res.status(200).json({ transcript });
  } catch (error) {
    console.error("Transcript fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch transcript." });
  }
}
