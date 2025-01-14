import { get, set } from '@vercel/edge-config';

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    switch (req.method) {
      case "GET": {
        const sections = await get('sections') || [];
        res.json({ sections });
        break;
      }
      
      case "PUT": {
        const { sections } = req.body;
        if (!Array.isArray(sections)) {
          res.status(400).json({ message: "Invalid data: sections must be an array" });
          return;
        }
        
        await set('sections', sections);
        res.json({ success: true });
        break;
      }
      
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}