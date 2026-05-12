import Sidebar from "@/components/sidebar/Sidebar";



const AdminLayout = ({
  children,
}: any) => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;