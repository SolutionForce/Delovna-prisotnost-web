import { useEffect, useState } from "react";

// Define types for the data structure
type Worker = {
  name: string;
  work: string;
};

type Shift = {
  day: number;
  month: number;
  year: number;
  MorningShift: Worker[];
  AfternoonShift: Worker[];
};

// Simulate fetching data
const fetchData = async (): Promise<Shift[]> => {
  try {
    const response = await fetch(
      "http://127.0.0.1:5001/rvir-1e34e/us-central1/api/timetables"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();

    // Extract and parse the 'attendance' field
    const attendanceData: Shift[] = responseData
      .map((item: any) => {
        return JSON.parse(item.attendance);
      })
      .flat();

    return attendanceData;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

const daysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

const generateCalendar = (month: number, year: number): number[] => {
  const days = daysInMonth(month, year);
  const calendar = Array.from({ length: days }, (_, i) => i + 1);

  // If less than 5 weeks (35 days), add days from the next month
  while (calendar.length < 35) {
    calendar.push(calendar.length + 1 - days);
  }

  return calendar;
};

const Calendar = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [calendar, setCalendar] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const today = new Date();

  useEffect(() => {
    const getShifts = async () => {
      const data = await fetchData();
      setShifts(data);
      setCalendar(generateCalendar(currentMonth, currentYear));
    };
    getShifts();
  }, [currentMonth, currentYear]);

  const weeks = [];
  for (let i = 0; i < calendar.length; i += 7) {
    weeks.push(calendar.slice(i, i + 7));
  }

  const getShiftsForDay = (day: number) => {
    return shifts.filter(
      (shift) =>
        shift.day === day &&
        shift.month === currentMonth &&
        shift.year === currentYear
    );
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  return (
    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default relative">
      <div className="flex justify-between items-center p-4 bg-purple-600 text-white">
        <button onClick={handlePreviousMonth}>Previous</button>
        <h2 className="text-lg font-bold">
          {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-7 rounded-t-sm bg-purple-600 text-black">
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Sunday</span>
              <span className="block lg:hidden">Sun</span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Monday</span>
              <span className="block lg:hidden">Mon</span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Tuesday</span>
              <span className="block lg:hidden">Tue</span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Wednesday</span>
              <span className="block lg:hidden">Wed</span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Thursday</span>
              <span className="block lg:hidden">Thur</span>
            </th>
            <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Friday</span>
              <span className="block lg:hidden">Fri</span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block">Saturday</span>
              <span className="block lg:hidden">Sat</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedDay !== null && (
            <div className="w-full p-4 bg-white shadow-md z-50 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Shifts for {selectedDay}.{currentMonth}.{currentYear}
                </h2>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-black"
                >
                  Close
                </button>
              </div>
              <div className="flex">
                <div className="w-1/2">
                  <h3 className="text-lg font-semibold">Morning Shift</h3>
                  {getShiftsForDay(selectedDay).map((shift, i) => (
                    <div key={i} className="mb-4">
                      {shift.MorningShift.map((worker, j) => (
                        <div key={j} className="ml-4">
                          <span className="font-medium text-black">
                            {worker.name}
                          </span>
                          <span className="text-black"> ({worker.work})</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="w-1/2">
                  <h3 className="text-lg font-semibold">Afternoon Shift</h3>
                  {getShiftsForDay(selectedDay).map((shift, i) => (
                    <div key={i} className="mb-4">
                      {shift.AfternoonShift.map((worker, j) => (
                        <div key={j} className="ml-4">
                          <span className="font-medium text-black">
                            {worker.name}
                          </span>
                          <span className="text-black"> ({worker.work})</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="grid grid-cols-7">
              {week.map((day, dayIndex) => {
                const isToday =
                  today.getDate() === day &&
                  today.getMonth() + 1 === currentMonth &&
                  today.getFullYear() === currentYear;
                return (
                  <td
                    key={dayIndex}
                    className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-purple-300 md:h-25 md:p-6 xl:h-31 ${
                      isToday ? "bg-purple-200" : ""
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <span className="font-medium text-black">{day}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;