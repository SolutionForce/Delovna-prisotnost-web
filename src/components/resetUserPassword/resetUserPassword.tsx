import { ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { BACKEND_BASE_URL } from "../../modules/constants/api";

export default function ResetUserPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success , setSuccess] = useState("");
  const [loading , setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const resetPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        BACKEND_BASE_URL + "users/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: email})
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess("Email sent successfully. It should arrive soon.");
      setError("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Email with reset password link could not be sent. Try again later.")
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPassword();
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
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div className="flex items-center justify-between">
              <p>Enter your email address that you use with your account to continue.</p>
            </div>
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                disabled={loading}
              >
                {loading && (
                  <ArrowPathIcon
                    className="h-5 w-5 mr-2 -ml-1 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {!loading && (
                  <PaperAirplaneIcon className="h-5 w-5 mr-2 -ml-1" aria-hidden="true" />
                )}
                Send reset link to my email
              </button>
            </div>
            {success && (
              <div className="text-green-500 text-center mt-2">{success}</div>
            )}
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
