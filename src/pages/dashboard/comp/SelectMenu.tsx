import React, { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { User } from "../../../modules/interfaces/user";

type SelectMenuProps = {
  items: User[];
  multiSelect?: boolean;
  onSelectionChange: (selected: User[]) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  items,
  multiSelect = false,
  onSelectionChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<User[]>([]);

  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  const handleSelectionChange = (selected: User | User[]) => {
    let newSelectedItems: User[];
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
  };

  const selectAllUsers = () => {
    setSelectedItems(items);
    console.log("Selected all users:", items);
  };

  const deselectAllUsers = () => {
    setSelectedItems([]);
    console.log("Deselected all users");
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex-grow">
        <Listbox
          value={selectedItems}
          onChange={(value) => handleSelectionChange(value)}
          multiple={multiSelect}
        >
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <span className="block truncate">
                    {selectedItems.length > 0
                      ? selectedItems.map((item) => item.name).join(", ")
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
                      className={({ active, selected }) =>
                        classNames(
                          selected
                            ? "bg-purple-600 text-white"
                            : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
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
                            {person.name}
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
      <div className="flex space-x-2">
        <button
          onClick={selectAllUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          All users
        </button>
        <button
          onClick={deselectAllUsers}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Clear users
        </button>
      </div>
    </div>
  );
};

export default SelectMenu;
