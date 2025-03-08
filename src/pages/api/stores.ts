import { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

const filePath = path.join(process.cwd(), "public", "assets", "GSIV25 - Sample Data.xlsx"); // Adjust path if needed

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // ✅ Load store data
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets["Stores"];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      return res.status(200).json(jsonData);
    }

    if (req.method === "POST") {
      console.log("Received data:", req.body); // ✅ Debugging
      const ID = req.body.ID || req.body.id;
      const Label = req.body.Label || req.body.label;
      const City = req.body.City || req.body.city;
      const State = req.body.State || req.body.state;

      if (!ID || !Label || !City || !State) {
        console.error("Missing fields in request body");
        return res.status(400).json({ error: "All fields (ID, Label, City, State) are required" });
      }

      // ✅ Read existing data
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets["Stores"];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      // ✅ Get the next Seq No. (increment automatically)
      const lastSeq = jsonData.length > 0 ? jsonData[jsonData.length - 1]["Seq No."] : 0;
      const newSeq = lastSeq + 1;

      // ✅ Append new store entry
      jsonData.push({ "Seq No.": newSeq, ID, Label, City, State });

      // ✅ Convert back to Excel format
      const newSheet = XLSX.utils.json_to_sheet(jsonData);
      workbook.Sheets["Stores"] = newSheet;

      // ✅ Save updated Excel file
      XLSX.writeFile(workbook, filePath);

      return res.status(201).json({ message: "Store added successfully", store: { "Seq No.": newSeq, ID, Label, City, State } });
    }

    if (req.method === "DELETE") {
      const { ID } = req.query; // ✅ Get ID from query params

      if (!ID) {
        console.error("Missing ID in request");
        return res.status(400).json({ error: "ID is required for deletion" });
      }

      // ✅ Read existing data
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets["Stores"];
      let jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      // ✅ Filter out the store with the given ID
      const newData = jsonData.filter((store) => store.ID !== ID);

      if (newData.length === jsonData.length) {
        console.error(`Store with ID ${ID} not found`);
        return res.status(404).json({ error: `Store with ID ${ID} not found` });
      }

      // ✅ Convert back to Excel format
      const newSheet = XLSX.utils.json_to_sheet(newData);
      workbook.Sheets["Stores"] = newSheet;

      // ✅ Save updated Excel file
      XLSX.writeFile(workbook, filePath);

      console.log(`✅ Store with ID ${ID} deleted successfully`);
      return res.status(200).json({ message: `Store with ID ${ID} deleted successfully` });
    }

    // ✅ Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
