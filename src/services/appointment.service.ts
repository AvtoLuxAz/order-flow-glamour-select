import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormData as ModelAppointmentFormData, AppointmentStatus } from "@/models/appointment.model.ts";

// Define ApiResponse locally
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Interfaces specific to Appointment details
export interface AppointmentServiceItem {
  service_id: number;
  service_name: string;
  staff_id: string;
  staff_name: string; 
  service_price_at_booking?: number;
}

export interface AppointmentProductItem {
  product_id: number;
  product_name: string;
  quantity: number;
  product_price_at_booking?: number;
}

export interface CustomerDetails {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
}

export interface AppointmentWithDetails extends Appointment {
  customer: CustomerDetails | null;
  services: AppointmentServiceItem[];
  products: AppointmentProductItem[];
}

// Using ModelAppointmentFormData from appointment.model.ts as per instructions.
// The model defines customer_user_id and user_id as optional.
// The calling code/hook will be responsible for ensuring these are provided for creation.

class AppointmentService {
  constructor() {}

  async getAppointmentDetails(appointmentId: number | string): Promise<ApiResponse<AppointmentWithDetails>> {
    try {
      const numericAppointmentId = typeof appointmentId === 'string' ? parseInt(appointmentId, 10) : appointmentId;
      if (isNaN(numericAppointmentId)) {
        return { error: "Invalid Appointment ID format." };
      }

      // 1. Fetch core appointment data
      const { data: appointmentData, error: appointmentError } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", numericAppointmentId)
        .single();

      if (appointmentError) throw appointmentError;
      if (!appointmentData) return { error: "Appointment not found." };

      // 2. Fetch customer data
      let customerDetails: CustomerDetails | null = null;
      if (appointmentData.customer_user_id) {
        const { data: customerData, error: customerError } = await supabase
          .from("users") 
          .select("id, first_name, last_name, email, phone_number")
          .eq("id", appointmentData.customer_user_id)
          .single();
        if (customerError) console.warn(`Warning fetching customer details for appointment ${numericAppointmentId}:`, customerError.message);
        // If customerData is null (e.g. user deleted), customerDetails remains null
        customerDetails = customerData ? customerData as CustomerDetails : null;
      }

      // 3. Fetch related services
      const { data: servicesData, error: servicesError } = await supabase
        .from("appointment_services")
        .select(`
          service_id,
          services (name),
          staff_id,
          users (first_name, last_name),
          price_at_booking
        `)
        .eq("appointment_id", numericAppointmentId);

      if (servicesError) throw servicesError;

      const appointmentServices: AppointmentServiceItem[] = servicesData?.map((s: any) => ({
        service_id: s.service_id,
        service_name: s.services?.name || "Unknown Service",
        staff_id: s.staff_id,
        staff_name: s.users ? `${s.users.first_name || ''} ${s.users.last_name || ''}`.trim() : "Unknown Staff",
        service_price_at_booking: s.price_at_booking,
      })) || [];

      // 4. Fetch related products
      const { data: productsData, error: productsError } = await supabase
        .from("appointment_products")
        .select(`
          product_id,
          products (name),
          quantity,
          price_at_booking
        `)
        .eq("appointment_id", numericAppointmentId);
      
      if (productsError) throw productsError;

      const appointmentProducts: AppointmentProductItem[] = productsData?.map((p: any) => ({
        product_id: p.product_id,
        product_name: p.products?.name || "Unknown Product",
        quantity: p.quantity,
        product_price_at_booking: p.price_at_booking,
      })) || [];

      const result: AppointmentWithDetails = {
        ...appointmentData,
        customer: customerDetails,
        services: appointmentServices,
        products: appointmentProducts,
      };

      return { data: result };
    } catch (error: any) {
      console.error(`Error in getAppointmentDetails for ID ${appointmentId}:`, error);
      return { error: error.message || "An unexpected error occurred." };
    }
  }

  async createAppointment(appointmentData: ModelAppointmentFormData): Promise<ApiResponse<Appointment>> {
    try {
      // Ensure required fields like customer_user_id are present.
      // ModelAppointmentFormData has them as optional, so validation might be needed here or by the caller.
      if (!appointmentData.customer_user_id) {
        return { error: "Customer user ID is required to create an appointment." };
      }
       if (!appointmentData.user_id) {
        // user_id typically refers to the staff/admin creating the appointment
        return { error: "User ID (staff/creator) is required to create an appointment." };
      }
      if (!appointmentData.appointment_date || !appointmentData.start_time || !appointmentData.end_time) {
          return { error: "Appointment date, start time, and end time are required."}
      }


      const { data, error } = await supabase
        .from("appointments")
        .insert([appointmentData]) 
        .select()
        .single(); 

      if (error) throw error;
      return { data: data as Appointment };
    } catch (error: any) {
      console.error("Error in createAppointment:", error);
      return { error: error.message || "An unexpected error occurred." };
    }
  }

  async updateAppointmentStatus(appointmentId: number | string, status: AppointmentStatus, reason?: string): Promise<ApiResponse<Appointment>> {
    try {
      const numericAppointmentId = typeof appointmentId === 'string' ? parseInt(appointmentId, 10) : appointmentId;
       if (isNaN(numericAppointmentId)) {
        return { error: "Invalid Appointment ID format." };
      }

      const updateData: Partial<Appointment> = { status, updated_at: new Date().toISOString() };
      if (reason !== undefined && (status === 'cancelled' || status === 'no_show')) {
        updateData.cancel_reason = reason;
      }
      if (status === 'no_show') {
        updateData.is_no_show = true;
      } else if (status === 'completed' || status === 'scheduled' || status === 'confirmed') {
        // Explicitly set is_no_show to false for these statuses
        updateData.is_no_show = false;
        updateData.cancel_reason = null; // Clear cancel reason if not cancelled
      }

      const { data, error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", numericAppointmentId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Appointment };
    } catch (error: any) {
      console.error(`Error in updateAppointmentStatus for ID ${appointmentId}:`, error);
      return { error: error.message || "An unexpected error occurred." };
    }
  }

  async rescheduleAppointment(appointmentId: number | string, newDate: string, newStartTime: string, newEndTime: string): Promise<ApiResponse<Appointment>> {
    try {
      const numericAppointmentId = typeof appointmentId === 'string' ? parseInt(appointmentId, 10) : appointmentId;
      if (isNaN(numericAppointmentId)) {
        return { error: "Invalid Appointment ID format." };
      }

      const { data, error } = await supabase
        .from("appointments")
        .update({
          appointment_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
          status: 'scheduled', // Rescheduling might imply reverting to 'scheduled' or 'confirmed'
          updated_at: new Date().toISOString(),
          is_no_show: false, // Reset no-show status
          cancel_reason: null, // Clear cancel reason
        })
        .eq("id", numericAppointmentId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Appointment };
    } catch (error: any) {
      console.error(`Error in rescheduleAppointment for ID ${appointmentId}:`, error);
      return { error: error.message || "An unexpected error occurred." };
    }
  }

  async getAllAppointments(filters?: {
    status?: AppointmentStatus | AppointmentStatus[];
    customerUserId?: string;
    staffUserId?: string; // user_id in appointments table
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD
    dateColumn?: 'appointment_date' | 'created_at'; // Column to filter date range on
    ascending?: boolean; // Sort order for appointment_date
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Appointment[]>> {
    try {
      let query = supabase.from("appointments").select("*");

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
            query = query.in("status", filters.status);
        } else {
            query = query.eq("status", filters.status);
        }
      }
      if (filters?.customerUserId) {
        query = query.eq("customer_user_id", filters.customerUserId);
      }
      if (filters?.staffUserId) {
        query = query.eq("user_id", filters.staffUserId); // user_id on appointments table
      }
      if (filters?.startDate && filters?.dateColumn) {
        query = query.gte(filters.dateColumn, filters.startDate);
      }
      if (filters?.endDate && filters?.dateColumn) {
        query = query.lte(filters.dateColumn, filters.endDate);
      }
      
      query = query.order('appointment_date', { ascending: filters?.ascending ?? false });
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 0) -1);
      }


      const { data, error } = await query;

      if (error) throw error;
      return { data: data as Appointment[] };
    } catch (error: any) {
      console.error("Error in getAllAppointments:", error);
      return { error: error.message || "An unexpected error occurred." };
    }
  }
}

export const appointmentService = new AppointmentService();
