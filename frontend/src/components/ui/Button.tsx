interface Props {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
}



const Button = ({
  children,
  type = "button",
  loading,
}: Props) => {
  return (
    <button
      type={type}
      disabled={loading}
      className="
      w-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      py-3
      rounded-lg
      transition
      duration-200
      disabled:opacity-50
      "
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;