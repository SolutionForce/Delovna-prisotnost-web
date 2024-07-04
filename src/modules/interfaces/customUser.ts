import { Timestamp } from "firebase/firestore";
import {Attendance, Role, User} from "./user"


  export interface ICalculations {
    totalTimeWorked: number;
    totalBreakTime: number;
    averageDailyWorkHours: number;
    averageBreakTime: number;
    lateArrivals: number;
    overtimeHours: number;
    hoursWorkedPerWeek: number;
    hoursWorkedPerMonth: number;
  }
  
  export interface UserWithCalculations extends User {
    uid: string;
    name: string;
    surname: string;
    email: string;
    createdAt: Timestamp;
    organizationId: string;
    role: Role;
    attendance: Attendance[];
    hourlyRate: number;
    calc?: ICalculations;
  }

  
  export interface UserForRegistration {
 
    name: string;
    surname: string;
    email: string;
    organizationId?: string;
    role: Role;
    attendance: Attendance[];
    hourlyRate?: number;
    password: string;
  }
