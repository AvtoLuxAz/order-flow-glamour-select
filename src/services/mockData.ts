import { envConfig } from "../config/environment";

// Mock data types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: number;
  customer_id: number;
  service_id: number;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Staff {
  id: number;
  name: string;
  role: "stylist" | "technician" | "manager";
}

interface Payment {
  id: number;
  appointment_id: number;
  amount: number;
  status: "pending" | "completed" | "failed";
}

export interface MockData {
  customers: Customer[];
  appointments: Appointment[];
  services: Service[];
  products: Product[];
  staff: Staff[];
  payments: Payment[];
  [key: string]: unknown;
}

// Helper function to generate random date within range
const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
};

// Helper function to generate random amount
const getRandomAmount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate mock data based on current date
const generateMockData = () => {
  const today = new Date();
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(today.getDate() - 5);
  const fiveDaysLater = new Date(today);
  fiveDaysLater.setDate(today.getDate() + 5);

  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+0987654321",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1122334455",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
  ];

  const services = [
    {
      id: 1,
      name: "Haircut",
      price: 50,
      duration: 30,
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 2,
      name: "Manicure",
      price: 30,
      duration: 45,
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 3,
      name: "Facial",
      price: 80,
      duration: 60,
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
  ];

  const appointments = [
    {
      id: 1,
      customer_id: 1,
      service_id: 1,
      date: getRandomDate(fiveDaysAgo, fiveDaysLater),
      status: "scheduled",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 2,
      customer_id: 2,
      service_id: 2,
      date: getRandomDate(fiveDaysAgo, fiveDaysLater),
      status: "completed",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 3,
      customer_id: 3,
      service_id: 3,
      date: getRandomDate(fiveDaysAgo, fiveDaysLater),
      status: "cancelled",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
  ];

  const payments = [
    {
      id: 1,
      appointment_id: 1,
      amount: getRandomAmount(30, 100),
      status: "completed",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 2,
      appointment_id: 2,
      amount: getRandomAmount(30, 100),
      status: "pending",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
    {
      id: 3,
      appointment_id: 3,
      amount: getRandomAmount(30, 100),
      status: "failed",
      created_at: getRandomDate(fiveDaysAgo, fiveDaysLater),
    },
  ];

  return {
    customers,
    services,
    appointments,
    payments,
  };
};

// Mock data storage
const mockData = generateMockData();

export const getMockData = (key: string): unknown => {
  if (!envConfig.useMockData) {
    throw new Error("Mock data is only available in local environment");
  }
  return mockData[key as keyof typeof mockData];
};

export const setMockData = (key: string, value: unknown): void => {
  if (!envConfig.useMockData) {
    throw new Error("Mock data is only available in local environment");
  }
  mockData[key as keyof typeof mockData] = value as any;
};
