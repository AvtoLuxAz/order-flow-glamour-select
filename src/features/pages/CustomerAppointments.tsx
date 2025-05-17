import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

interface Appointment {
  id: string;
  date: string;
  time?: string;
  status: string;
  notes?: string;
  created_at: string;
  // Add more fields as needed
}

interface CustomerAppointmentsProps {
  customerId: string;
}

const CustomerAppointments = ({ customerId }: CustomerAppointmentsProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", customerId)
        .order("date", { ascending: false });
      if (!error && data) setAppointments(data);
      setLoading(false);
    };
    if (customerId) fetchAppointments();
  }, [customerId]);

  if (loading) return <div>Loading...</div>;
  if (!appointments.length) return <div>No appointments found.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: "#2ecc71" }}>
        Appointments
      </h2>
      <ul className="space-y-2">
        {appointments.map((appt) => (
          <li key={appt.id}>
            <button
              className="w-full text-left p-2 border rounded hover:bg-[#eafaf1]"
              style={{
                borderColor: selected?.id === appt.id ? "#2ecc71" : "#e5e7eb",
                background: selected?.id === appt.id ? "#eafaf1" : "white",
                color: selected?.id === appt.id ? "#2ecc71" : "inherit",
                fontWeight: selected?.id === appt.id ? "bold" : "normal",
              }}
              onClick={() => setSelected(appt)}
            >
              {appt.date} {appt.time} -{" "}
              <span
                className="capitalize px-2 py-1 rounded"
                style={{
                  background:
                    appt.status === "confirmed" ? "#2ecc71" : "#f3f4f6",
                  color: appt.status === "confirmed" ? "white" : "#374151",
                }}
              >
                {appt.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div
          className="mt-4 p-4 border rounded"
          style={{ background: "#eafaf1", borderColor: "#2ecc71" }}
        >
          <h3 className="font-semibold mb-2" style={{ color: "#2ecc71" }}>
            Appointment Details
          </h3>
          <p>
            <b>Date:</b> {selected.date}
          </p>
          <p>
            <b>Time:</b> {selected.time}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                background: "#2ecc71",
                color: "white",
                borderRadius: "4px",
                padding: "2px 8px",
                fontWeight: "bold",
              }}
            >
              {selected.status}
            </span>
          </p>
          {selected.notes && (
            <p>
              <b>Notes:</b> {selected.notes}
            </p>
          )}
          <button
            className="mt-2 underline"
            style={{
              color: "#2ecc71",
              fontWeight: "bold",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerAppointments;
