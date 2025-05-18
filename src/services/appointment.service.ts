import { ApiService } from "./api.service";
import {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "@/models/appointment.model";
import { ApiResponse } from "@/models/types";
import { config } from "@/config/env";
import { mockAppointments } from "@/lib/mock-data";
import { Product } from "@/models/product.model";
import { supabase } from "@/lib/supabase";

export class AppointmentService extends ApiService {
  // Get all appointments
  async getAll(): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { data: [...mockAppointments] as Appointment[] };
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    return { data: data as Appointment[] };
  }

  // Get appointments for a specific customer
  async getByCustomerId(
    customerId: number | string
  ): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const appointments = mockAppointments.filter(
        (a) => a.customerId === Number(customerId)
      );
      // Ensure appointments conform to Appointment[] type
      return { data: [...appointments] as Appointment[] };
    }

    return this.get<Appointment[]>(`/customers/${customerId}/appointments`);
  }

  // Check staff availability
  async checkStaffAvailability(
    staffId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { data: true };
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("appointment_date", date)
      .contains("staff", [staffId])
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

    if (error) {
      return { error: error.message };
    }

    return { data: data.length === 0 };
  }

  // Check appointment conflicts
  async checkAppointmentConflicts(
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { data: false };
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("appointment_date", date)
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

    if (error) {
      return { error: error.message };
    }

    return { data: data.length === 0 };
  }

  // Create a new appointment
  async create(
    appointment: AppointmentFormData
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newAppointment = {
        ...appointment,
        id: Math.max(0, ...mockAppointments.map((a) => a.id)) + 1,
        date: appointment.date || new Date().toISOString().split("T")[0],
        status: (appointment.status || "pending") as AppointmentStatus,
        rejectionReason: "",
      } as Appointment;

      mockAppointments.push(newAppointment as Appointment);
      return { data: newAppointment };
    }

    // Check for conflicts before creating
    const conflictCheck = await this.checkAppointmentConflicts(
      appointment.date,
      appointment.startTime,
      appointment.endTime || ""
    );

    if (conflictCheck.error) {
      return { error: conflictCheck.error };
    }

    if (!conflictCheck.data) {
      return { error: "Time slot is already booked" };
    }

    // Check staff availability if staff is assigned
    if (appointment.staff && appointment.staff.length > 0) {
      for (const staffId of appointment.staff) {
        const availabilityCheck = await this.checkStaffAvailability(
          Number(staffId),
          appointment.date,
          appointment.startTime,
          appointment.endTime || ""
        );

        if (availabilityCheck.error) {
          return { error: availabilityCheck.error };
        }

        if (!availabilityCheck.data) {
          return {
            error: `Staff member ${staffId} is not available at this time`,
          };
        }
      }
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        customer_id: appointment.customerId,
        date: appointment.date,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        status: appointment.status || "pending",
        service: appointment.service,
        staff: appointment.staff,
        products: appointment.products,
        total_amount: appointment.totalAmount,
        amount_paid: appointment.amountPaid,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as Appointment };
  }

  // Update an existing appointment
  async update(
    id: number | string,
    appointment: Partial<AppointmentFormData>
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockAppointments.findIndex((a) => a.id === Number(id));
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          ...appointment,
          rejectionReason: mockAppointments[index].rejectionReason || "",
        } as Appointment;
        return { data: mockAppointments[index] as Appointment };
      }
      return { error: "Appointment not found" };
    }

    return this.put<Appointment>(`/appointments/${id}`, appointment);
  }

  // Confirm an appointment
  async confirmAppointment(
    id: number | string
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockAppointments.findIndex((a) => a.id === Number(id));
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          status: "confirmed",
        } as Appointment;
        return { data: mockAppointments[index] as Appointment };
      }
      return { error: "Appointment not found" };
    }

    return this.put<Appointment>(`/appointments/${id}/confirm`, {});
  }

  // Reject an appointment
  async rejectAppointment(
    id: number | string,
    reason: string
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockAppointments.findIndex((a) => a.id === Number(id));
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          status: "rejected",
          rejectionReason: reason || "No reason provided",
        } as Appointment;
        return { data: mockAppointments[index] as Appointment };
      }
      return { error: "Appointment not found" };
    }

    return this.put<Appointment>(`/appointments/${id}/reject`, { reason });
  }

  // Complete an appointment
  async completeAppointment(
    id: number | string
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockAppointments.findIndex((a) => a.id === Number(id));
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          status: "completed",
        } as Appointment;
        return { data: mockAppointments[index] as Appointment };
      }
      return { error: "Appointment not found" };
    }

    return this.put<Appointment>(`/appointments/${id}/complete`, {});
  }

  // Mark appointment as paid
  async markAsPaid(id: number | string): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockAppointments.findIndex((a) => a.id === Number(id));
      if (index >= 0) {
        mockAppointments[index] = {
          ...mockAppointments[index],
          status: "paid",
        } as Appointment;
        return { data: mockAppointments[index] as Appointment };
      }
      return { error: "Appointment not found" };
    }

    return this.put<Appointment>(`/appointments/${id}/paid`, {});
  }
}

// Create a singleton instance
export const appointmentService = new AppointmentService();
