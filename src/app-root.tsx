import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "./utils";
import { Navigate, Route, Routes, useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Dashboard from "./pages/dashboard/dashboard";
import FormUser from "./components/FormUser";
import Calendar from "./pages/dashboard/calendar/Calendar";
import AttendanceSubmission from "./components/attendanceSubmission/attendanceSubmission";
import { User, Role } from "./modules/interfaces/user";
import UserF from "./pages/user/User";
import { fetchData } from "./modules/constants/fetchData";
import AttendanceQR from "./components/attendanceSubmission/attendanceQR/attendanceQR";

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon, current: true },
  { name: "Attendance", to: "/attendance", icon: ClockIcon, current: false },
];

export default function AppRoot() {
  const auth = getAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showEmployees, setShowEmployees] = useState(true);
  const [showAdmins, setShowAdmins] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showReceptionists, setShowReceptionists] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const handleSlideOver = () => {
    setSidebarOpen(false);
    setIsSlideOverOpen((prev) => !prev);
  };

  const handleReload = async () => {
    try {
      const fetchedUsers = await fetchData(false); // Assuming includeCalc is false
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        navigate("/sign-in");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          const fetchedUsers = await fetchData(false); // Assuming includeCalc is false
          setUsers(fetchedUsers);
          const currentUser = fetchedUsers.find((u) => u.uid === user.uid);
          setCurrentUserRole(currentUser?.role || null);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (!isAuthenticated) {
    return <div>Please log in to see the users.</div>;
  }

  const handleUserClick = (user: User) => {
    navigate(`/user/${user.uid}`);
  };

  const filterUsersByRole = (role: Role) => {
    return users.filter((user) => user.role === role);
  };
  console.log(users);
  return (
    <div>
      {currentUserRole === Role.admin ? (
        <>
          {/* Sidebar for small screens */}
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                      <div className="flex h-16 shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                          alt="Your Company"
                        />
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    to={item.to}
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-50 text-purple-600"
                                        : "text-gray-700 hover:text-purple-600 hover:bg-gray-50",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-purple-600"
                                          : "text-gray-400 group-hover:text-purple-600",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <button
                              onClick={() => setShowEmployees((prev) => !prev)}
                              className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              Employees
                              <span>
                                {showEmployees ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                    />
                                  </svg>
                                )}
                              </span>
                            </button>
                            {showEmployees && (
                              <ul role="list" className="-mx-2 space-y-1">
                                {filterUsersByRole(Role.employee).map(
                                  (user) => (
                                    <li key={user.uid}>
                                      <button
                                        onClick={() => handleUserClick(user)}
                                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                                      >
                                        {user.name} {user.surname}
                                      </button>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </li>
                          <li>
                            <button
                              onClick={() => setShowAdmins((prev) => !prev)}
                              className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              Admins
                              <span>
                                {showAdmins ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                    />
                                  </svg>
                                )}
                              </span>
                            </button>
                            {showAdmins && (
                              <ul role="list" className="-mx-2 space-y-1">
                                {filterUsersByRole(Role.admin).map((user) => (
                                  <li key={user.uid}>
                                    <button
                                      onClick={() => handleUserClick(user)}
                                      className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                                    >
                                      {user.name} {user.surname}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                          <li>
                            <button
                              onClick={() =>
                                setShowReceptionists((prev) => !prev)
                              }
                              className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              Receptionists
                              <span>
                                {showReceptionists ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                    />
                                  </svg>
                                )}
                              </span>
                            </button>
                            {showReceptionists && (
                              <ul role="list" className="-mx-2 space-y-1">
                                {filterUsersByRole(Role.receptionist).map(
                                  (user) => (
                                    <li key={user.uid}>
                                      <button
                                        onClick={() => handleUserClick(user)}
                                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                                      >
                                        {user.name} {user.surname}
                                      </button>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </li>
                          <li>
                            <button
                              onClick={() => setShowGuests((prev) => !prev)}
                              className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              Guests
                              <span>
                                {showGuests ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                    />
                                  </svg>
                                )}
                              </span>
                            </button>
                            {showGuests && (
                              <ul role="list" className="-mx-2 space-y-1">
                                {filterUsersByRole(Role.guest).map((user) => (
                                  <li key={user.uid}>
                                    <button
                                      onClick={() => handleUserClick(user)}
                                      className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                                    >
                                      {user.name} {user.surname}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                          <li className="-mx-6">
                            <button
                              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                              onClick={() => handleSlideOver()}
                            >
                              <PlusIcon
                                className="h-5 w-5 mr-2 -ml-1"
                                aria-hidden="true"
                              />
                              ADD USER
                            </button>
                          </li>
                          <li className="-mx-6 mt-auto">
                            <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                />
                              </svg>

                              <span aria-hidden="true">
                                {getAuth().currentUser?.displayName ||
                                  "User Name"}
                              </span>
                              <button
                                onClick={handleSignOut}
                                className="ml-4  px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Sign out
                              </button>
                            </div>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
                  alt="Your Company"
                />
              </div>

              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.to}
                            className={classNames(
                              item.current
                                ? "bg-gray-50 text-purple-600"
                                : "text-gray-700 hover:text-purple-600 hover:bg-gray-50",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-purple-600"
                                  : "text-gray-400 group-hover:text-purple-600",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowEmployees((prev) => !prev)}
                      className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    >
                      Employees
                      <span>
                        {showEmployees ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                    {showEmployees && (
                      <ul role="list" className="-mx-2 space-y-1">
                        {filterUsersByRole(Role.employee).map((user) => (
                          <li key={user.uid}>
                            <button
                              onClick={() => handleUserClick(user)}
                              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              {user.name} {user.surname}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <button
                      onClick={() => setShowAdmins((prev) => !prev)}
                      className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    >
                      Admins
                      <span>
                        {showAdmins ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                    {showAdmins && (
                      <ul role="list" className="-mx-2 space-y-1">
                        {filterUsersByRole(Role.admin).map((user) => (
                          <li key={user.uid}>
                            <button
                              onClick={() => handleUserClick(user)}
                              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              {user.name} {user.surname}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <button
                      onClick={() => setShowReceptionists((prev) => !prev)}
                      className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    >
                      Receptionists
                      <span>
                        {showReceptionists ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                    {showReceptionists && (
                      <ul role="list" className="-mx-2 space-y-1">
                        {filterUsersByRole(Role.receptionist).map((user) => (
                          <li key={user.uid}>
                            <button
                              onClick={() => handleUserClick(user)}
                              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              {user.name} {user.surname}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <button
                      onClick={() => setShowGuests((prev) => !prev)}
                      className="group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    >
                      Guests
                      <span>
                        {showGuests ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        )}
                      </span>
                    </button>
                    {showGuests && (
                      <ul role="list" className="-mx-2 space-y-1">
                        {filterUsersByRole(Role.guest).map((user) => (
                          <li key={user.uid}>
                            <button
                              onClick={() => handleUserClick(user)}
                              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                            >
                              {user.name} {user.surname}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li className="-mx-6">
                    <button
                      className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      onClick={() => handleSlideOver()}
                    >
                      <PlusIcon
                        className="h-5 w-5 mr-2 -ml-1"
                        aria-hidden="true"
                      />
                      ADD USER
                    </button>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">
                        {getAuth().currentUser?.displayName || "User Name"}
                      </span>
                      <button
                        onClick={handleSignOut}
                        className=" inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Sign out
                      </button>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Top menu for smaller screens */}
          <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
              Dashboard
            </div>
          </div>

          <main className="py-10 lg:pl-72">
            <div className="px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route
                  path="/user/:id"
                  element={<UserF reload={handleReload} />}
                />
                <Route path="/attendance" element={<AttendanceSubmission />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </main>

          <Transition show={isSlideOverOpen} as={Fragment}>
            <Dialog className="relative z-10" onClose={setIsSlideOverOpen}>
              <div className="fixed inset-0" />

              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-500 sm:duration-700"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transform transition ease-in-out duration-500 sm:duration-700"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="pointer-events-auto w-screen sm:max-w-2xl">
                        <FormUser
                          setOpen={setIsSlideOverOpen}
                          reload={handleReload}
                        />
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      ) : currentUserRole === Role.receptionist ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center w-full h-full overflow-auto">
            <div className="flex-shrink-0">
              <button
                className="my-4 px-12 py-2 bg-red-500 text-white rounded-md"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
            <div className="mb-40 flex-shrink-0">
              <AttendanceQR />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
