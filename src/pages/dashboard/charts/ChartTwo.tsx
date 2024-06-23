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
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Break Time (hours)",
        data: selectedUsers.map((user) => user.calc?.totalBreakTime || 0),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
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
