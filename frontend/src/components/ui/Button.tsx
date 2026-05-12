interface Props {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({
  children,
  type = "button",
  loading,
  fullWidth = true,
  variant = "primary",
}: Props) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      disabled={loading}
      className={`${fullWidth ? "w-full" : "px-6"} ${
        variants[variant]
      } py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50 flex items-center justify-center`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Please wait...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;