
/**
 * Hook to fetch and manage feature data
 */

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Feature, FeatureFilters } from '../types';
import { featureService } from '../services/feature.service';

export function useFeatureData(initialFilters?: FeatureFilters) {
  // State for managing filters
  const [filters, setFilters] = useState<FeatureFilters>(initialFilters || {});
  
  // State for current feature when viewing details
  const [feature, setFeature] = useState<Feature | null>(null);
  
  // Fetch all features with current filters
  const {
    data: features,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['features', filters],
    queryFn: async () => {
      const response = await featureService.getAll(filters);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    }
  });

  // Fetch a single feature by ID
  const fetchFeatureById = async (id: number | string): Promise<Feature | null> => {
    const response = await featureService.getById(id);
    if (response.error) {
      console.error(response.error);
      return null;
    }
    setFeature(response.data || null);
    return response.data;
  };
  
  // Alias for fetchFeatureById to match the component expectations
  const fetchFeature = fetchFeatureById;

  // Update filters and trigger refetch
  const updateFilters = (newFilters: Partial<FeatureFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    features,
    feature,
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
    fetchFeatureById,
    fetchFeature
  };
}
