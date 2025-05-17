export interface Appointment {
  id: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}
