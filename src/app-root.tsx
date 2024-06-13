import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "./utils";
import { Navigate, Route, Routes, useNavigate, Link } from "react-router-dom";
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "./firebase";
import Dashboard from "./pages/dashboard/dashboard";
import FormUser from "./components/FormUser";
import User from "./pages/user/User";
import Calendar from "./pages/dashboard/calendar/Calendar";

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

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon, current: true },
];

export default function AppRoot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSlideOver = () => {
    setIsSlideOverOpen((prev) => !prev);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const q = query(collection(firestore, "users"));
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const usersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as IUser[];
          setUsers(usersList);
        });

        return () => unsubscribeSnapshot();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleUserClick = (user: IUser) => {
    navigate(`/user/${user.id}`);
  };

  if (!isAuthenticated) {
    return <div>Please log in to see the users.</div>;
  }

  return (
    <>
      {/* Sidebar for small screens */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
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
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
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
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    item.current
                                      ? "text-indigo-600"
                                      : "text-gray-400 group-hover:text-indigo-600",
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
                        <ul role="list" className="-mx-2 space-y-1">
                          {users.map((user) => (
                            <li key={user.id}>
                              <button
                                onClick={() => handleUserClick(user)}
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                              >
                                {user.name} {user.surname}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="-mx-6">
                        <button
                          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {
                            handleSlideOver();
                            setSidebarOpen(false);
                          }}
                        >
                          <PlusIcon
                            className="h-5 w-5 mr-2 -ml-1"
                            aria-hidden="true"
                          />
                          ADD USER
                        </button>
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
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
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
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
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
                <ul role="list" className="-mx-2 space-y-1">
                  {users.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => handleUserClick(user)}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      >
                        {user.name} {user.surname}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6">
                <button
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    handleSlideOver();
                    setSidebarOpen(false);
                  }}
                >
                  <PlusIcon className="h-5 w-5 mr-2 -ml-1" aria-hidden="true" />
                  ADD USER
                </button>
              </li>
              <li className="-mx-6 mt-auto">
                <a
                  href="#"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                >
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">Tom Cook</span>
                </a>
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
            <Route path="/user/:id" element={<User />} />
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
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <FormUser setOpen={setIsSlideOverOpen} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
