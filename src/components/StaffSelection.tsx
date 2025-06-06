
import { useEffect, type FC } from "react";
import { useStaffByService } from "@/hooks/use-staff-by-service";
import { useOrder } from "@/context/OrderContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

interface StaffSelectionProps {
  serviceId: string; // Changed from number to string
  onStaffSelect: (staffId: string, staffName: string) => void;
  selectedStaffId?: string;
}

const StaffSelection: FC<StaffSelectionProps> = ({
  serviceId,
  onStaffSelect,
  selectedStaffId,
}) => {
  const { fetchStaffByService, getStaffForService } = useStaffByService();
  const { orderState } = useOrder();

  // Get service-specific data
  const { staff, loading, error } = getStaffForService(serviceId);

  useEffect(() => {
    if (serviceId && orderState.appointmentDate) {
      console.log('StaffSelection: Fetching staff for service:', serviceId, 'date:', orderState.appointmentDate);
      fetchStaffByService(serviceId, orderState.appointmentDate);
    } else if (serviceId) {
      console.log('StaffSelection: Fetching staff for service without date:', serviceId);
      fetchStaffByService(serviceId);
    }
  }, [serviceId, orderState.appointmentDate, fetchStaffByService]);

  if (loading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          İşçi seçin
        </p>
        <div className="grid grid-cols-1 gap-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          İşçi seçin
        </p>
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">Xəta: {error}</p>
          <p className="text-xs text-red-500 mt-1">
            Xidmət ID: {serviceId}, Tarix: {orderState.appointmentDate?.toISOString()}
          </p>
        </div>
      </div>
    );
  }

  if (!staff || staff.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          İşçi seçin
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-700">
            Bu xidmət və tarix üçün uyğun işçi tapılmadı
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Xidmət ID: {serviceId} | Tarix: {orderState.appointmentDate?.toLocaleDateString() || 'Seçilməyib'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        İşçi seçin
      </p>
      <p className="text-xs text-green-600">
        {staff.length} uyğun işçi tapıldı
      </p>
      <div className="grid grid-cols-1 gap-2">
        {staff.map((staffMember) => (
          <Card
            key={staffMember.id}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedStaffId === staffMember.id
                ? "border-glamour-700 bg-glamour-50"
                : "border-gray-200"
            }`}
            onClick={() =>
              onStaffSelect(
                staffMember.id,
                staffMember.full_name || staffMember.name || "Naməlum İşçi"
              )
            }
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-glamour-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {staffMember.full_name || staffMember.name || "Naməlum İşçi"}
                </p>
                {staffMember.position && (
                  <p className="text-xs text-gray-500">
                    {staffMember.position}
                  </p>
                )}
                <p className="text-xs text-gray-400">ID: {staffMember.id}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffSelection;
