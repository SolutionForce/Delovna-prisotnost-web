import React from "react";
import { Bar } from "react-chartjs-2";
import { User } from "../../../modules/interfaces/user";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartTotalEarningsProps {
  selectedUsers: User[];
}

const ChartTotalEarnings: React.FC<ChartTotalEarningsProps> = ({
  selectedUsers,
}) => {
  const data = {
    labels: selectedUsers.map((user) => `${user.name} ${user.surname}`),
    datasets: [
      {
        label: "Total Earnings (€)",
        data: selectedUsers.map(
          (user) => (user.calc?.totalTimeWorked || 0) * user.hourlyRate
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw.toFixed(2)} € `;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-center text-lg font-semibold mb-4">
        Total Earnings per Employee
      </h2>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartTotalEarnings;
