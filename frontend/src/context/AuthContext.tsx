import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import {
  loginAPI,
  registerAPI,
} from "@/services/authService";

import { toast } from "react-toastify";



interface AuthContextType {
  currentUser: any;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}



const AuthContext =
  createContext<AuthContextType | null>(
    null
  );



export const AuthProvider = ({
  children,
}: any) => {
  const [currentUser, setCurrentUser] =
    useState(null);

  const router = useRouter();



  useEffect(() => {
    const user =
      localStorage.getItem("user");

    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);




  // LOGIN
  const login = async (data: any) => {
    try {
      const response = await loginAPI(
        data
      );

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      setCurrentUser(response.user);

      toast.success("Login successful");



      // Role Redirect
      if (
        response.user.role === "admin"
      ) {
        router.push("/dashboard/admin");
      } else if (
        response.user.role === "hr"
      ) {
        router.push("/dashboard/hr");
      } else {
        router.push(
          "/dashboard/employee"
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
      );
    }
  };




  // REGISTER
  const register = async (
    data: any
  ) => {
    try {
      await registerAPI(data);

      toast.success(
        "Registration successful"
      );

      router.push("/auth/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
      );
    }
  };




  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);

    router.push("/auth/login");
  };



  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  return useContext(AuthContext)!;
};