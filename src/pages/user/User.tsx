import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { firestore } from "../../firebase.ts";
import { PlusIcon } from "@heroicons/react/24/outline";
import UserFormDialog from "./UserFormDialog";

interface IAttendanceBreak {
  description: string;
  start: any;
  end: any;
}

interface IAttendance {
  breaks: IAttendanceBreak[];
  timeIn: any;
  timeOut: any;
}

interface IUser {
  id: string;
  name: string;
  surname: string;
  attendance: IAttendance[];
}

export default function User() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] =
    useState<IAttendance | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const userDoc = await getDoc(doc(firestore, "users", id));
          if (userDoc.exists()) {
            const userData = userDoc.data() as IUser;
            // Ensure attendance is initialized properly
            if (!userData.attendance) {
              userData.attendance = [];
            }
            setUser({ ...userData, id: userDoc.id });
          } else {
            setError("User not found.");
          }
        }
      } catch (error) {
        setError("There was an error loading the user data.");
      }
    };

    fetchUser();
  }, [id]);

  const handleAddAttendance = () => {
    setCurrentAttendance(null);
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditAttendance = (attendance: IAttendance, index: number) => {
    setCurrentAttendance(attendance);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleSaveAttendance = async (attendance: IAttendance) => {
    try {
      if (user) {
        const updatedAttendance =
          editingIndex !== null
            ? user.attendance.map((a, index) =>
                index === editingIndex ? attendance : a
              )
            : [...user.attendance, attendance];
        const updatedUser = { ...user, attendance: updatedAttendance };
        await setDoc(doc(firestore, "users", user.id), updatedUser, {
          merge: true,
        });
        setUser(updatedUser);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving attendance: ", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (user) {
        await deleteDoc(doc(firestore, "users", user.id));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {user.name} {user.surname}
      </h1>
      <h2 className="text-2xl font-semibold mb-6">Attendance Records</h2>
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          onClick={handleAddAttendance}
        >
          <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Add Attendance
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
          onClick={handleDeleteUser}
        >
          Delete User
        </button>
      </div>
      {user.attendance.length > 0 ? (
        user.attendance.map((record, index) => (
          <div
            key={index}
            className="mb-8 p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-xl font-semibold mb-4 flex justify-between">
              Attendance Record {index + 1}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-900"
                onClick={() => handleEditAttendance(record, index)}
              >
                Edit
              </button>
            </h3>
            <div className="mb-4">
              <p>
                <span className="font-bold">Time In:</span>{" "}
                {new Date(record.timeIn.seconds * 1000).toLocaleString()}
              </p>
              <p>
                <span className="font-bold">Time Out:</span>{" "}
                {record.timeOut
                  ? new Date(record.timeOut.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <h4 className="text-lg font-semibold mb-2">Breaks</h4>
            {record.breaks.length > 0 ? (
              record.breaks.map((breakRecord, idx) => (
                <div
                  key={idx}
                  className="mb-2 pl-4 border-l-2 border-indigo-500"
                >
                  <p>
                    <span className="font-bold">Description:</span>{" "}
                    {breakRecord.description}
                  </p>
                  <p>
                    <span className="font-bold">Start:</span>{" "}
                    {new Date(
                      breakRecord.start.seconds * 1000
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">End:</span>{" "}
                    {new Date(breakRecord.end.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No breaks recorded.</p>
            )}
          </div>
        ))
      ) : (
        <p>No attendance records found.</p>
      )}
      <UserFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        initialData={currentAttendance}
        onSave={handleSaveAttendance}
      />
    </div>
  );
}
