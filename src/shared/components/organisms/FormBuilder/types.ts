export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "textarea"
  | "date"
  | "checkbox";

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    customValidation?: (value: any) => string | undefined;
  };
}

export interface FormBuilderProps {
  schema: FormFieldSchema[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  loading?: boolean;
}
