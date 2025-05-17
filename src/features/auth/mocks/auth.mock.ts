import { User, UserRole } from "../types";

// Mock users for development
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@salon.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: "2",
    email: "staff@salon.com",
    firstName: "Staff",
    lastName: "User",
    role: "staff" as UserRole,
    staffId: 1,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: "3",
    email: "cashier@salon.com",
    firstName: "Cashier",
    lastName: "User",
    role: "cashier" as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
];

// Mock passwords for development (in a real app, passwords would be hashed in the database)
export const mockPasswords: Record<string, string> = {
  "admin@salon.com": "admin123",
  "staff@salon.com": "staff123",
  "cashier@salon.com": "cashier123",
};
