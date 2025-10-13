import React, { useId } from "react";

const Select = React.forwardRef(
  ({ options = [], label, className = "", ...props }, ref) => {
    const id = useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block mb-2 pl-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <select
          {...props}
          id={id}
          ref={ref}
          className={`px-3 py-3 rounded-xl bg-white text-gray-900 outline-none border border-gray-300 shadow-sm 
                      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out w-full 
                      ${className}`}
        >
          <option value="" disabled className="text-gray-400">
            Select an option
          </option>

          {options.map((option) =>
            typeof option === "string" ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )
          )}
        </select>
      </div>
    );
  }
);

export default Select;
