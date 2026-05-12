import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import RecentTasks from '@/components/dashboard/RecentTasks';

export default function HRDashboard() {
  return (
    <div className="p-6">
      <DashboardNavbar />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <RecentTasks />
      </div>
    </div>
  );
}
