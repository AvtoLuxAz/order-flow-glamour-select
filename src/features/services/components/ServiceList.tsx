import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Service } from "@/models/service.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DiscountBadge from "@/components/ui/discount-badge";
import PriceDisplay from "@/components/ui/price-display";
import { usePagination } from "@/hooks/use-pagination";
import { useLanguage } from "@/context/LanguageContext";

const ServiceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("discount", { ascending: false });

      if (error) {
        console.error("Error fetching services:", error);
        return;
      }

      if (data) {
        setServices(data as Service[]);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description &&
        service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const { paginatedItems, hasNextPage, nextPage } = usePagination({
    items: filteredServices,
    itemsPerPage: 6,
  });

  if (loading) {
    return (
      <div>
        <div className="mb-8 max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={`service-skeleton-${index}`}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("services.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedItems.map((service) => (
          <div
            key={`service-item-${service.id}`}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
          >
            <DiscountBadge discount={service.discount || 0} />

            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {service.image_urls && service.image_urls.length > 0 ? (
                <img
                  src={service.image_urls[0]}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-glamour-600">Xidmət şəkli</p>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-glamour-800 flex-1">
                  {service.name}
                </h2>
                <PriceDisplay
                  price={service.price}
                  discount={service.discount}
                  className="ml-4"
                />
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-1 h-4 w-4" />
                <span>
                  {t("common.duration")}: {service.duration}{" "}
                  {t("common.minutes")}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {service.description || t("services.noDescription")}
              </p>

              {service.benefits && service.benefits.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-glamour-800 mb-2">
                    {t("services.benefits")}:
                  </h3>
                  <ul className="space-y-1">
                    {service.benefits.slice(0, 3).map((benefit, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="text-glamour-700 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                    {service.benefits.length > 3 && (
                      <li className="text-sm text-glamour-700">
                        +{service.benefits.length - 3}{" "}
                        {t("services.moreBenefits")}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <Button
                className="w-full bg-glamour-700 hover:bg-glamour-800"
                asChild
              >
                <Link to={`/services/${service.id}`}>
                  {t("common.viewDetails")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={nextPage} className="px-8">
            {t("common.loadMore")}
          </Button>
        </div>
      )}

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            "{searchTerm}" {t("services.noResults")}
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-6">{t("services.cta")}</p>
        <Button
          size="lg"
          className="bg-glamour-700 hover:bg-glamour-800"
          asChild
        >
          <Link to="/booking">{t("services.bookNow")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ServiceList;
