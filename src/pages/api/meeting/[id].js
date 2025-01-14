import pool from "../db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case "GET": {
        const [rows] = await pool.query(
          "SELECT sections FROM meetings WHERE id = ?",
          [id]
        );
        if (rows.length > 0) {
          // Handle sections parsing
          const sections =
            typeof rows[0].sections === "string"
              ? JSON.parse(rows[0].sections || "[]")
              : rows[0].sections || [];
          res.json({ sections });
        } else {
          res.status(404).json({ message: "Meeting not found" });
        }
        break;
      }

      case "PUT": {
        const { sections } = req.body;
        if (!Array.isArray(sections)) {
          res.status(400).json({ message: "Invalid data: sections must be an array" });
          return;
        }

        const sectionsJson = JSON.stringify(sections);
        const [result] = await pool.query(
          "UPDATE meetings SET sections = ? WHERE id = ?",
          [sectionsJson, id]
        );

        if (result.affectedRows > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ message: "Meeting not found" });
        }
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