import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function PlanningScreen() {
  const [rowData, setRowData] = useState([]);
  const [skuDetails, setSkuDetails] = useState<Record<string, { Price: number; Cost: number }>>({});

  // ✅ Fetch Data from API
  useEffect(() => {
    fetch("/api/getPlanningData")
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Store SKU Prices & Costs
        const skuMap: Record<string, { Price: number; Cost: number }> = {};
        data.forEach((row: any) => {
          if (!skuMap[row.SKU]) {
            skuMap[row.SKU] = { Price: row.Price || 0, Cost: row.Cost || 0 };
          }
          
          // 🔹 Calculate GM % before setting rowData
          const gmDollars = row["GM Dollars"] ?? 0;
          const salesDollars = row["Sales Dollars"] ?? 0;
          row["GM %"] = salesDollars !== 0 ? (gmDollars / salesDollars) * 100 : 0;
        });
  
        setSkuDetails(skuMap);
        setRowData(data);
      })
      .catch((err) => console.error("Error fetching planning data:", err));
  }, []);
  
  const columnDefs = [
    { field: "Store", headerName: "Store" },
    { field: "SKU", headerName: "SKU" },
    { field: "Week", headerName: "Week" },
    { field: "Sales Units", headerName: "Sales Units", editable: true },

    {
      headerName: "Sales Dollars ($)",
      field: "Sales Dollars",
      valueFormatter: (params: { value: number }) => `$${params.value?.toFixed(2) ?? "0.00"}`,
    },

    {
      headerName: "GM Dollars ($)",
      field: "GM Dollars",
      valueFormatter: (params: { value: number }) => `$${params.value?.toFixed(2) ?? "0.00"}`,
    },

    {
        headerName: "GM %",
        field: "GM %",
        valueFormatter: (params) => `${params.value ?? "0.00"}%`,
        cellStyle: (params) => {
          const gmPercent = params.value ?? 0; // Ensure no undefined/null values
    
          if (gmPercent >= 0.84) {
            return { backgroundColor: "#008000", color: "white", fontWeight: "bold" }; // Dark Green
          }
          if (gmPercent >= 0.40) {
            return { backgroundColor: "#32CD32", color: "black", fontWeight: "bold" }; // Lime Green
          }
          if (gmPercent >= 0.20) {
            return { backgroundColor: "#FFD700", color: "black" }; // Gold
          }
          if (gmPercent >= 0.10) {
            return { backgroundColor: "#FFA500", color: "black" }; // Orange
          }
          return { backgroundColor: "#FF0000", color: "white", fontWeight: "bold" }; // Red for Low GM%
        },
      },

      
      
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-6xl border border-white/20">
       
        <div className="ag-theme-alpine rounded-lg border border-white/20 overflow-hidden" style={{ height: 600, width: "100%" }}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs} />
        </div>
      </div>
    </div>
  );
}
