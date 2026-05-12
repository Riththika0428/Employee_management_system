import {
  FaBell,
  FaSearch,
} from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";



const DashboardNavbar = () => {
  const { currentUser, logout } =
    useAuth();

  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between mb-6">
      {/* Search */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-72">
        <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 w-full"
          />
      </div>



      {/* Right Side */}
      <div className="flex items-center gap-5">
        <button className="relative">
          <FaBell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>



        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {currentUser?.name?.charAt(0)}
          </div>

          <div>
            <p className="font-semibold">
              {currentUser?.name}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {currentUser?.role}
            </p>
          </div>
        </div>



        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardNavbar;