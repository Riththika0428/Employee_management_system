interface Props {
  label: string;
  type?: string;
  register: any;
  name: string;
  error?: string;
}



const Input = ({
  label,
  type = "text",
  register,
  name,
  error,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        {...register(name)}
        className="
        w-full
        border
        rounded-lg
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-blue-500
        "
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;