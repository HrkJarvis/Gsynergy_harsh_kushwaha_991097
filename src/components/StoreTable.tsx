import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// ✅ Register AG Grid module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface Store {
  id: string;
  label: string;
  city: string;
  state: string;
}

const StoreTable: React.FC = () => {
  const [rowData, setRowData] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) throw new Error("Failed to fetch store data");

        const data = await response.json();

        // ✅ Map API response correctly
        const formattedData = data.map((item: any) => ({
          id: item.ID,
          label: item.Label,
          city: item.City,
          state: item.State,
        }));

        setRowData(formattedData);
      } catch (error) {
        setError("Error fetching store data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Delete store from API & UI
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/stores?ID=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete store");
      }

      // ✅ Remove from UI state
      setRowData((prev) => prev.filter((store) => store.id !== id));
      console.log(`✅ Store with ID ${id} deleted successfully`);
      alert("SKU deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting store:", error);
      alert(`Failed to delete store: ${error.message}`);
    }
  };

  // ✅ Define column styles and flexible widths
  const columnDefs = [
    { field: "id", headerName: "Store ID", flex: 1 },
    { field: "label", headerName: "Store Name", flex: 2 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "state", headerName: "State", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <button
            onClick={() => handleDelete(params.data.id)}
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
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowHeight={50}
        animateRows={true}
      />
    </div>
  );
};

export default StoreTable;
