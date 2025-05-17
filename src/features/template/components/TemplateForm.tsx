import React from "react";
import { useTemplateLogic } from "../hooks/useTemplateLogic";
import { FormBuilder } from "@/shared/components/organisms/FormBuilder/FormBuilder";
import { WithStatus } from "@/shared/components/molecules/WithStatus/WithStatus";
import type { TemplateFormData } from "../types";

const templateFormSchema = [
  {
    name: "name",
    label: "Name",
    type: "text" as const,
    required: true,
    validation: {
      minLength: 3,
      maxLength: 50,
    },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea" as const,
    validation: {
      maxLength: 500,
    },
  },
  {
    name: "category",
    label: "Category",
    type: "text" as const,
    required: true,
    validation: {
      minLength: 2,
      maxLength: 30,
    },
  },
];

export const TemplateForm: React.FC = () => {
  const { data, isLoading, error, handleSubmit } = useTemplateLogic();

  return (
    <WithStatus loading={isLoading} error={error}>
      <FormBuilder
        schema={templateFormSchema}
        initialValues={data}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto"
        loading={isLoading}
      />
    </WithStatus>
  );
};
