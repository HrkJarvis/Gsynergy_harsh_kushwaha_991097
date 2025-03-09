import path from "path";
import xlsx from "xlsx";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.join(process.cwd(), "public", "assets", "GSIV25 - Sample Data.xlsx");
    const workbook = xlsx.readFile(filePath);

    // 🔹 Read "Calculation" sheet instead of "Planning"
    const sheetName = "Calculations";
    const worksheet = workbook.Sheets[sheetName];
    const calculationData = xlsx.utils.sheet_to_json(worksheet);
 // Debugging

    res.status(200).json(calculationData);
  } catch (error) {
    console.error("Error reading Calculation sheet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
