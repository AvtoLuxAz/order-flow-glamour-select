import { envConfig } from "../config/environment";
import { getMockData } from "./mockData";
import { Database } from "../lib/database.types";
import { logger } from "./logger";
import { supabase } from "@/lib/supabase";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface AppointmentData {
  customer_id: number;
  service_id: number;
  date: string;
  status: string;
}

interface PaymentData {
  appointment_id: number;
  amount: number;
  payment_method: string;
  status: string;
}

export class ApiService {
  private static instance: ApiService;
  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Customers
  async getCustomers() {
    logger.debug("Fetching customers", { environment: envConfig.environment });

    try {
      if (envConfig.useMockData) {
        const data = getMockData("customers") as CustomerData[];
        logger.info("Retrieved mock customers", {
          count: data.length,
        });
        return data;
      }

      const { data, error } = await supabase.from("customers").select("*");
      if (error) {
        logger.error("Failed to fetch customers from Supabase", error);
        throw error;
      }
      logger.info("Retrieved customers from Supabase", {
        count: data.length,
      });
      return data;
    } catch (error) {
      logger.error("Error in getCustomers", error as Error);
      throw error;
    }
  }

  async createCustomer(customerData: CustomerData) {
    logger.debug("Creating customer", {
      customerData,
      environment: envConfig.environment,
      supabaseUrl: envConfig.supabaseUrl,
      isSupabase: envConfig.isSupabase,
    });

    try {
      if (envConfig.useMockData) {
        const customers = getMockData("customers") as CustomerData[];
        const newCustomer = {
          id: customers.length + 1,
          ...customerData,
          created_at: new Date().toISOString(),
        };
        customers.push(newCustomer);
        logger.info("Created mock customer", { customerId: newCustomer.id });
        return newCustomer;
      }

      if (envConfig.isSupabase && supabase) {
        logger.debug("Attempting to create customer in Supabase", {
          supabaseUrl: envConfig.supabaseUrl,
          customerData,
        });

        const { data, error } = await supabase
          .from("customers")
          .insert([customerData])
          .select()
          .single();

        if (error) {
          logger.error("Failed to create customer in Supabase", error, {
            errorCode: error.code,
            errorMessage: error.message,
            errorDetails: error.details,
            customerData,
          });
          throw error;
        }

        logger.info("Successfully created customer in Supabase", {
          customerId: data.id,
          customerData: data,
        });
        return data;
      }

      throw new Error("Invalid environment configuration");
    } catch (error) {
      logger.error("Error in createCustomer", error as Error, {
        customerData,
        environment: envConfig.environment,
      });
      throw error;
    }
  }

  // Appointments
  async getAppointments() {
    if (envConfig.useMockData) {
      return getMockData("appointments");
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*, customers(*), services(*)");
    if (error) throw error;
    return data;
  }

  async createAppointment(appointmentData: AppointmentData) {
    if (envConfig.useMockData) {
      const appointments = getMockData("appointments") as AppointmentData[];
      const newAppointment = {
        id: appointments.length + 1,
        ...appointmentData,
        created_at: new Date().toISOString(),
      };
      appointments.push(newAppointment);
      return newAppointment;
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Services
  async getServices() {
    if (envConfig.useMockData) {
      return getMockData("services");
    }

    const { data, error } = await supabase.from("services").select("*");
    if (error) throw error;
    return data;
  }

  // Payments
  async getPayments() {
    if (envConfig.useMockData) {
      return getMockData("payments");
    }

    const { data, error } = await supabase
      .from("payments")
      .select("*, appointments(*)");
    if (error) throw error;
    return data;
  }

  async createPayment(paymentData: PaymentData) {
    if (envConfig.useMockData) {
      const payments = getMockData("payments") as PaymentData[];
      const newPayment = {
        id: payments.length + 1,
        ...paymentData,
        created_at: new Date().toISOString(),
      };
      payments.push(newPayment);
      return newPayment;
    }

    const { data, error } = await supabase
      .from("payments")
      .insert(paymentData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
