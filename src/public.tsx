import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AttendanceQR from "./components/attendanceSubmission/attendanceQR/attendanceQR";
import ResetUserPassword from "./components/resetUserPassword/resetUserPassword";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Public() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/reset-password" element={<ResetUserPassword />} />
      <Route path="*" element={<Navigate to={"/sign-in"} />} />
    </Routes>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission
    setLoading(true);
    
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Set a generic error message
        setError("Email or password is incorrect");
        console.error("Error signing in:", errorCode, errorMessage);
      }).finally(() => {setLoading(false)});
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href=""
                    className="font-semibold text-purple-600 hover:text-purple-500"
                    onClick={() => {navigate("/reset-password")}}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                {loading && (
                  <ArrowPathIcon
                    className="h-5 w-5 mr-2 -ml-1 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Sign in
              </button>
            </div>
          </form>

          {/* <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-purple-600 hover:text-purple-500"
            >
              Start a 14 day free trial
            </a>
          </p> */}
          <div className="flex justify-center items-center ">
            <AttendanceQR />
          </div>
        </div>
      </div>
    </>
  );
}
