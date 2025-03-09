import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Box, Typography } from "@mui/material";
import { ColDef, ICellRendererParams } from "ag-grid-community";

// ✅ Register AG Grid module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface SKU {
  id: string;
  label: string;
  class: string;
  department: string;
  price: number;
  cost: number;
}

const SKUTable: React.FC = () => {
  const [rowData, setRowData] = useState<SKU[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/skus");
        if (!response.ok) throw new Error("Failed to fetch SKU data");

        const data = await response.json();

        // ✅ Map API response correctly
        const formattedData: SKU[] = data.map((item: any) => ({
          id: item.ID,
          label: item.Label,
          class: item.Class,
          department: item.Department,
          price: item.Price,
          cost: item.Cost,
        }));

        setRowData(formattedData);
      } catch (error) {
        setError("Error fetching SKU data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (skuId: string) => {
    try {
      const response = await fetch("/api/skus", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: skuId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete SKU");
      }

      alert("SKU deleted successfully!");

      // ✅ Refresh the list after deletion
      setRowData((prevData) => prevData.filter((sku) => sku.id !== skuId));
    } catch (error) {
      console.error("Error deleting SKU:", error);
      alert("Error deleting SKU");
    }
  };

  // ✅ Define column styles and flexible widths
  const columnDefs: ColDef<SKU>[] = [
    { field: "id", headerName: "SKU ID", flex: 1 },
    { field: "label", headerName: "Label", flex: 2 },
    { field: "class", headerName: "Class", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "price", headerName: "Price ($)", flex: 1 },
    { field: "cost", headerName: "Cost ($)", flex: 1 },
    {
      headerName: "Actions",
      width: 120,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: ICellRendererParams<SKU | undefined>) => {
        if (!params.data) return null; // ✅ Ensure params.data exists

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <button
              onClick={() => handleDelete(params.data!.id)} // ✅ Ensured data exists
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Box sx={{ paddingX: 3, paddingTop: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        SKU Table
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Box className="ag-theme-alpine" sx={{ height: "500px", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowHeight={50} // ✅ Increased row height for better spacing
          animateRows={true}
        />
      </Box>
    </Box>
  );
};

export default SKUTable;
