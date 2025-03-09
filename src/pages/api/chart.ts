import path from "path";
import xlsx from "xlsx";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.join(process.cwd(), "public", "assets", "GSIV25 - Sample Data.xlsx");
    const workbook = xlsx.readFile(filePath);

    console.log("✅ Workbook Loaded");

    const sheetName = "Calculations";
    if (!workbook.Sheets[sheetName]) {
      console.error(`❌ Sheet '${sheetName}' not found in the Excel file`);
      return res.status(500).json({ error: `Sheet '${sheetName}' not found` });
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet);

    console.log("✅ Sheet Loaded:", rawData.length, "rows");

    // 🔹 Aggregate GM Dollars & Sales Dollars by Store & Week
    const aggregatedData: Record<string, Record<string, { gmDollars: number; salesDollars: number }>> = {};

    rawData.forEach((row: any) => {
      const { Store, Week, "GM Dollars": gmDollars, "Sales Dollars": salesDollars } = row;
      if (!Store || !Week) return;

      // Log one row to check format
      console.log(`📌 Processing - Store: ${Store}, Week: ${Week}, GM$: ${gmDollars}`);

      // Initialize Store entry if not present
      if (!aggregatedData[Store]) {
        aggregatedData[Store] = {};
      }
      if (!aggregatedData[Store][Week]) {
        aggregatedData[Store][Week] = { gmDollars: 0, salesDollars: 0 };
      }

      // Sum GM Dollars and Sales Dollars across all SKUs for this store
      aggregatedData[Store][Week].gmDollars += gmDollars || 0;
      aggregatedData[Store][Week].salesDollars += salesDollars || 0;
    });

    // 🔹 Convert Aggregated Data to Array Format for Chart
    const chartData = Object.entries(aggregatedData).map(([store, weeks]) => ({
      store,
      weeks: Object.entries(weeks).map(([week, values]: any) => ({
        week,
        gmDollars: values.gmDollars,
        gmPercent: values.salesDollars > 0 ? (values.gmDollars / values.salesDollars) * 100 : 0,
      })),
    }));

    console.log("📊 Final Chart Data:", JSON.stringify(chartData, null, 2));

    res.status(200).json(chartData);
  } catch (error) {
    console.error("❌ Error processing chart data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
