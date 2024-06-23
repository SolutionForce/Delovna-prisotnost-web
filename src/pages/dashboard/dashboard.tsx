import React, { useState, useEffect } from "react";
import SelectMenu from "./comp/SelectMenu";
import CardDataStats from "./card/CardDataStats";
import ChartOne from "./charts/ChartOne";
import ChartThree from "./charts/ChartThree";
import ChartTwo from "./charts/ChartTwo";
import TableOne from "./tables/TableOne";

import { fetchData } from "../../modules/constants/fetchData";
import Calendar from "./calendar/Calendar";
import { UserWithCalculations } from "../../modules/interfaces/customUser";

const Dashboard: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<UserWithCalculations[]>(
    []
  );
  const [users, setUsers] = useState<UserWithCalculations[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchData(true);
      setUsers(data);
      console.log("Fetched users:", data);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    console.log("Selected users:", selectedUsers);
  }, [selectedUsers]);

  const totalTimeWorked = selectedUsers
    .reduce((acc, user) => acc + (user.calc?.totalTimeWorked || 0), 0)
    .toFixed(2);
  const totalBreakTime = selectedUsers
    .reduce((acc, user) => acc + (user.calc?.totalBreakTime || 0), 0)
    .toFixed(2);

  const totalMoneySpent = selectedUsers
    .reduce(
      (acc, user) =>
        acc + (user.calc?.totalTimeWorked || 0) * (user.hourlyRate || 0),
      0
    )
    .toFixed(2);
  const averageMoneySpentRaw = selectedUsers.length
    ? (parseFloat(totalMoneySpent) / selectedUsers.length).toFixed(2)
    : "0.00";
  const averageMoneySpent = isNaN(parseFloat(averageMoneySpentRaw))
    ? "Missing values"
    : averageMoneySpentRaw;

  return (
    <div className="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
      <div className="col-span-12 xl:col-span-12 my-4">
        <Calendar />
      </div>

      <SelectMenu
        items={users}
        multiSelect
        onSelectionChange={setSelectedUsers}
      />

      {selectedUsers.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardDataStats
              title="Total Time Worked"
              total={`${totalTimeWorked} hours`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Total Break Time"
              total={`${totalBreakTime} hours`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Total Money Spent"
              total={`${totalMoneySpent} €`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </CardDataStats>
            <CardDataStats
              title="Average Money Spent Per Person"
              total={`${averageMoneySpent} €`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </CardDataStats>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <ChartTwo selectedUsers={selectedUsers} />
          </div>

          <div className="col-span-12 xl:col-span-12">
            <ChartThree selectedUsers={selectedUsers} />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 xl:col-span-12">
              <TableOne selectedUsers={selectedUsers} />
            </div>
            <div className="col-span-12 xl:col-span-12">
              <ChartOne selectedUsers={selectedUsers} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
