import { Attendance, Role, User } from "../../modules/interfaces/user";
import { Timestamp } from 'firebase/firestore';
import { getIdToken } from "./tokenId"; // Adjust the path as needed
import { UserForRegistration } from "../interfaces/customUser";

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

export const fetchData = async (includeCalc: boolean): Promise<User[]> => {

  const idToken = await getIdToken();
  if (!idToken) {
    throw new Error("Unable to retrieve ID token");
  }

  
  try {
    const response = await fetch("https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth": `${idToken}`
      },
     
    });
    ;
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
   // console.log("RESPONSE OF FUNCTION");
    //console.log(responseData);

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
      if (includeCalc) {
        const calc = calculateMetrics(attendance);
        //console.log(calc);
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
      }
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
      };
    });

    return users;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};



export const createEmployee = async (newUser: UserForRegistration) => {
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error("Unable to retrieve ID token");
    }
    console.log(newUser)

    const response = await fetch("https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth": `${idToken}`
      },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const createdUser = await response.json();
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (updatedUser: User): Promise<User> => {
  console.log(updatedUser)
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error("Unable to retrieve ID token");
    }

    const { uid, ...updatedData } = updatedUser;

    const response = await fetch(`https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/${uid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth": `${idToken}`
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const updatedUserResponse = await response.json();
    return updatedUserResponse;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error("Unable to retrieve ID token");
    }

    const response = await fetch(`https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/${uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth": `${idToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const deleteUserAttendance = async (uid: string, index: number): Promise<void> => {
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error("Unable to retrieve ID token");
    }

    const response = await fetch(`https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/${uid}/attendance/${index}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth": `${idToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete attendance");
    }
  } catch (error) {
    console.error("Error deleting attendance:", error);
    throw error;
  }
};




// naredi delete  dodaj token in 
//dodaj auth polek
// delete
// https://us-central1-rvir-1e34e.cloudfunctions.net/api/users/${uid}



export const getOrganizations = async (): Promise<any> => {
  try {
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error("Unable to retrieve ID token");
    }

    const response = await fetch("https://us-central1-rvir-1e34e.cloudfunctions.net/api/organizations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth": `${idToken}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch organizations");
    }

    const organizations = await response.json();
    
    organizations.forEach((organization: any) => {
      console.log("Organization:", organization);
    });

    return organizations;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};
