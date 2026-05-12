import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import AttendanceTable from '@/components/dashboard/AttendanceTable';

export default function EmployeeDashboard() {
  return (
    <div className="p-6">
      <DashboardNavbar />
      <div className="mt-4">
        <AttendanceTable />
      </div>
    </div>
  );
}
