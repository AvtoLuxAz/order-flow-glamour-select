import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > {
  label: string;
  error?: string;
  type?: string;
  multiline?: boolean;
  options?: Array<{ label: string; value: string | number }>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type = "text",
  multiline = false,
  options,
  className = "",
  ...props
}) => {
  const baseInputStyles =
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
  const errorInputStyles =
    "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";

  const inputClasses = [
    baseInputStyles,
    error ? errorInputStyles : "",
    className,
  ].join(" ");

  const renderInput = () => {
    if (multiline) {
      return (
        <textarea
          className={inputClasses}
          rows={4}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    if (type === "select" && options) {
      return (
        <select
          className={inputClasses}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        className={inputClasses}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  };

  return (
    <div>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
