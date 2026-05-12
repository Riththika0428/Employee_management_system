import React from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  register: any;
  options: Option[];
  error?: string;
  required?: boolean;
}

const Select = ({
  label,
  name,
  register,
  options,
  error,
  required = false,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        {...register(name, { required: required ? "This field is required" : false })}
        className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
