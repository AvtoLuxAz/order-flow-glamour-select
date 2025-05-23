import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast'; // Assuming this is the correct path for useToast
import { appointmentService } from "@/services/appointment.service";
import { Appointment, AppointmentFormData, AppointmentStatus } from "@/models/appointment.model";
import { ApiResponse } from '@/services/appointment.service'; // Using ApiResponse from appointment.service

export const useAppointmentActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create Appointment Mutation
  const createAppointmentMutation = useMutation<Appointment | null, Error, AppointmentFormData>({
    mutationFn: async (appointmentData: AppointmentFormData) => {
      // Dates are expected to be strings as per AppointmentFormData and appointmentService
      const response: ApiResponse<Appointment> = await appointmentService.createAppointment(appointmentData);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['appointments', data.id] });
      }
      toast({
        title: "Success",
        description: "Appointment created successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create appointment."
      });
    }
  });

  // Update Appointment Status Mutation
  const updateAppointmentStatusMutation = useMutation<
    Appointment | null, 
    Error, 
    { appointmentId: number | string; status: AppointmentStatus; reason?: string }
  >({
    mutationFn: async ({ appointmentId, status, reason }) => {
      const response: ApiResponse<Appointment> = await appointmentService.updateAppointmentStatus(appointmentId, status, reason);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', variables.appointmentId] });
      toast({
        title: "Success",
        description: `Appointment status updated to ${variables.status}.`
      });
    },
    onError: (error: Error, variables) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to update appointment status to ${variables.status}.`
      });
    }
  });

  // Reschedule Appointment Mutation
  const rescheduleAppointmentMutation = useMutation<
    Appointment | null,
    Error,
    { appointmentId: number | string; newDate: string; newStartTime: string; newEndTime:string }
  >({
    mutationFn: async ({ appointmentId, newDate, newStartTime, newEndTime }) => {
      // Dates are expected to be strings
      const response: ApiResponse<Appointment> = await appointmentService.rescheduleAppointment(appointmentId, newDate, newStartTime, newEndTime);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', variables.appointmentId] });
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reschedule appointment."
      });
    }
  });

  // Helper functions using the update status mutation
  const cancelAppointment = async (appointmentId: number | string, reason: string) => {
    return updateAppointmentStatusMutation.mutateAsync({ appointmentId, status: 'cancelled', reason });
  };

  const completeAppointment = async (appointmentId: number | string) => {
    return updateAppointmentStatusMutation.mutateAsync({ appointmentId, status: 'completed' });
  };
  
  // A general loading state can be derived if needed, e.g.:
  const isLoading = 
    createAppointmentMutation.isPending || 
    updateAppointmentStatusMutation.isPending || 
    rescheduleAppointmentMutation.isPending;

  return {
    createAppointment: createAppointmentMutation.mutateAsync,
    isCreatingAppointment: createAppointmentMutation.isPending,
    createAppointmentError: createAppointmentMutation.error,

    updateAppointmentStatus: updateAppointmentStatusMutation.mutateAsync,
    isUpdatingAppointmentStatus: updateAppointmentStatusMutation.isPending,
    updateAppointmentStatusError: updateAppointmentStatusMutation.error,

    rescheduleAppointment: rescheduleAppointmentMutation.mutateAsync,
    isReschedulingAppointment: rescheduleAppointmentMutation.isPending,
    rescheduleAppointmentError: rescheduleAppointmentMutation.error,

    cancelAppointment,
    completeAppointment,
    
    isLoading, // Consolidated loading state
  };
};
