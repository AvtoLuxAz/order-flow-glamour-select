import React, { useState } from "react";
import { Input } from "../../atoms/Input";
import { Button } from "../../atoms/Button";
import type { FormBuilderProps, FormFieldSchema } from "./types";

export const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  submitLabel = "Submit",
  className = "",
  loading = false,
}) => {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (
    field: FormFieldSchema,
    value: unknown
  ): string | undefined => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { pattern, min, max, minLength, maxLength, customValidation } =
        field.validation;

      if (pattern && typeof value === "string" && !pattern.test(value)) {
        return `${field.label} format is invalid`;
      }

      if (typeof value === "number") {
        if (min !== undefined && value < min) {
          return `${field.label} must be at least ${min}`;
        }
        if (max !== undefined && value > max) {
          return `${field.label} must be at most ${max}`;
        }
      }

      if (typeof value === "string") {
        if (minLength !== undefined && value.length < minLength) {
          return `${field.label} must be at least ${minLength} characters`;
        }
        if (maxLength !== undefined && value.length > maxLength) {
          return `${field.label} must be at most ${maxLength} characters`;
        }
      }

      if (customValidation) {
        return customValidation(value);
      }
    }

    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const field = schema.find((f) => f.name === name);

    if (!field) return;

    const newValue = type === "number" ? Number(value) : value;
    setValues((prev) => ({ ...prev, [name]: newValue }));

    const error = validateField(field, newValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    schema.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {schema.map((field) => (
        <div key={field.name} className="mb-4">
          <Input
            type={field.type}
            name={field.name}
            label={field.label}
            value={values[field.name] as string}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            error={errors[field.name]}
            options={field.options}
          />
        </div>
      ))}

      <Button type="submit" isLoading={loading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
};
