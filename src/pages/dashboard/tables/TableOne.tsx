import React, { useState } from "react";
import { User } from "../../../modules/interfaces/user";
import { UserWithCalculations } from "../../../modules/interfaces/customUser";

interface TableOneProps {
  selectedUsers: UserWithCalculations[];
}

const TableOne: React.FC<TableOneProps> = ({ selectedUsers }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  }>({
    key: "totalWorkTime",
    direction: "descending",
  });

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...selectedUsers];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        const aValue =
          sortConfig.key === "name"
            ? `${a.name} ${a.surname}`
            : sortConfig.key === "totalWorkTime"
            ? a.calc?.totalTimeWorked || 0
            : sortConfig.key === "totalBreakTime"
            ? a.calc?.totalBreakTime || 0
            : sortConfig.key === "averageDailyWorkHours"
            ? a.calc?.averageDailyWorkHours || 0
            : sortConfig.key === "averageBreakTime"
            ? a.calc?.averageBreakTime || 0
            : a.hourlyRate || 0;

        const bValue =
          sortConfig.key === "name"
            ? `${b.name} ${b.surname}`
            : sortConfig.key === "totalWorkTime"
            ? b.calc?.totalTimeWorked || 0
            : sortConfig.key === "totalBreakTime"
            ? b.calc?.totalBreakTime || 0
            : sortConfig.key === "averageDailyWorkHours"
            ? b.calc?.averageDailyWorkHours || 0
            : sortConfig.key === "averageBreakTime"
            ? b.calc?.averageBreakTime || 0
            : b.hourlyRate || 0;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === "ascending"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      });
    }
    return sortableUsers;
  }, [selectedUsers, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="inline w-4 h-4 ml-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="inline w-4 h-4 ml-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black">Top Employees</h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 sm:grid-cols-7">
          <div className="p-2.5 xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("employee")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Employee
            </button>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("name")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Name {getSortIcon("name")}
            </button>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("totalWorkTime")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Total Work Time {getSortIcon("totalWorkTime")}
            </button>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("totalBreakTime")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Total Break Time {getSortIcon("totalBreakTime")}
            </button>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("averageDailyWorkHours")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Average Daily Work Hours {getSortIcon("averageDailyWorkHours")}
            </button>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("averageBreakTime")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Average Break Time {getSortIcon("averageBreakTime")}
            </button>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <button
              type="button"
              onClick={() => requestSort("hourlyRate")}
              className="text-sm font-medium uppercase xsm:text-base"
            >
              Hourly Rate {getSortIcon("hourlyRate")}
            </button>
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
