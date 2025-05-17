import { Customer } from "@/features/customers/types";
import { Appointment } from "@/features/appointments/types";

// Mock data
const mockCustomers: Customer[] = [];
const mockAppointments: Appointment[] = [];

export const customerService = {
  getCustomer: async (id: string): Promise<Customer | null> => {
    return mockCustomers.find((c) => c.id === id) || null;
  },
  updateCustomer: async (
    id: string,
    data: Partial<Customer>
  ): Promise<Customer | null> => {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    mockCustomers[index] = { ...mockCustomers[index], ...data };
    return mockCustomers[index];
  },
  deleteCustomer: async (id: string): Promise<boolean> => {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) return false;
    mockCustomers.splice(index, 1);
    return true;
  },
};

export const appointmentService = {
  getCustomerAppointments: async (
    customerId: string
  ): Promise<Appointment[]> => {
    return mockAppointments.filter((a) => a.customerId === customerId);
  },
  createAppointment: async (
    data: Omit<Appointment, "id">
  ): Promise<Appointment> => {
    const newAppointment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },
  updateAppointment: async (
    id: string,
    data: Partial<Appointment>
  ): Promise<Appointment | null> => {
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    mockAppointments[index] = { ...mockAppointments[index], ...data };
    return mockAppointments[index];
  },
  deleteAppointment: async (id: string): Promise<boolean> => {
    const index = mockAppointments.findIndex((a) => a.id === id);
    if (index === -1) return false;
    mockAppointments.splice(index, 1);
    return true;
  },
};
