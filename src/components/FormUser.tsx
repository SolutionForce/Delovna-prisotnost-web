import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Role } from "../modules/interfaces/user";
import { createEmployee } from "../modules/constants/fetchData";
import { UserForRegistration } from "../modules/interfaces/customUser";

const FormUser: React.FC<{
  setOpen: (open: boolean) => void;
  reload: () => void;
}> = ({ setOpen, reload }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    organizationId: "",
    role: Role.employee,
    hourlyRate: "", // Add hourlyRate to the form state
  });

  const [organizationIds, ] = useState([
    "bJHcvlNbZalnmNWPzXei",
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData: UserForRegistration = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        role: formData.role,
        attendance: [],
        password: formData.password,
        organizationId: formData.organizationId,
        hourlyRate: parseFloat(formData.hourlyRate), // Parse hourlyRate as a float
      };

      await createEmployee(userData);
      reload();
      setOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
    >
      <div className="flex-1">
        <div className="bg-gray-50 px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                New User
              </Dialog.Title>
              <p className="text-sm text-gray-500">
                Fill in the information below to create a new user.
              </p>
            </div>
            <div className="flex h-7 items-center">
              <button
                type="button"
                className="relative text-gray-400 hover:text-gray-500"
                onClick={() => setOpen(false)}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Surname
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="surname"
                id="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Email
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Password
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="organizationId"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Organization
              </label>
            </div>
            <div className="sm:col-span-2">
              <select
                name="organizationId"
                id="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" disabled>
                  Select an organization
                </option>
                {organizationIds.map((orgId) => (
                  <option key={orgId} value={orgId}>
                    {orgId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Role
              </label>
            </div>
            <div className="sm:col-span-2">
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value={Role.employee}>Employee</option>
                <option value={Role.admin}>Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
              >
                Hourly Rate
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                type="number"
                name="hourlyRate"
                id="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                step="0.1"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create User
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormUser;
