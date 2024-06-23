import React from "react";
import { User } from "../../../modules/interfaces/user";

interface TableOneProps {
  selectedUsers: User[];
}

const TableOne: React.FC<TableOneProps> = ({ selectedUsers }) => {
  // Sort users based on totalTimeWorked and hourlyRate in descending order
  const sortedUsers = [...selectedUsers].sort((a, b) => {
    const totalTimeA = a.calc?.totalTimeWorked || 0;
    const totalTimeB = b.calc?.totalTimeWorked || 0;

    if (totalTimeB !== totalTimeA) {
      return totalTimeB - totalTimeA;
    } else {
      return (b.hourlyRate || 0) - (a.hourlyRate || 0);
    }
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black">Top Employees</h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 sm:grid-cols-7">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Employee
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total Work Time
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Total Break Time
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Average Daily Work Hours
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Average Break Time
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Hourly Rate
            </h5>
          </div>
        </div>

        {sortedUsers.map((user, key) => (
          <div
            className={`grid grid-cols-5 sm:grid-cols-7 ${
              key === sortedUsers.length - 1 ? "" : "border-b border-stroke"
            }`}
            key={user.uid}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black sm:block">
                {user.name} {user.surname}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">
                {(user.calc?.totalTimeWorked || 0).toFixed(2)} hours
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">
                {(user.calc?.totalBreakTime || 0).toFixed(2)} hours
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black">
                {(user.calc?.averageDailyWorkHours || 0).toFixed(2)} hours
              </p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">
                {(user.calc?.averageBreakTime || 0).toFixed(2)} hours
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black">
                {user.hourlyRate?.toFixed(2) || "N/A"} €
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOne;
