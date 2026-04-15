import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import API from "../services/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StockChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/dashboard/history");

      const data = res.data;

      let stockIn = 0;
      let stockOut = 0;

      data.forEach((item) => {
        if (item.type === "IN") stockIn += item.quantity;
        if (item.type === "OUT") stockOut += item.quantity;
      });

      setChartData({
        labels: ["Stock In", "Stock Out"],
        datasets: [
          {
            label: "Inventory Movement",
            data: [stockIn, stockOut],
            backgroundColor: ["#16a34a", "#dc2626"]
          }
        ]
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Stock Movement Chart</h3>
      {chartData.datasets && <Bar data={chartData} />}
    </div>
  );
};

export default StockChart;