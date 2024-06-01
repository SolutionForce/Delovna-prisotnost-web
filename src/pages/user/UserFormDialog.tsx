import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Timestamp } from "firebase/firestore";

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

interface IUserFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialData?: IAttendance | null;
  onSave: (data: IAttendance) => void;
}

const UserFormDialog: React.FC<IUserFormDialogProps> = ({
  isOpen,
  setIsOpen,
  initialData,
  onSave,
}) => {
  const [timeIn, setTimeIn] = useState<string>("");
  const [timeOut, setTimeOut] = useState<string>("");
  const [breaks, setBreaks] = useState<IAttendanceBreak[]>([]);

  useEffect(() => {
    if (initialData) {
      setTimeIn(
        initialData.timeIn instanceof Timestamp
          ? new Date(initialData.timeIn.seconds * 1000)
              .toISOString()
              .slice(0, 16)
          : ""
      );
      setTimeOut(
        initialData.timeOut && initialData.timeOut instanceof Timestamp
          ? new Date(initialData.timeOut.seconds * 1000)
              .toISOString()
              .slice(0, 16)
          : ""
      );
      setBreaks(
        initialData.breaks.map((b) => ({
          ...b,
          start:
            b.start instanceof Timestamp
              ? new Date(b.start.seconds * 1000)
              : new Date(),
          end:
            b.end instanceof Timestamp
              ? new Date(b.end.seconds * 1000)
              : new Date(),
        }))
      );
    } else {
      setTimeIn("");
      setTimeOut("");
      setBreaks([]);
    }
  }, [initialData]);

  const handleBreakChange = (index: number, field: string, value: string) => {
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], [field]: new Date(value) };
    setBreaks(newBreaks);
  };

  const handleBreakDescriptionChange = (index: number, value: string) => {
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], description: value };
    setBreaks(newBreaks);
  };

  const handleAddBreak = () => {
    setBreaks([
      ...breaks,
      { description: "", start: new Date(), end: new Date() },
    ]);
  };

  const handleRemoveBreak = (index: number) => {
    const newBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(newBreaks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAttendance: IAttendance = {
        timeIn: Timestamp.fromDate(new Date(timeIn)),
        timeOut: timeOut ? Timestamp.fromDate(new Date(timeOut)) : null,
        breaks: breaks.map((b) => ({
          ...b,
          start: Timestamp.fromDate(new Date(b.start)),
          end: Timestamp.fromDate(new Date(b.end)),
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
                          value={timeIn}
                          onChange={(e) => setTimeIn(e.target.value)}
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
                          value={timeOut}
                          onChange={(e) => setTimeOut(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
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
                                    ? new Date(breakRecord.start)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  handleBreakChange(
                                    index,
                                    "start",
                                    e.target.value
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
                                    ? new Date(breakRecord.end)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  handleBreakChange(
                                    index,
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
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
