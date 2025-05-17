import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { logger } from "./logger";

// API client configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        logger.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        if (error.response) {
          const { status } = error.response;

          // Handle 401 Unauthorized
          if (status === 401) {
            // Clear auth token
            localStorage.removeItem("authToken");
            // Redirect to login
            window.location.href = "/auth/login";
            return Promise.reject(error);
          }

          // Handle 403 Forbidden
          if (status === 403) {
            logger.warn("Access forbidden:", error);
            return Promise.reject(
              new Error("You don't have permission to access this resource")
            );
          }

          // Handle 404 Not Found
          if (status === 404) {
            logger.warn("Resource not found:", error);
            return Promise.reject(
              new Error("The requested resource was not found")
            );
          }

          // Handle 422 Validation Error
          if (status === 422) {
            logger.warn("Validation error:", error.response.data);
            return Promise.reject(new Error("Invalid data provided"));
          }

          // Handle 429 Too Many Requests
          if (status === 429) {
            logger.warn("Rate limit exceeded:", error);
            return Promise.reject(
              new Error("Too many requests. Please try again later")
            );
          }

          // Handle 500 Internal Server Error
          if (status >= 500) {
            logger.error("Server error:", error);
            return Promise.reject(
              new Error("An unexpected error occurred. Please try again later")
            );
          }
        }

        // Handle network errors
        if (error.code === "ECONNABORTED") {
          logger.error("Request timeout:", error);
          return Promise.reject(
            new Error("Request timed out. Please try again")
          );
        }

        if (!error.response) {
          logger.error("Network error:", error);
          return Promise.reject(
            new Error("Network error. Please check your connection")
          );
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method with type safety
  public async request<T>(config: InternalAxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error) {
      logger.error("API request failed:", error);
      throw error;
    }
  }

  // Convenience methods
  public async get<T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  public async delete<T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
