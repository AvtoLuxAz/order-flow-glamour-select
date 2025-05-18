import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Appointment = Database["public"]["Tables"]["appointments"]["Insert"];

export const useCustomerAppointment = () => {
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: async (appointment: Appointment) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    createAppointment,
  };
};
