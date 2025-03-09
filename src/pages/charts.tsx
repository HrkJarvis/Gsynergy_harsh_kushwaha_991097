import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define types for week data
interface WeekData {
  week: string;
  gmDollars: number;
  gmPercent: number;
}

// Define type for store data
interface StoreData {
  store: string;
  weeks: WeekData[];
}

const ChartPage = () => {
  const [chartData, setChartData] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/chart")
      .then((res) => res.json())
      .then((data: StoreData[]) => setChartData(data))
      .catch((error) => console.error("Error fetching chart data:", error));
  }, []);

  const storeOptions = chartData.map((store) => store.store);

  const selectedStoreData = chartData.find((d) => d.store === selectedStore);
  const weeks = selectedStoreData ? selectedStoreData.weeks.map((w) => w.week) : [];
  const gmDollars = selectedStoreData ? selectedStoreData.weeks.map((w) => w.gmDollars) : [];
  const gmPercent = selectedStoreData ? selectedStoreData.weeks.map((w) => w.gmPercent) : [];

  // Chart Data
  const data = {
    labels: weeks,
    datasets: [
      {
        label: "GM Dollars ($)",
        data: gmDollars,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        yAxisID: "y1",
      },
      {
        label: "GM %",
        data: gmPercent,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        yAxisID: "y2",
      },
    ],
  };

  // Corrected Chart.js options with proper TypeScript types
  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "GM Dollars ($)",
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "GM %",
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">GM Dollars & GM % Chart</h2>

      {/* Store Selection Dropdown */}
      <select
        className="border p-2 mb-4"
        onChange={(e) => setSelectedStore(e.target.value)}
        value={selectedStore || ""}
      >
        <option value="" disabled>
          Select a Store
        </option>
        {storeOptions.map((store) => (
          <option key={store} value={store}>
            {store}
          </option>
        ))}
      </select>

      {/* Render Chart Only If a Store is Selected */}
      {selectedStore && (
        <div className="bg-white p-4 shadow-md rounded">
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default ChartPage;
