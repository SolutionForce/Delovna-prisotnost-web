import { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import UserFormDialog from "./UserFormDialog";
import {
  deleteUserAttendance,
  fetchData,
  getOrganizations,
} from "../../modules/constants/fetchData.ts";
import { User, Attendance, Role } from "../../modules/interfaces/user.ts";
import { auth, firestore } from "../../firebase.ts";
import { OrganizationWithId } from "../../modules/interfaces/organization";
import { BACKEND_BASE_URL } from "../../modules/constants/api.ts";
import { ExportPDFButton } from "./ExportPDFButton.tsx";

export default function UserF({ reload }: any) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationWithId[]>([]);

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

  useEffect(() => {
    const fetchOrgIds = async () => {
      try {
        const orgs = await getOrganizations();
        // console.log("Fetched Organizations: ", orgs);
        setOrganizations(orgs);
      } catch (error) {
        console.error("Error fetching organizations: ", error);
      }
    };

    fetchOrgIds();
  }, []);

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
    // console.log(attendance);
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
      if (!user) {
        console.error("User for deletion is not specified");
        return;
      }

      if (!auth.currentUser) {
        console.error("User must be logged in");
        return;
      }

      const idToken = await auth.currentUser.getIdToken(true);
      const headers = {
        auth: idToken,
      };

      const response = await fetch(BACKEND_BASE_URL + "users/" + user.uid, {
        method: "DELETE",
        headers: headers,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      reload();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleRemoveAttendance = async (index: number) => {
    try {
      if (user) {
        await deleteUserAttendance(user.uid, index);
        const updatedAttendance = user.attendance.filter((_, i) => i !== index);
        setUser({ ...user, attendance: updatedAttendance });
      }
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      await setDoc(doc(firestore, "users", updatedUser.uid), updatedUser, {
        merge: true,
      });
      setUser(updatedUser);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user: ", error);
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
          className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
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
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Edit User
        </button>
        <ExportPDFButton user={user} />
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
                  className="text-purple-600 hover:text-purple-900 mr-4"
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
                  className="mb-2 pl-4 border-l-2 border-purple-500"
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

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            More about user
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            {/* <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">UID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.uid}
              </dd>
            </div> */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Surname</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.surname}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(user.createdAt.seconds * 1000).toLocaleString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Organization
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  organizations.find((org) => org.id === user.organizationId)
                    ?.name
                }{" "}
                ({user.organizationId})
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.role}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.hourlyRate}
              </dd>
            </div>
          </dl>
        </div>
      </div>

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
                          Are you sure you want to delete user{" "}
                          <b>
                            {user.name} {user.surname}
                          </b>
                          ? This action cannot be undone.
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
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-1 sm:mt-0 sm:text-sm"
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

      <Transition.Root show={isEditDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setIsEditDialogOpen}
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
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                      <PencilIcon
                        className="h-6 w-6 text-yellow-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Edit User
                      </Dialog.Title>
                      <div className="mt-2">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const target = e.target as typeof e.target & {
                              name: { value: string };
                              surname: { value: string };
                              email: { value: string };
                              organizationId: { value: string };
                              role: { value: string };
                              hourlyRate: { value: string };
                            };
                            handleSaveUser({
                              ...user,
                              name: target.name.value,
                              surname: target.surname.value,
                              email: target.email.value,
                              organizationId: target.organizationId.value,
                              role: target.role.value as Role,
                              hourlyRate: parseFloat(target.hourlyRate.value),
                            });
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              defaultValue={user.name}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="surname"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Surname
                            </label>
                            <input
                              type="text"
                              name="surname"
                              id="surname"
                              defaultValue={user.surname}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              defaultValue={user.email}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="organizationId"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Organization
                            </label>
                            <select
                              name="organizationId"
                              id="organizationId"
                              defaultValue={user.organizationId}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            >
                              <option value="" disabled>
                                Select an organization
                              </option>
                              {organizations.map((org) => (
                                <option key={org.id} value={org.id}>
                                  {org.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="role"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Role
                            </label>
                            <select
                              name="role"
                              id="role"
                              defaultValue={user.role}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            >
                              <option value={Role.employee}>Employee</option>
                              <option value={Role.admin}>Admin</option>
                              <option value={Role.guest}>Guest</option>
                              <option value={Role.receptionist}>Receptionist</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="hourlyRate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Hourly Rate
                            </label>
                            <input
                              type="number"
                              name="hourlyRate"
                              id="hourlyRate"
                              step="0.1"
                              defaultValue={user.hourlyRate}
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                            />
                          </div>
                          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => setIsEditDialogOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
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
