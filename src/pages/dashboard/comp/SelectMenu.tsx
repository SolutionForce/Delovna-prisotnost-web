import React, { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { UserWithCalculations } from "../../../modules/interfaces/customUser";
import { Role } from "../../../modules/interfaces/user";
import DownloadPdfStatisticsReportButton from "../../../components/pdfReports/DownloadPdfStatisticsReportButton/DownloadPdfStatisticsReportButton";

type SelectMenuProps = {
  items: UserWithCalculations[];
  multiSelect?: boolean;
  onSelectionChange: (selected: UserWithCalculations[]) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  items,
  multiSelect = false,
  onSelectionChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<UserWithCalculations[]>(
    []
  );

  // Select all employees by default
  useEffect(() => {
    const employees = items.filter((item) => item.role === Role.employee);
    setSelectedItems(employees);
    onSelectionChange(employees);
  }, [items, onSelectionChange]);

  const handleSelectionChange = (
    selected: UserWithCalculations | UserWithCalculations[]
  ) => {
    let newSelectedItems: UserWithCalculations[];
    if (Array.isArray(selected)) {
      newSelectedItems = selected;
    } else {
      if (multiSelect) {
        if (selectedItems.some((item) => item.uid === selected.uid)) {
          newSelectedItems = selectedItems.filter(
            (item) => item.uid !== selected.uid
          );
        } else {
          newSelectedItems = [...selectedItems, selected];
        }
      } else {
        newSelectedItems = [selected];
      }
    }
    setSelectedItems(newSelectedItems);
    onSelectionChange(newSelectedItems);
  };

  const selectAllUsers = () => {
    setSelectedItems(items);
    onSelectionChange(items);
  };

  const selectAllEmployees = () => {
    const employees = items.filter((item) => item.role === Role.employee);
    setSelectedItems(employees);
    onSelectionChange(employees);
  };

  const deselectAllUsers = () => {
    setSelectedItems([]);
    onSelectionChange([]);
  };

  const getRoleColor = (role: Role, isSelected: boolean) => {
    if (role === Role.employee && isSelected) {
      return "text-black";
    }
    switch (role) {
      case Role.employee:
        return "text-green-500";
      case Role.admin:
        return "text-red-500";
      case Role.guest:
        return "text-black-200";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:space-x-4 mb-4">
      <div className="flex-grow w-full xl:w-auto">
        <Listbox
          value={selectedItems}
          onChange={(value) => handleSelectionChange(value)}
          multiple={multiSelect}
        >
          {({}) => (
            <>
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100 sm:text-sm sm:leading-6">
                  <span className="block truncate">
                    {selectedItems.length > 0
                      ? selectedItems
                          .map((user, index, array) => {
                            if (index < 3)
                              return user.name + " " + user.surname;
                            if (index === array.length - 1)
                              return index - 2 + " more";
                            if (index >= 3) return null;
                          })
                          .filter((text) => text)
                          .join(", ")
                      : "Select..."}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {items.map((person) => (
                    <ListboxOption
                      key={person.uid}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "bg-purple-400 text-white"
                            : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-purple-100 "
                        )
                      }
                      value={person}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {person.name + " " + person.surname}{" "}
                            <span
                              className={getRoleColor(person.role, selected)}
                            >
                              ({person.role})
                            </span>
                          </span>
                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                "text-white"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <div className="flex flex-col lg:flex-col xl:flex-row flex-wrap space-x-0 space-y-2 xl:space-x-2 xl:space-y-0 mt-4 xl:mt-0 xl:flex-nowrap">
        <button
          onClick={selectAllEmployees}
          className="flex-grow xl:flex-grow-0 w-full xl:w-auto px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md"
        >
          All Employees
        </button>
        <button
          onClick={selectAllUsers}
          className="flex-grow xl:flex-grow-0 w-full xl:w-auto px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-md"
        >
          All Users
        </button>
        <button
          onClick={deselectAllUsers}
          className="flex-grow xl:flex-grow-0 w-full xl:w-auto px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-md"
        >
          Clear Users
        </button>
        <DownloadPdfStatisticsReportButton
          type="button"
          className="flex-grow xl:flex-grow-0 w-full xl:w-auto px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-md inline-flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default SelectMenu;
