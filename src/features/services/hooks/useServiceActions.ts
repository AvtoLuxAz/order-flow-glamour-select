import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Service, ServiceFormData } from "../types";
import { serviceService } from "../services/service.service";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/models/types"; // Changed from apiClient to models/types

export function useServiceActions(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  // Create service mutation
  const createServiceMutation = useMutation<
    Service | null,
    Error,
    ServiceFormData
  >({
    mutationFn: async (data: ServiceFormData) => {
      const response: ApiResponse<Service> = await serviceService.create(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Uğurlu əməliyyat",
        description: "Xidmət uğurla yaradıldı",
      });
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Xidmət yaradıla bilmədi",
      });
    },
  });

  // Update service mutation
  const updateServiceMutation = useMutation<
    Service | null,
    Error,
    { id: number | string; data: Partial<ServiceFormData> }
  >({
    mutationFn: async ({ id, data }) => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      const response: ApiResponse<Service> = await serviceService.update(
        numericId,
        data
      );
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", id] });
      toast({
        title: "Uğurlu əməliyyat",
        description: "Xidmət yeniləndi",
      });
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Xidmət yenilənə bilmədi",
      });
    },
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation<boolean, Error, number | string>({
    mutationFn: async (id: number | string) => {
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      const response: ApiResponse<boolean> = await serviceService.delete(
        numericId
      );
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || false;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", id] });
      toast({
        title: "Uğurlu əməliyyat",
        description: "Xidmət silindi",
      });
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: error.message || "Xidmət silinə bilmədi",
      });
    },
  });

  const isLoading =
    createServiceMutation.isPending ||
    updateServiceMutation.isPending ||
    deleteServiceMutation.isPending;

  return {
    createService: createServiceMutation.mutateAsync,
    isCreatingService: createServiceMutation.isPending,
    createServiceError: createServiceMutation.error,

    updateService: updateServiceMutation.mutateAsync,
    isUpdatingService: updateServiceMutation.isPending,
    updateServiceError: updateServiceMutation.error,

    deleteService: deleteServiceMutation.mutateAsync,
    isDeletingService: deleteServiceMutation.isPending,
    deleteServiceError: deleteServiceMutation.error,

    isLoading, // General loading state
  };
}
