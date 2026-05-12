import { useEffect, useState } from "react";

import AdminLayout from "@/layouts/AdminLayout";

import ProtectedRoute from "@/routes/ProtectedRoute";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

import StatCard from "@/components/dashboard/StatCard";

import ChartCard from "@/components/dashboard/ChartCard";

import SkeletonCard from "@/components/dashboard/SkeletonCard";

import EmployeeGrowthChart from "@/charts/EmployeeGrowthChart";

import AttendanceChart from "@/charts/AttendanceChart";

import {
  getAdminDashboard,
} from "@/services/dashboardService";

import {
  FaUsers,
  FaMoneyBill,
  FaTasks,
} from "react-icons/fa";



const AdminDashboard = () => {
  const [dashboard, setDashboard] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);



  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const data =
            await getAdminDashboard();

          setDashboard(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);




  if (loading) {
    return (
      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
      "
      >
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminLayout>
        <DashboardNavbar />



        {/* Stats */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-8
        "
        >
          <StatCard
            title="Total Employees"
            value={
              dashboard.totalEmployees
            }
            icon={<FaUsers />}
          />

          <StatCard
            title="Active Employees"
            value={
              dashboard.activeEmployees
            }
            icon={<FaUsers />}
          />

          <StatCard
            title="Payroll Expenses"
            value={`$${dashboard.totalPayrollExpenses}`}
            icon={<FaMoneyBill />}
          />

          <StatCard
            title="Completed Tasks"
            value={
              dashboard.completedTasks
            }
            icon={<FaTasks />}
          />
        </div>



        {/* Charts */}
        <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
        >
          <ChartCard title="Employee Growth">
            <EmployeeGrowthChart
              data={
                dashboard.monthlyEmployeeGrowth
              }
            />
          </ChartCard>

          <ChartCard title="Attendance Trends">
            <AttendanceChart
              data={
                dashboard.attendanceTrends
              }
            />
          </ChartCard>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminDashboard;