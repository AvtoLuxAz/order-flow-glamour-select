import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, RefreshCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";
type Appointment = Database["public"]["Tables"]["appointments"]["Row"];

interface AppointmentActionsProps {
  appointmentId: string;
  status: string;
  onStatusChange: (status: string) => void;
  onShowCustomerFlow: (prefill?: {
    services?: number[];
    products?: number[];
  }) => void;
  appointment?: Appointment;
}

export function AppointmentActions({
  appointmentId,
  status,
  onStatusChange,
  onShowCustomerFlow,
  appointment,
}: AppointmentActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateAppointmentStatus = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onStatusChange(status === "pending" ? "confirmed" : "completed");
    },
    onError: (error) => {
      toast.error("Failed to update appointment status");
      console.error(error);
    },
  });

  const createPayment = useMutation({
    mutationFn: async () => {
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .select("*, services(price)")
        .eq("id", appointmentId)
        .single();

      if (appointmentError) throw appointmentError;

      const { error: paymentError } = await supabase.from("payments").insert({
        appointment_id: appointmentId,
        amount: appointment.services.price,
        status: "pending",
        type: "cash",
      });

      if (paymentError) throw paymentError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create payment");
      console.error(error);
    },
  });

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await updateAppointmentStatus.mutateAsync("confirmed");
      await createPayment.mutateAsync();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateAppointmentStatus.mutateAsync("rejected");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await updateAppointmentStatus.mutateAsync("completed");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "paid") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleComplete}
        disabled={isLoading}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onShowCustomerFlow({
              services: appointment?.service_id
                ? [Number(appointment.service_id)]
                : [],
              products: [],
            })
          }
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleComplete}
        disabled={isLoading}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleConfirm}
        disabled={isLoading}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReject}
        disabled={isLoading}
      >
        <XCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
