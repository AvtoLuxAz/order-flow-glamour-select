import { ApiService } from "@/lib/services/api.service";
import {
  AuthFormData,
  AuthResponse,
  User,
  UserFormData,
  UserRole,
} from "../types";
import { ApiResponse } from "@/lib/types/api.types";
import { config } from "@/config/env";
import { mockUsers, mockPasswords } from "../mocks/auth.mock";

export class AuthService extends ApiService {
  // Login method
  async login(credentials: AuthFormData): Promise<ApiResponse<AuthResponse>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

      const user = mockUsers.find((u) => u.email === credentials.email);

      if (!user || mockPasswords[credentials.email] !== credentials.password) {
        return { error: "Invalid email or password" };
      }

      // Generate a mock JWT token
      const token = `mock-jwt-token-${Date.now()}`;
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

      // Update last login time
      user.lastLogin = new Date().toISOString();

      return {
        data: {
          user,
          token,
          expiresAt,
        },
      };
    }

    return this.post<AuthResponse>("/auth/login", credentials);
  }

  // Register new user (for admin to create new staff accounts)
  async register(userData: UserFormData): Promise<ApiResponse<User>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Check if email already exists
      if (mockUsers.some((u) => u.email === userData.email)) {
        return { error: "Email already in use" };
      }

      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: userData.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        role: userData.role,
        staffId: userData.staffId,
        isActive: userData.isActive !== false, // Default to active
        lastLogin: new Date().toISOString(),
      };

      // Add new user to mock database
      mockUsers.push(newUser);

      // Add password to mock passwords store
      if (userData.password) {
        mockPasswords[userData.email] = userData.password;
      }

      return { data: newUser };
    }

    return this.post<User>("/auth/register", userData);
  }

  // Get current user by token
  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

      // In a real app, would validate JWT token, but for mock just return first user
      return { data: mockUsers[0] };
    }

    return this.get<User>("/auth/me");
  }

  // Update user
  async updateUser(
    id: string,
    userData: Partial<UserFormData>
  ): Promise<ApiResponse<User>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const userIndex = mockUsers.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        return { error: "User not found" };
      }

      // Update user data
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData,
        email: userData.email || mockUsers[userIndex].email,
        firstName: userData.firstName || mockUsers[userIndex].firstName,
        lastName: userData.lastName || mockUsers[userIndex].lastName,
        role: userData.role || mockUsers[userIndex].role,
        staffId:
          userData.staffId !== undefined
            ? userData.staffId
            : mockUsers[userIndex].staffId,
        isActive:
          userData.isActive !== undefined
            ? userData.isActive
            : mockUsers[userIndex].isActive,
      };

      // Update password if provided
      if (userData.password) {
        mockPasswords[mockUsers[userIndex].email] = userData.password;
      }

      return { data: mockUsers[userIndex] };
    }

    return this.put<User>(`/users/${id}`, userData);
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate network delay
      return { data: [...mockUsers] };
    }

    return this.get<User[]>("/users");
  }
}

// Create a singleton instance
export const authService = new AuthService();
