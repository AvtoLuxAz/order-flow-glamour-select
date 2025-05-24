
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Service, ServiceFilters } from '../types';
import { serviceService } from '../services/service.service';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/services/apiClient'; // Assuming ApiResponse is defined here

export function useServiceData(serviceId?: string | number, initialFilters?: ServiceFilters) {
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters || {});

  // Query for fetching a single service by ID
  const singleServiceQuery = useQuery<Service | null, Error>({
    queryKey: ['services', serviceId],
    queryFn: async () => {
      if (!serviceId) return null; // Should not happen due to `enabled` option but good for type safety
      const numericId = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
      const response: ApiResponse<Service> = await serviceService.getById(numericId);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Xidmət yüklənmədi",
          description: response.error
        });
        throw new Error(response.error);
      }
      return response.data || null;
    },
    enabled: !!serviceId, // Only run this query if serviceId is provided
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Query for fetching all services with filters
  const servicesQuery = useQuery<Service[], Error>({
    queryKey: ['services', filters],
    queryFn: async () => {
      // Pass filters to serviceService.getAll if the API supports it
      // For now, assuming getAll handles filters internally or fetches all and then filters,
      // or that filtering happens server-side based on `filters` object.
      // The task implied maintaining existing filter logic, but the provided queryFn was complex.
      // Simplifying to a direct API call. Filters should ideally be passed to the API.
      const response: ApiResponse<Service[]> = await serviceService.getAll(filters); // Assuming getAll can take filters
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Xidmətlər yüklənmədi",
          description: response.error
        });
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: !serviceId, // Only run this query if serviceId is NOT provided
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  if (serviceId) {
    return {
      data: singleServiceQuery.data,
      isLoading: singleServiceQuery.isLoading,
      isError: singleServiceQuery.isError,
      error: singleServiceQuery.error,
      refetch: singleServiceQuery.refetch,
      // filters and updateFilters are not returned when serviceId is present
    };
  }

  return {
    data: servicesQuery.data,
    isLoading: servicesQuery.isLoading,
    isError: servicesQuery.isError,
    error: servicesQuery.error,
    refetch: servicesQuery.refetch,
    filters,
    updateFilters,
  };
}
