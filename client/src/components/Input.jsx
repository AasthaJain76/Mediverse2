import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-semibold text-gray-800"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        {...props}
        className={`w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900
          placeholder-gray-400 shadow-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition duration-200 ${className}`}
      />
    </div>
  );
});

export default Input;
