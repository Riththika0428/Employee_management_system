import { useForm } from "react-hook-form";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-10 space-y-8 border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500">Sign in to manage your workspace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <Input
            label="Password"
            type="password"
            name="password"
            register={register}
            error={errors.password?.message as string}
            // @ts-ignore
            validation={{ required: "Password is required" }}
          />

          <Button type="submit" loading={isSubmitting} fullWidth>
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;