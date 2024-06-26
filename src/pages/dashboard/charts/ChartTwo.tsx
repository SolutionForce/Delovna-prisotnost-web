import React from "react";
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
  TooltipItem,
} from "chart.js";
import { UserWithCalculations } from "../../../modules/interfaces/customUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartTwoProps {
  selectedUsers: UserWithCalculations[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ selectedUsers }) => {
  const data = {
    labels: selectedUsers.map((user) => user.name),
    datasets: [
      {
        label: "Total Work Time (hours)",
        data: selectedUsers.map((user) => user.calc?.totalTimeWorked || 0),
        backgroundColor: "rgba(168, 85, 247, 0.6)", // Tailwind purple-400
        borderColor: "rgba(168, 85, 247, 1)", // Tailwind purple-400
        borderWidth: 1,
      },
      {
        label: "Total Break Time (hours)",
        data: selectedUsers.map((user) => user.calc?.totalBreakTime || 0),
        backgroundColor: "rgba(74, 222, 128, 1)", // Tailwind green-400
        borderColor: "rgba(74, 222, 128, 1)", // Tailwind green-400
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
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            return `${context.dataset.label}: ${context.raw as number} hours`;
          },
        },
      },
    },
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default relative z-0">
      <h2 className="text-center text-lg font-medium mb-4">
        Total Work Time vs Total Break Time
      </h2>
      <div className="w-full h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartTwo;
