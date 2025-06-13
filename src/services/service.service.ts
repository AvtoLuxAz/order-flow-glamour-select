
import { Service, ServiceFormData } from '@/models/service.model';
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from './staff.service';

export const serviceService = {
  // Basic CRUD methods
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert numeric IDs to strings
      const servicesWithStringIds = (data || []).map(service => ({
        ...service,
        id: String(service.id)
      }));
      
      return { data: servicesWithStringIds };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<Service>> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert numeric ID to string
      const serviceWithStringId = {
        ...data,
        id: String(data.id)
      };
      
      return { data: serviceWithStringId };
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  create: async (serviceData: ServiceFormData): Promise<ApiResponse<Service>> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert numeric ID to string
      const serviceWithStringId = {
        ...data,
        id: String(data.id)
      };
      
      return { data: serviceWithStringId };
    } catch (error) {
      console.error('Error creating service:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  update: async (id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<Service>> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert numeric ID to string
      const serviceWithStringId = {
        ...data,
        id: String(data.id)
      };
      
      return { data: serviceWithStringId };
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) {
        return { error: error.message };
      }
      return { data: true };
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  
  // Additional methods that match the API pattern
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    return serviceService.getAll();
  },
  
  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    return serviceService.getById(id);
  },
  
  createService: async (serviceData: ServiceFormData): Promise<ApiResponse<Service>> => {
    return serviceService.create(serviceData);
  },
  
  updateService: async (id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<Service>> => {
    return serviceService.update(id, serviceData);
  },
  
  deleteService: async (id: string): Promise<ApiResponse<boolean>> => {
    return serviceService.delete(id);
  },
  
  listServices: async (): Promise<ApiResponse<Service[]>> => {
    return serviceService.getAll();
  }
};
