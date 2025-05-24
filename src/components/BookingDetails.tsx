import React from "react";
import { format } from "date-fns";
import { useAppointmentData } from "@/hooks/useAppointmentData";
// Assuming AppointmentWithDetails is exported from appointment.service or a model file
// For this example, let's assume it's from the service as it's closely tied to getAppointmentDetails
import { AppointmentWithDetails } from "@/services/appointment.service";

interface BookingDetailsProps {
  appointmentId: string;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ appointmentId }) => {
  const {
    data: appointment,
    isLoading,
    isError,
    error: hookError, // Renaming to avoid conflict with any other 'error' variable if present
  } = useAppointmentData(appointmentId);

  if (isLoading) {
    return <p>Loading appointment details...</p>;
  }

  // hookError is of type Error | null. We need its message for display.
  if (isError) {
    return (
      <p className="text-red-500">
        Error: {hookError?.message || "An unknown error occurred"}
      </p>
    );
  }

  if (!appointment) {
    return <p>No appointment data found for ID {appointmentId}</p>;
  }

  // Assert that we're working with a single appointment
  const appointmentDetails = appointment as AppointmentWithDetails;

  // The structure of `appointment` from `useAppointmentData` (which uses `appointmentService.getAppointmentDetails`)
  // should match the previously defined `AppointmentWithDetails` structure.
  // Specifically, `appointment.customer` can be null.
  // `appointment.services` items will have `service_name`, `staff_name`, `service_price_at_booking`.
  // `appointment.products` items will have `product_name`, `quantity`, `product_price_at_booking`.

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Təyinat #{appointmentDetails.id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">
              {appointmentDetails.status === "completed"
                ? "Tamamlanıb"
                : appointmentDetails.status === "scheduled"
                ? "Planlaşdırılıb"
                : appointmentDetails.status === "cancelled"
                ? "Ləğv edilib"
                : appointmentDetails.status === "confirmed"
                ? "Təsdiqlənib"
                : appointmentDetails.status === "no_show"
                ? "Gəlmədi"
                : appointmentDetails.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tarix</p>
            <p className="font-medium">
              {formatDate(appointmentDetails.appointment_date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vaxt</p>
            <p className="font-medium">
              {appointmentDetails.start_time} - {appointmentDetails.end_time}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ümumi məbləğ</p>
            <p className="font-bold text-xl">{appointmentDetails.total} AZN</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Müştəri məlumatları</h3>
          {appointmentDetails.customer ? (
            <div className="bg-gray-50 p-3 rounded">
              <p>
                <span className="font-medium">Ad:</span>{" "}
                {appointmentDetails.customer.first_name}{" "}
                {appointmentDetails.customer.last_name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {appointmentDetails.customer.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Telefon:</span>{" "}
                {appointmentDetails.customer.phone_number || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Müştəri məlumatı tapılmadı.</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Xidmətlər</h3>
          {appointmentDetails.services &&
          appointmentDetails.services.length > 0 ? (
            <div className="divide-y border rounded overflow-hidden">
              {appointmentDetails.services.map((service) => (
                <div key={service.service_id} className="p-3 bg-white">
                  {" "}
                  {/* Assuming service_id is unique for key */}
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{service.service_name}</p>
                      <p className="text-gray-500 text-sm">
                        {/* Duration is not in AppointmentServiceItem, adapt if needed */}
                        Staff: {service.staff_name}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {service.service_price_at_booking ?? 0} AZN
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Xidmət tapılmadı.</p>
          )}
        </div>

        {appointmentDetails.products &&
          appointmentDetails.products.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Məhsullar</h3>
              <div className="divide-y border rounded overflow-hidden">
                {appointmentDetails.products.map((product) => (
                  <div key={product.product_id} className="p-3 bg-white">
                    {" "}
                    {/* Assuming product_id is unique for key */}
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{product.product_name}</p>
                        <p className="text-gray-500 text-sm">
                          {product.quantity} ədəd
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(product.product_price_at_booking ?? 0) *
                          product.quantity}{" "}
                        AZN
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default BookingDetails;
