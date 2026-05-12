import { useForm } from "react-hook-form";

import Input from "@/components/ui/Input";

import Button from "@/components/ui/Button";

import { useAuth } from "@/context/AuthContext";



const RegisterPage = () => {
  const { register: registerUser } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();



  const onSubmit = async (
    data: any
  ) => {
    await registerUser(data);
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
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <Input
            label="Name"
            name="name"
            register={register}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            register={register}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            register={register}
          />

          <Button
            type="submit"
            loading={isSubmitting}
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;