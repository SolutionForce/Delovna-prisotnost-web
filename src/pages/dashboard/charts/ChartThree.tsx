import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { UserWithCalculations } from "../../../modules/interfaces/customUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartAttendanceTrendsProps {
  selectedUsers: UserWithCalculations[];
}

const ChartAttendanceTrends: React.FC<ChartAttendanceTrendsProps> = ({
  selectedUsers,
}) => {
  const data = {
    labels: selectedUsers.map((user) => `${user.name} ${user.surname}`),
    datasets: [
      {
        label: "Late Arrivals",
        data: selectedUsers.map((user) => user.calc?.lateArrivals || 0),
        borderColor: "rgba(168, 85, 247, 1)", // Tailwind purple-300
        backgroundColor: "rgba(168, 85, 247, 0.6)", // Tailwind purple-300 with opacity
        borderWidth: 1,
      },
      {
        label: "Overtime Hours",
        data: selectedUsers.map((user) => user.calc?.overtimeHours || 0),
        borderColor: "rgba(74, 222, 128, 1)", // Tailwind green-400
        backgroundColor: "rgba(74, 222, 128, 0.2)", // Tailwind green-400 with opacity
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
            return `${context.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-center text-lg font-semibold mb-4">
        Attendance Trends per Employee
      </h2>
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartAttendanceTrends;
