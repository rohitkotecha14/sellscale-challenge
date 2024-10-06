import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getStockChart } from "../services/stock";
import { CircularProgress, Box, Typography } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StockChartProps {
  ticker: string;
  period?: string;
  interval?: string;
}

const StockChart: React.FC<StockChartProps> = ({ ticker, period = "1mo", interval = "1d" }) => {
  const [chartData, setChartData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getStockChart(ticker, period, interval);
        const chartLabels = data?.dates || [];
        const chartPrices = data?.prices || [];

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `${ticker} Stock Price`,
              data: chartPrices,
              borderColor: "rgba(52, 190, 16, 1)", // Green color for the line
              backgroundColor: "rgba(52, 190, 16, 0.2)", // Transparent green fill
              borderWidth: 2,
              tension: 0.3, // Add some curve to the line
            },
          ],
        });
      } catch (err) {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [ticker, period, interval]);

  return (
    <Box sx={{ marginTop: 3 }}>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : chartData ? (
        // Control the size of the chart with width and height
        <Box sx={{ width: '100%', margin: '0 auto' }}> {/* Max width set to 500px */}
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Disable aspect ratio to allow flexible sizing
              plugins: {
                legend: {
                  display: true,
                  position: "top" as const,
                  labels: { color: "#34be10" }, // Match the green theme
                },
                title: {
                  display: true,
                  text: `Stock Price Chart for ${ticker}`,
                  color: "#34be10", // Chart title color
                },
              },
              scales: {
                x: {
                  ticks: { color: "#34be10" }, // X-axis labels color
                },
                y: {
                  ticks: { color: "#34be10" }, // Y-axis labels color
                },
              },
            }}
            height={300} // Adjust height to be smaller
          />
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: "#34be10" }}>
          No chart data available for {ticker}.
        </Typography>
      )}
    </Box>
  );
};

export default StockChart;
