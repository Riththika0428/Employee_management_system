import Link from "next/link";

import {
  FaUsers,
  FaTasks,
  FaMoneyBill,
  FaCalendarAlt,
} from "react-icons/fa";



const Sidebar = () => {
  return (
    <aside
      className="
      w-64
      bg-white
      shadow-md
      min-h-screen
      hidden
      md:block
    "
    >
      <div className="p-6 font-bold text-2xl">
        EMS
      </div>

      <nav className="space-y-2 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          href="/employees"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
        >
          <FaUsers />
          Employees
        </Link>

        <Link
          href="/tasks"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
        >
          <FaTasks />
          Tasks
        </Link>

        <Link
          href="/payroll"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
        >
          <FaMoneyBill />
          Payroll
        </Link>

        <Link
          href="/leaves"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
        >
          <FaCalendarAlt />
          Leaves
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;