import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import React from "react";

const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["stylist", "manager", "assistant"]),
  salary_type: z.enum(["fixed", "commission"]),
  salary_amount: z.number().min(0, "Salary amount must be positive"),
  commission_rate: z.number().min(0).max(100).optional(),
  start_date: z.string(),
  status: z.enum(["active", "inactive"]),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  staffId?: string;
  onSuccess?: () => void;
}

const defaultValues: StaffFormData = {
  name: "",
  email: "",
  phone: "",
  role: "stylist",
  salary_type: "fixed",
  salary_amount: 0,
  commission_rate: 0,
  start_date: new Date().toISOString().split("T")[0],
  status: "active",
};

export function StaffForm({ staffId, onSuccess }: StaffFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: existingStaff } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      if (!staffId) return null;
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("id", staffId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!staffId,
  });

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues,
  });

  // Reset form when staffId changes
  React.useEffect(() => {
    if (staffId && existingStaff) {
      form.reset(existingStaff);
    } else {
      form.reset(defaultValues);
    }
  }, [staffId, existingStaff, form]);

  const staffMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      if (staffId) {
        const { error } = await supabase
          .from("staff")
          .update(data)
          .eq("id", staffId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("staff").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success(
        staffId ? "Staff updated successfully" : "Staff added successfully"
      );
      onSuccess?.();
      // Reset form after successful submission
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast.error("Failed to save staff information");
      console.error(error);
    },
  });

  const onSubmit = async (data: StaffFormData) => {
    setIsLoading(true);
    try {
      await staffMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
            aria-describedby={
              form.formState.errors.name ? "name-error" : undefined
            }
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500" id="name-error">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={
              form.formState.errors.email ? "email-error" : undefined
            }
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500" id="email-error">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...form.register("phone")}
            aria-invalid={!!form.formState.errors.phone}
            aria-describedby={
              form.formState.errors.phone ? "phone-error" : undefined
            }
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500" id="phone-error">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={form.watch("role")}
            onValueChange={(value: "stylist" | "manager" | "assistant") =>
              form.setValue("role", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stylist">Stylist</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_type">Salary Type</Label>
          <Select
            value={form.watch("salary_type")}
            onValueChange={(value: "fixed" | "commission") =>
              form.setValue("salary_type", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select salary type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_amount">
            {form.watch("salary_type") === "fixed"
              ? "Salary Amount"
              : "Base Salary"}
          </Label>
          <Input
            id="salary_amount"
            type="number"
            {...form.register("salary_amount", { valueAsNumber: true })}
            aria-invalid={!!form.formState.errors.salary_amount}
            aria-describedby={
              form.formState.errors.salary_amount ? "salary-error" : undefined
            }
          />
          {form.formState.errors.salary_amount && (
            <p className="text-sm text-red-500" id="salary-error">
              {form.formState.errors.salary_amount.message}
            </p>
          )}
        </div>

        {form.watch("salary_type") === "commission" && (
          <div className="space-y-2">
            <Label htmlFor="commission_rate">Commission Rate (%)</Label>
            <Input
              id="commission_rate"
              type="number"
              {...form.register("commission_rate", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.commission_rate}
              aria-describedby={
                form.formState.errors.commission_rate
                  ? "commission-error"
                  : undefined
              }
            />
            {form.formState.errors.commission_rate && (
              <p className="text-sm text-red-500" id="commission-error">
                {form.formState.errors.commission_rate.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            {...form.register("start_date")}
            aria-invalid={!!form.formState.errors.start_date}
            aria-describedby={
              form.formState.errors.start_date ? "date-error" : undefined
            }
          />
          {form.formState.errors.start_date && (
            <p className="text-sm text-red-500" id="date-error">
              {form.formState.errors.start_date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value: "active" | "inactive") =>
              form.setValue("status", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : staffId ? "Update Staff" : "Add Staff"}
      </Button>
    </form>
  );
}
