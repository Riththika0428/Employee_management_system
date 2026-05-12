import { useRouter } from "next/router";

import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";



const ProtectedRoute = ({
  children,
  roles,
}: any) => {
  const { currentUser } = useAuth();

  const router = useRouter();



  useEffect(() => {
    if (!currentUser) {
      router.push("/auth/login");
    }

    if (
      roles &&
      !roles.includes(currentUser?.role)
    ) {
      router.push("/auth/login");
    }
  }, [currentUser]);



  return children;
};

export default ProtectedRoute;