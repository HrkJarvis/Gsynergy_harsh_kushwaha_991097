import { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const originalFilePath = path.join(process.cwd(), "public", "assets", "GSIV25 - Sample Data.xlsx");
// Temporary writable file path
const filePath = "/tmp/GSIV25 - Sample Data.xlsx";

// Ensure the file is copied to /tmp/ before use
if (!fs.existsSync(filePath)) {
  fs.copyFileSync(originalFilePath, filePath);
  console.log("File copied to writable location:", filePath);
}

// Helper function to read SKU data
const readSKUData = () => {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });

  const sheetName = "SKUs";
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) throw new Error("SKU Sheet not found");

  return XLSX.utils.sheet_to_json(sheet);
};

// Helper function to write SKU data
const writeSKUData = (data: any[]) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = "SKUs";
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Update the workbook with new data
  workbook.Sheets[sheetName] = worksheet;
  XLSX.writeFile(workbook, filePath);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // 📌 Fetch all SKUs
      const skus = readSKUData();
      return res.status(200).json(skus);
    }

    if (req.method === "POST") {
      // 📌 Add a new SKU
      const { ID, Label, Class, Department, Price, Cost } = req.body;

      if (!ID || !Label || !Class || !Department || !Price || !Cost) {
        return res.status(400).json({ error: "Missing SKU fields" });
      }

      const skus = readSKUData();
      skus.push({ ID, Label, Class, Department, Price, Cost });

      writeSKUData(skus);
      return res.status(201).json({ message: "SKU added successfully", skus });
    }

    if (req.method === "PUT") {
        const { ID, Label, Class, Department, Price, Cost } = req.body;
      
        if (!ID) return res.status(400).json({ error: "SKU ID is required for updating" });
      
        let skus = readSKUData();
        const index = skus.findIndex((sku: any) => sku.ID === ID);
      
        if (index === -1) {
          return res.status(404).json({ error: "SKU not found" });
        }
      
        // ✅ Update SKU Details
        skus[index] = { ID, Label, Class, Department, Price, Cost };
        writeSKUData(skus);
      
        return res.status(200).json({ message: "SKU updated successfully", skus });
      }
      
      // ✅ GET Request for Fetching SKU by ID
      if (req.method === "GET") {
        const { skuId } = req.query;
        const skus = readSKUData();
        const sku = skus.find((sku: any) => sku.ID === skuId);
      
        if (!sku) return res.status(404).json({ error: "SKU not found" });
      
        return res.status(200).json(sku);
      }
      
    if (req.method === "DELETE") {
      // 📌 Delete an SKU by ID
      const { ID } = req.body;

      if (!ID) {
        return res.status(400).json({ error: "SKU ID is required for deletion" });
      }

      let skus = readSKUData();
      const filteredSKUs = skus.filter((sku: any) => sku.ID !== ID);

      if (skus.length === filteredSKUs.length) {
        return res.status(404).json({ error: "SKU not found" });
      }

      writeSKUData(filteredSKUs);
      return res.status(200).json({ message: "SKU deleted successfully", skus: filteredSKUs });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling SKU API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
