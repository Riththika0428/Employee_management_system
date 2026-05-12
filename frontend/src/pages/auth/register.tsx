import { useForm } from "react-hook-form";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
    },
  });

  const onSubmit = async (data: any) => {
    await registerUser(data);
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "hr", label: "HR Manager" },
    { value: "employee", label: "Employee" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-10 space-y-8 border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Join Employee EMS
          </h1>
          <p className="text-gray-500">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            register={register}
            error={errors.name?.message as string}
            // @ts-ignore
            validation={{ required: "Name is required" }}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            register={register}
            error={errors.email?.message as string}
            // @ts-ignore
            validation={{ 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}
          />

          <Select
            label="User Role"
            name="role"
            register={register}
            options={roleOptions}
            error={errors.role?.message as string}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            register={register}
            error={errors.password?.message as string}
            // @ts-ignore
            validation={{ 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            }}
          />

          <Button type="submit" loading={isSubmitting} fullWidth>
            Create Account
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;