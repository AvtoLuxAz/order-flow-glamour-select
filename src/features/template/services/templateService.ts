import { createClient } from "@supabase/supabase-js";
import { ApiService } from "@/lib/services/api.service";
import { config } from "@/config/env";
import type {
  Template,
  TemplateFormData,
  TemplateFilters,
  TemplateListResponse,
} from "../types";

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.apiKey);

export class TemplateService extends ApiService {
  private table = "templates";

  // Get all templates with filters
  async getAll(filters?: TemplateFilters): Promise<TemplateListResponse> {
    if (config.usesMockData) {
      let query = supabase.from(this.table).select("*", { count: "exact" });

      // Apply filters
      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      // Apply sorting
      if (filters?.sortBy) {
        query = query.order(filters.sortBy, {
          ascending: filters.sortOrder === "asc",
        });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data as Template[],
        meta: {
          total: count || 0,
          page: 1,
          limit: 10,
        },
      };
    }

    return this.get<TemplateListResponse>("/templates", { params: filters });
  }

  // Get a single template
  async getById(id: number): Promise<Template> {
    if (config.usesMockData) {
      const { data, error } = await supabase
        .from(this.table)
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Template;
    }

    return this.get<Template>(`/templates/${id}`);
  }

  // Create a new template
  async create(template: TemplateFormData): Promise<Template> {
    if (config.usesMockData) {
      const { data, error } = await supabase
        .from(this.table)
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data as Template;
    }

    return this.post<Template>("/templates", template);
  }

  // Update a template
  async update(
    id: number,
    template: Partial<TemplateFormData>
  ): Promise<Template> {
    if (config.usesMockData) {
      const { data, error } = await supabase
        .from(this.table)
        .update(template)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Template;
    }

    return this.put<Template>(`/templates/${id}`, template);
  }

  // Delete a template
  async delete(id: number): Promise<void> {
    if (config.usesMockData) {
      const { error } = await supabase.from(this.table).delete().eq("id", id);

      if (error) throw error;
      return;
    }

    return this.delete(`/templates/${id}`);
  }

  // Subscribe to real-time updates
  subscribeToUpdates(callback: (payload: any) => void) {
    return supabase
      .channel("templates_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: this.table,
        },
        callback
      )
      .subscribe();
  }
}

// Create a singleton instance
export const templateService = new TemplateService();
