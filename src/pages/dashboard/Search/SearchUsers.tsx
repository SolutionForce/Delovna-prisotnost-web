import React, { useState } from "react";
import { UserWithCalculations } from "../../../modules/interfaces/customUser"; // Update the path to your User interface
import { Link } from "react-router-dom";

interface SearchUsersProps {
  items: UserWithCalculations[];
}

const SearchUsers: React.FC<SearchUsersProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = items.filter((user) => {
    const searchTerms = searchTerm.toLowerCase().split(" ");

    const matchesName =
      user.name.toLowerCase().includes(searchTerms[0]) ||
      user.surname.toLowerCase().includes(searchTerms[0]);
    const matchesEmail = user.email.toLowerCase().includes(searchTerms[0]);
    const matchesRole = user.role.toLowerCase().includes(searchTerms[0]);

    if (searchTerms.length > 1) {
      return (
        (matchesRole &&
          (user.name.toLowerCase().includes(searchTerms[1]) ||
            user.surname.toLowerCase().includes(searchTerms[1]))) ||
        (matchesName && user.role.toLowerCase().includes(searchTerms[1]))
      );
    }

    return matchesName || matchesEmail || matchesRole;
  });

  return (
    <div className="w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search"
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      {searchTerm && (
        <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-md">
          {filteredUsers.map((user) => (
            <li key={user.uid} className="p-2 hover:bg-gray-100 cursor-pointer">
              <Link to={`../user/${user.uid}`} className="block">
                {user.name} {user.surname}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
