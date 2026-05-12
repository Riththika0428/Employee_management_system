import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    if (currentUser.role === "admin") {
      router.push("/dashboard/admin");
    } else if (currentUser.role === "hr") {
      router.push("/dashboard/hr");
    } else {
      router.push("/dashboard/employee");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
