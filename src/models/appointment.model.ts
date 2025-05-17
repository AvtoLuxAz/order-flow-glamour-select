import { Service } from "./service.model";
import { Product } from "./product.model";

export interface Appointment {
  id: string;
  customerId: string;
  serviceId?: string;
  service?: string;
  services?: Service[];
  servicePrice?: number;
  price?: number;
  staffId?: string;
  staff?: string[];
  serviceProviders?: Array<{
    serviceId: string;
    name: string;
  }>;
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  status: string;
  notes?: string;
  orderReference?: string;
  totalAmount?: number;
  amountPaid?: number;
  remainingBalance?: number;
  paymentMethod?: string;
  products?: Product[];
  selectedProducts?: string[];
  created_at: string;
  updated_at: string;
}
