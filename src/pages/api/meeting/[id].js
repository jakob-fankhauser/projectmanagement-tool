import { get, set } from '@vercel/edge-config';

export default async function handler(req, res) {
  const { id } = req.query;
  try {
    switch (req.method) {
      case "GET": {
        try {
          const sections = await get('sections') || [];
          res.json({ sections });
        } catch (getError) {
          console.error("Error getting sections:", getError);
          res.status(500).json({ message: "Error retrieving sections", details: getError.message });
        }
        break;
      }
      case "PUT": {
        const { sections } = req.body;
        if (!Array.isArray(sections)) {
          res.status(400).json({ message: "Invalid data: sections must be an array" });
          return;
        }
        try {
          await set('sections', sections);
          res.json({ success: true });
        } catch (setError) {
          console.error("Error setting sections:", setError);
          res.status(500).json({ message: "Error updating sections", details: setError.message });
        }
        break;
      }
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Unexpected API Error:", error);
    res.status(500).json({ message: "Unexpected internal server error", details: error.message });
  }
}