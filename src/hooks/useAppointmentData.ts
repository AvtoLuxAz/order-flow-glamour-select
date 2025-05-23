import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { appointmentService, ApiResponse, AppointmentWithDetails } from '@/services/appointment.service';
import { Appointment, AppointmentStatus } from '@/models/appointment.model';

// Define a type for the filters based on appointmentService.getAllAppointments
// This should align with the filters parameter of getAllAppointments in appointment.service.ts
export interface AppointmentListFilters {
  status?: AppointmentStatus | AppointmentStatus[];
  customerUserId?: string;
  staffUserId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  dateColumn?: 'appointment_date' | 'created_at';
  ascending?: boolean;
  limit?: number;
  offset?: number;
}

// Define the return type of the hook
interface UseAppointmentDataResult<TData> {
  data: TData | undefined; // data can be undefined during initial loading
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<UseQueryResult<TData, Error>>;
}


export const useAppointmentData = (
  appointmentId?: number | string,
  filters?: AppointmentListFilters
): UseAppointmentDataResult<AppointmentWithDetails | Appointment[] | null> => {

  // Query for fetching a single appointment by ID
  const singleAppointmentQuery = useQuery<AppointmentWithDetails | null, Error, AppointmentWithDetails | null>({
    queryKey: ['appointments', appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null; // Should not be strictly necessary due to `enabled`
      const response: ApiResponse<AppointmentWithDetails> = await appointmentService.getAppointmentDetails(appointmentId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || null;
    },
    enabled: !!appointmentId, // Only run this query if appointmentId is provided
  });

  // Query for fetching all appointments with filters
  const multipleAppointmentsQuery = useQuery<Appointment[] | null, Error, Appointment[] | null>({
    queryKey: ['appointments', filters || {}], // Ensure filters is an object for stable query key
    queryFn: async () => {
      const response: ApiResponse<Appointment[]> = await appointmentService.getAllAppointments(filters);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || []; // Return empty array if data is null/undefined
    },
    enabled: !appointmentId, // Only run this query if appointmentId is NOT provided
  });

  if (appointmentId) {
    return {
      data: singleAppointmentQuery.data,
      isLoading: singleAppointmentQuery.isLoading,
      isError: singleAppointmentQuery.isError,
      error: singleAppointmentQuery.error,
      refetch: singleAppointmentQuery.refetch as () => Promise<UseQueryResult<AppointmentWithDetails | Appointment[] | null, Error>>,
    };
  }

  return {
    data: multipleAppointmentsQuery.data,
    isLoading: multipleAppointmentsQuery.isLoading,
    isError: multipleAppointmentsQuery.isError,
    error: multipleAppointmentsQuery.error,
    refetch: multipleAppointmentsQuery.refetch as () => Promise<UseQueryResult<AppointmentWithDetails | Appointment[] | null, Error>>,
  };
};
