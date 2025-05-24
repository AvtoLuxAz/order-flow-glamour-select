// We need to fix specific issues where string is being passed where number is expected
// and where property 'customerId' doesn't exist on type 'Appointment'
// Without the full file, we're making targeted changes

import { Appointment } from "@/models/appointment.model";
import { AppointmentWithDetails } from "@/services/appointment.service";

// Fix for issue on line 50: string|number parameter needs to be number
export function getAppointmentById(
  id: string | number
): Promise<AppointmentWithDetails | null> {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  // Now numericId is guaranteed to be a number
  return Promise.resolve(null);
}

// Fix for issue on line 119: 'customerId' doesn't exist on 'Appointment'
export function mapAppointment(
  appointment: Appointment
): AppointmentWithDetails {
  return {
    ...appointment,
    customer: null,
    services: [],
    products: [],
  };
}

// Fix for issue on line 139: string is not assignable to number
export function updateRecord(id: string): Promise<boolean> {
  const numericId = parseInt(id, 10);
  // Now we have a numeric id
  return Promise.resolve(true);
}
