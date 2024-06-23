import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { firestore } from "../../firebase.ts";
import { PlusIcon } from "@heroicons/react/24/outline";
import UserFormDialog from "./UserFormDialog";
import { fetchData } from "../../modules/constants/fetchData.ts";
import { User, Attendance } from "../../modules/interfaces/user.ts";

export default function UserF({ reload }: any) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await fetchData(false);
        const fetchedUser = users.find((user) => user.uid === id);
        if (fetchedUser) {
          setUser(fetchedUser as User);
        } else {
          setError("User not found.");
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

  const handleEditAttendance = (attendance: Attendance, index: number) => {
    setCurrentAttendance(attendance);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleSaveAttendance = async (attendance: Attendance) => {
    try {
      if (user) {
        const updatedAttendance =
          editingIndex !== null
            ? user.attendance.map((a, index) =>
                index === editingIndex ? attendance : a
              )
            : [...user.attendance, attendance];
        const updatedUser = { ...user, attendance: updatedAttendance };
        await setDoc(doc(firestore, "users", user.uid), updatedUser, {
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
        await deleteDoc(doc(firestore, "users", user.uid));
        reload();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleRemoveAttendance = (index: number) => {
    console.log("REMOVING ATTENDANCE", id, index);
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
          onClick={() => setIsDeleteDialogOpen(true)}
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
              <div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  onClick={() => handleEditAttendance(record, index)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleRemoveAttendance(index)}
                >
                  Remove
                </button>
              </div>
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
                    {breakRecord.end
                      ? new Date(
                          breakRecord.end.seconds * 1000
                        ).toLocaleString()
                      : "N/A"}
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

      <Transition.Root show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setIsDeleteDialogOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <PlusIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete User
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete user {user.name}{" "}
                          {user.surname}? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        handleDeleteUser();
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
