import { useState, useCallback, useEffect } from "react";
import { templateService } from "../services/templateService";
import type { Template, TemplateFormData, TemplateState } from "../types";
import { useAsync } from "@/shared/hooks/useAsync";

const initialState: TemplateState = {
  data: [],
  selectedTemplate: null,
  filters: {},
  isLoading: false,
  error: null,
};

export function useTemplateLogic(templateId?: number) {
  const [state, setState] = useState<TemplateState>(initialState);
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    category: "",
  });

  // Use shared async hook for API calls
  const { execute: executeGet, isLoading } = useAsync<Template[]>(async () => {
    const response = await templateService.getAll(state.filters);
    return response.data;
  });

  // Load data on mount and when filters change
  useEffect(() => {
    loadData();
  }, [state.filters]);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const data = await executeGet();
      setState((prev) => ({ ...prev, data: data || [], error: null }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load data",
      }));
    }
  }, [executeGet]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        if (state.selectedTemplate?.id) {
          await templateService.update(state.selectedTemplate.id, formData);
        } else {
          await templateService.create(formData);
        }

        // Reload data after successful submission
        await loadData();

        // Reset form
        setFormData({
          name: "",
          description: "",
          category: "",
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to save data",
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [formData, state.selectedTemplate, loadData]
  );

  // Handle form field changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle filter changes
  const updateFilters = useCallback(
    (newFilters: Partial<TemplateState["filters"]>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
      }));
    },
    []
  );

  // Set up real-time updates
  useEffect(() => {
    const subscription = templateService.subscribeToUpdates((payload) => {
      // Reload data when changes occur
      loadData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData]);

  return {
    ...state,
    isLoading,
    formData,
    handleSubmit,
    handleChange,
    updateFilters,
  };
}
