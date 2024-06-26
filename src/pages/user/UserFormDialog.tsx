import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Timestamp } from "firebase/firestore";
import { Attendance } from "../../modules/interfaces/user";

interface IUserFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData?: Attendance | null;
  onSave: (data: Attendance) => void;
}

const UserFormDialog: React.FC<IUserFormDialogProps> = ({
  isOpen,
  setIsOpen,
  initialData,
  onSave,
}) => {
  const [timeIn, setTimeIn] = useState<Date | null>(null);
  const [timeOut, setTimeOut] = useState<Date | null>(null);
  const [breaks, setBreaks] = useState<
    { description: string; start: Date; end: Date | null }[]
  >([]);

  useEffect(() => {
    if (initialData) {
      setTimeIn(initialData.timeIn.toDate());
      setTimeOut(initialData.timeOut ? initialData.timeOut.toDate() : null);
      setBreaks(
        initialData.breaks.map((b) => ({
          description: b.description,
          start: b.start.toDate(),
          end: b.end ? b.end.toDate() : null,
        }))
      );
    } else {
      setTimeIn(new Date());
      setTimeOut(null);
      setBreaks([]);
    }
  }, [initialData]);

  const handleBreakChange = (index: number, field: string, value: Date) => {
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], [field]: value };
    setBreaks(newBreaks);
  };

  const handleBreakDescriptionChange = (index: number, value: string) => {
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], description: value };
    setBreaks(newBreaks);
  };

  const handleAddBreak = () => {
    setBreaks([...breaks, { description: "", start: new Date(), end: null }]);
  };

  const handleRemoveBreak = (index: number) => {
    const newBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(newBreaks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAttendance: Attendance = {
        timeIn: Timestamp.fromDate(timeIn!),
        timeOut: timeOut ? Timestamp.fromDate(timeOut) : null,
        breaks: breaks.map((b) => ({
          description: b.description,
          start: Timestamp.fromDate(b.start),
          end: b.end ? Timestamp.fromDate(b.end) : null,
        })),
      };
      onSave(newAttendance);
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving attendance: ", error);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
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
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {initialData ? "Edit Attendance" : "Add Attendance"}
                    </Dialog.Title>
                  </div>
                  <div className="mt-2">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div>
                        <label
                          htmlFor="timeIn"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Time In
                        </label>
                        <input
                          type="datetime-local"
                          id="timeIn"
                          name="timeIn"
                          value={
                            timeIn ? timeIn.toISOString().slice(0, 16) : ""
                          }
                          onChange={(e) => setTimeIn(new Date(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="timeOut"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Time Out
                        </label>
                        <input
                          type="datetime-local"
                          id="timeOut"
                          name="timeOut"
                          value={
                            timeOut ? timeOut.toISOString().slice(0, 16) : ""
                          }
                          onChange={(e) => setTimeOut(new Date(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Breaks</h4>
                        {breaks.map((breakRecord, index) => (
                          <div key={index} className="space-y-2 mb-4">
                            <div>
                              <label
                                htmlFor={`break-description-${index}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Description
                              </label>
                              <input
                                type="text"
                                id={`break-description-${index}`}
                                name={`break-description-${index}`}
                                value={breakRecord.description}
                                onChange={(e) =>
                                  handleBreakDescriptionChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`break-start-${index}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                Start
                              </label>
                              <input
                                type="datetime-local"
                                id={`break-start-${index}`}
                                name={`break-start-${index}`}
                                value={
                                  breakRecord.start
                                    ? breakRecord.start
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  handleBreakChange(
                                    index,
                                    "start",
                                    new Date(e.target.value)
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`break-end-${index}`}
                                className="block text-sm font-medium text-gray-700"
                              >
                                End
                              </label>
                              <input
                                type="datetime-local"
                                id={`break-end-${index}`}
                                name={`break-end-${index}`}
                                value={
                                  breakRecord.end
                                    ? breakRecord.end.toISOString().slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  handleBreakChange(
                                    index,
                                    "end",
                                    new Date(e.target.value)
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-900 mt-2"
                              onClick={() => handleRemoveBreak(index)}
                            >
                              Remove Break
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-2 w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                          onClick={handleAddBreak}
                        >
                          Add Break
                        </button>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          {initialData ? "Update" : "Save"}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UserFormDialog;
