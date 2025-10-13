import React from "react";

export default function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        px-5 py-2.5 rounded-xl font-medium shadow-sm
        transition-all duration-200 ease-in-out
        ${bgColor} ${textColor} ${className}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:scale-105"}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
