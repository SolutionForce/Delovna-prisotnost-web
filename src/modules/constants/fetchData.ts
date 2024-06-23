import { Attendance, Role, User } from "../../modules/interfaces/user";
import { Timestamp } from 'firebase/firestore';

const calculateDifferenceInMinutes = (start: Timestamp, end: Timestamp | null) => {
  if (!end) return 0;
  const startDate = start.toDate();
  const endDate = end.toDate();
  return (endDate.getTime() - startDate.getTime()) / 60000; // Convert milliseconds to minutes
};

const calculateMetrics = (attendance: Attendance[]) => {
  let totalWorkMinutes = 0;
  let totalBreakMinutes = 0;
  let lateArrivals = 0;
  let overtimeMinutes = 0;
  let workDays = attendance.length;

  attendance.forEach((day) => {
    if (day.timeOut) {
      const workMinutes = calculateDifferenceInMinutes(day.timeIn, day.timeOut);
      totalWorkMinutes += workMinutes;

      const breaksMinutes = day.breaks.reduce((acc, br) => acc + calculateDifferenceInMinutes(br.start, br.end), 0);
      totalBreakMinutes += breaksMinutes;

      // Assuming work starts at 9 AM (09:00)
      const startOfDay = day.timeIn.toDate();
      if (startOfDay.getHours() > 9 || (startOfDay.getHours() === 9 && startOfDay.getMinutes() > 0)) {
        lateArrivals += 1;
      }

      // Assuming overtime is calculated for hours worked beyond 8 hours a day
      if (workMinutes - breaksMinutes > 8 * 60) {
        overtimeMinutes += (workMinutes - breaksMinutes - 8 * 60);
      }
    }
  });

  const averageDailyWorkHours = totalWorkMinutes / workDays / 60;
  const averageBreakTime = totalBreakMinutes / workDays / 60;
  const hoursWorkedPerWeek = totalWorkMinutes / 60 / (workDays / 5);
  const hoursWorkedPerMonth = totalWorkMinutes / 60 / (workDays / 20);

  return {
    totalTimeWorked: totalWorkMinutes / 60,
    totalBreakTime: totalBreakMinutes / 60,
    averageDailyWorkHours,
    averageBreakTime,
    lateArrivals,
    overtimeHours: overtimeMinutes / 60,
    hoursWorkedPerWeek,
    hoursWorkedPerMonth,
  };
};

export const fetchData = async (): Promise<User[]> => {
  try {
    const response = await fetch(
      "http://127.0.0.1:5001/rvir-1e34e/us-central1/api/users"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    console.log("RESPONSE OF FUNCTION");
    console.log(responseData);

    // Assuming the response data is in the correct format
    const users: User[] = responseData.map((item: any) => {
      const attendance: Attendance[] = item.attendance.map((att: any) => ({
        timeIn: new Timestamp(att.timeIn._seconds, att.timeIn._nanoseconds),
        timeOut: att.timeOut ? new Timestamp(att.timeOut._seconds, att.timeOut._nanoseconds) : null,
        breaks: att.breaks.map((br: any) => ({
          start: new Timestamp(br.start._seconds, br.start._nanoseconds),
          end: br.end ? new Timestamp(br.end._seconds, br.end._nanoseconds) : null,
          description: br.description,
        })),
      }));

      const calc = calculateMetrics(attendance);
      console.log(calc)

      return {
        uid: item.uid,
        name: item.name,
        surname: item.surname,
        email: item.email,
        createdAt: new Timestamp(item.createdAt._seconds, item.createdAt._nanoseconds),
        organizationId: item.organizationId,
        role: item.role as Role,
        attendance,
        hourlyRate: item.hourlyRate,
        calc,
      };
    });

    return users;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};
