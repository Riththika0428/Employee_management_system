import { useForm } from "react-hook-form";

import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";



const LoginPage = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();



  const onSubmit = async (
    data: any
  ) => {
    await login(data);
  };



  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      px-4
    "
    >
      <div
        className="
        bg-white
        w-full
        max-w-md
        rounded-2xl
        shadow-lg
        p-8
        space-y-6
      "
      >
        <h1
          className="
          text-3xl
          font-bold
          text-center
        "
        >
          Employee EMS
        </h1>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <Input
            label="Email"
            type="email"
            name="email"
            register={register}
            error={
              errors.email?.message as string
            }
          />

          <Input
            label="Password"
            type="password"
            name="password"
            register={register}
            error={
              errors.password
                ?.message as string
            }
          />

          <Button
            type="submit"
            loading={isSubmitting}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;