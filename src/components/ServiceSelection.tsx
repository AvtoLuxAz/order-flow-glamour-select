
import React, { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Info, Search } from "lucide-react";
import { Service } from "@/models/service.model";
import DiscountBadge from "@/components/ui/discount-badge";
import PriceDisplay from "@/components/ui/price-display";
import { useLanguage } from "@/context/LanguageContext";
import StaffSelection from "./StaffSelection";
import { formatDurationMultiLanguage } from "@/utils/validation";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

const ServiceSelection = () => {
  const { selectService, unselectService, orderState, addServiceProvider } = useOrder();
  const { t } = useLanguage();
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const selectedServices = orderState?.selectedServices || [];

  useEffect(() => {
    fetchServices();
  }, [currentPage, searchTerm]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("services")
        .select("*", { count: "exact" })
        .order("discount", { ascending: false })
        .order("created_at", { ascending: false });

      if (searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      if (data) {
        console.log("Raw service data from DB:", data);
        // Ensure service IDs are strings for UI consistency
        const fixedData = data.map((service) => ({
          ...service,
          id: String(service.id),
        })) as Service[];

        console.log("Fixed service data with string IDs:", fixedData);
        setServices(fixedData);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleServiceToggle = (service: Service) => {
    const serviceId = String(service.id);
    console.log("ServiceSelection: Toggling service", serviceId);
    console.log("ServiceSelection: Current selected services:", selectedServices);
    console.log("ServiceSelection: Is service selected?", selectedServices.includes(serviceId));
    
    if (selectedServices.includes(serviceId)) {
      console.log("ServiceSelection: Unselecting service", serviceId);
      unselectService(serviceId);
      setExpandedServices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
      setSelectedStaff((prev) => {
        const newSelected = { ...prev };
        delete newSelected[serviceId];
        return newSelected;
      });
    } else {
      console.log("ServiceSelection: Selecting service", serviceId);
      selectService(serviceId);
      setExpandedServices((prev) => new Set([...prev, serviceId]));
    }
  };

  const handleStaffSelect = (serviceId: string, staffId: string, staffName: string) => {
    console.log("ServiceSelection: Staff selected", { serviceId, staffId, staffName });
    setSelectedStaff((prev) => ({
      ...prev,
      [serviceId]: staffId,
    }));
    addServiceProvider(serviceId, staffName);
  };

  const toggleServiceExpansion = (serviceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      newSet.has(serviceId) ? newSet.delete(serviceId) : newSet.add(serviceId);
      return newSet;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalDuration = selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return total + (service?.duration || 0);
  }, 0);

  if (loading && currentPage === 1) {
    return <div>Xidmətlər yüklənir...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Xidmət axtarın..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {searchTerm
            ? `"${searchTerm}" üçün ${totalCount} nəticə`
            : `Cəmi ${totalCount} xidmət`}
        </p>
      </div>

      {totalDuration > 0 && (
        <div className="bg-glamour-50 p-4 rounded-lg">
          <h3 className="font-medium text-glamour-800 mb-2">Ümumi müddət</h3>
          <p className="text-lg font-semibold text-glamour-700">
            {formatDurationMultiLanguage(totalDuration, t)}
          </p>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Debug İnfo:</h4>
        <p className="text-xs text-blue-600">
          Seçilmiş xidmətlər: {JSON.stringify(selectedServices)}
        </p>
        <p className="text-xs text-blue-600">
          Xidmət sayı: {selectedServices.length}
        </p>
      </div>

      {services.map((service) => {
        const serviceId = String(service.id);
        const isSelected = selectedServices.includes(serviceId);
        const isExpanded = expandedServices.has(serviceId);

        console.log(`Service ${serviceId} (${service.name}): isSelected=${isSelected}, includes check=${selectedServices.includes(serviceId)}`);

        return (
          <Card
            key={serviceId}
            className={`transition-all relative ${
              isSelected
                ? "border-glamour-700 bg-glamour-50 ring-2 ring-glamour-500"
                : "border-gray-200 hover:border-glamour-300"
            }`}
          >
            <DiscountBadge discount={service.discount || 0} />
            <div
              className="p-4 cursor-pointer"
              onClick={() => handleServiceToggle(service)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      {service.name}
                      {isSelected && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-glamour-100 text-glamour-800">
                          ✓ Seçildi
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <PriceDisplay
                        price={service.price}
                        discount={service.discount}
                        className="text-right"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {formatDurationMultiLanguage(service.duration, t)}
                      </span>
                    </div>
                  </div>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {service.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-400">
                    ID: {serviceId} | Seçili: {isSelected ? 'Bəli' : 'Xeyr'}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => toggleServiceExpansion(serviceId, e)}
                  className="text-glamour-700 hover:text-glamour-800 h-8 w-8 p-0"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isSelected && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <StaffSelection
                  serviceId={serviceId}
                  onStaffSelect={(staffId, staffName) =>
                    handleStaffSelect(serviceId, staffId, staffName)
                  }
                  selectedStaffId={selectedStaff[serviceId]}
                />
              </div>
            )}
          </Card>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {services.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchTerm
              ? `"${searchTerm}" üçün nəticə tapılmadı`
              : "Heç bir xidmət tapılmadı"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
