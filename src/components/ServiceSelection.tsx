import React, { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Search, Package, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { serviceService } from "@/services/service.service";
import { productService } from "@/services/product.service";
import { appointmentService } from "@/services/appointment.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  image_url?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  stock_quantity: number;
}

interface Staff {
  id: number;
  name: string;
  position: string;
  specializations: string[];
}

export interface ServiceProvider {
  serviceId: number;
  name: string;
}

const ServiceSelection = () => {
  const {
    orderState,
    selectService,
    unselectService,
    selectProduct,
    unselectProduct,
    goToStep,
    updateTotal,
    updateServiceProviders,
  } = useOrder();
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>(
    orderState.selectedServices || []
  );
  const [selectedProducts, setSelectedProducts] = useState<number[]>(
    orderState.selectedProducts || []
  );
  const [selectedStaff, setSelectedStaff] = useState<Record<number, string>>(
    {}
  );
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [view, setView] = useState<"services" | "products">("services");
  const [recommendedProducts, setRecommendedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, productsRes] = await Promise.all([
          serviceService.getAll(),
          productService.getAll(),
        ]);

        if (servicesRes.error) {
          console.error("Error fetching services:", servicesRes.error);
          toast({
            title: "Error loading services",
            description: servicesRes.error,
            variant: "destructive",
          });
          return;
        }

        if (productsRes.error) {
          console.error("Error fetching products:", productsRes.error);
          toast({
            title: "Error loading products",
            description: productsRes.error,
            variant: "destructive",
          });
          return;
        }

        setServices(servicesRes.data || []);
        setProducts(productsRes.data || []);

        // Initialize staff selection for any already-selected services
        const initialStaffSelections: Record<number, string> = {};
        orderState.serviceProviders.forEach((provider) => {
          initialStaffSelections[provider.serviceId] = provider.name;
        });
        setSelectedStaff(initialStaffSelections);
      } catch (error) {
        console.error("Failed to load services and products:", error);
        toast({
          title: "Error loading data",
          description:
            error instanceof Error
              ? error.message
              : "Could not load services or products information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderState.serviceProviders]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const productPromises = selectedServices.map((serviceId) =>
          serviceService.getRelatedProducts(serviceId)
        );
        const results = await Promise.all(productPromises);

        const allRelatedProducts = results
          .filter((result) => !result.error)
          .flatMap((result) => result.data || []);

        setRecommendedProducts([...new Set(allRelatedProducts)]);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    if (selectedServices.length > 0) {
      fetchRelatedProducts();
    } else {
      setRecommendedProducts([]);
    }
  }, [selectedServices]);

  const calculateTotalDuration = () => {
    const duration = services
      .filter((service) => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.duration, 0);

    setTotalDuration(duration);
    return duration;
  };

  const handleServiceToggle = async (serviceId: number) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setSelectedServices(updatedServices);

    // Initialize staff selection for this service if it's newly selected
    if (!selectedServices.includes(serviceId) && !selectedStaff[serviceId]) {
      setSelectedStaff((prev) => ({ ...prev, [serviceId]: "" }));
    }

    // Calculate new total duration
    calculateTotalDuration();
  };

  const handleProductToggle = (productId: number) => {
    const updatedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter((id) => id !== productId)
      : [...selectedProducts, productId];

    setSelectedProducts(updatedProducts);
  };

  const handleStaffSelect = async (serviceId: number, staffName: string) => {
    const staffMember = staff.find((s) => s.name === staffName);
    if (!staffMember) return;

    // Check staff availability
    const availabilityCheck = await appointmentService.checkStaffAvailability(
      staffMember.id,
      orderState.date,
      orderState.startTime,
      orderState.endTime || ""
    );

    if (availabilityCheck.error) {
      toast({
        title: "Error checking availability",
        description: availabilityCheck.error,
        variant: "destructive",
      });
      return;
    }

    if (!availabilityCheck.data) {
      toast({
        title: "Staff not available",
        description: `${staffName} is not available at this time`,
        variant: "destructive",
      });
      return;
    }

    setSelectedStaff((prev) => ({ ...prev, [serviceId]: staffName }));
  };

  const calculateTotal = () => {
    const servicesTotal = services
      .filter((service) => selectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0);

    const productsTotal = products
      .filter((product) => selectedProducts.includes(product.id))
      .reduce((sum, product) => sum + product.price, 0);

    return servicesTotal + productsTotal;
  };

  const handleContinue = async () => {
    // Validate that all selected services have a staff member assigned
    const missingStaff = selectedServices.some(
      (serviceId) => !selectedStaff[serviceId]
    );

    if (missingStaff) {
      toast({
        title: "Missing staff selection",
        description: "Please assign a staff member to each service",
        variant: "destructive",
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "No services selected",
        description: "Please select at least one service to continue",
        variant: "destructive",
      });
      return;
    }

    // Check for appointment conflicts
    const conflictCheck = await appointmentService.checkAppointmentConflicts(
      orderState.date,
      orderState.startTime,
      orderState.endTime || ""
    );

    if (conflictCheck.error) {
      toast({
        title: "Error checking conflicts",
        description: conflictCheck.error,
        variant: "destructive",
      });
      return;
    }

    if (!conflictCheck.data) {
      toast({
        title: "Time slot not available",
        description: "This time slot is already booked",
        variant: "destructive",
      });
      return;
    }

    // Clear existing selections
    orderState.selectedServices.forEach((serviceId) =>
      unselectService(serviceId)
    );
    orderState.selectedProducts.forEach((productId) =>
      unselectProduct(productId)
    );

    // Add new selections
    selectedServices.forEach((serviceId) => selectService(serviceId));
    selectedProducts.forEach((productId) => selectProduct(productId));

    // Update total
    updateTotal(calculateTotal());

    // Prepare service providers information
    const serviceProviders: ServiceProvider[] = [];
    Object.entries(selectedStaff).forEach(([serviceId, staffName]) => {
      const serviceIdNum = parseInt(serviceId, 10);
      if (selectedServices.includes(serviceIdNum) && staffName) {
        serviceProviders.push({
          serviceId: serviceIdNum,
          name: staffName,
        });
      }
    });

    // Update service providers in context
    updateServiceProviders(serviceProviders);

    // Go to payment step
    goToStep(3);
  };

  const handleBack = () => {
    goToStep(1);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-glamour-800">
            Select Services & Products
          </h2>

          <div className="flex gap-2 mb-4">
            <Button
              variant={view === "services" ? "default" : "outline"}
              onClick={() => setView("services")}
              className={
                view === "services" ? "bg-glamour-700 hover:bg-glamour-800" : ""
              }
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Services
              {selectedServices.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white text-glamour-700"
                >
                  {selectedServices.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={view === "products" ? "default" : "outline"}
              onClick={() => setView("products")}
              className={
                view === "products" ? "bg-glamour-700 hover:bg-glamour-800" : ""
              }
            >
              <Package className="h-4 w-4 mr-2" />
              Products
              {selectedProducts.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-white text-glamour-700"
                >
                  {selectedProducts.length}
                </Badge>
              )}
            </Button>
          </div>

          {totalDuration > 0 && (
            <div className="mb-4 flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              Total Duration: {totalDuration} minutes
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              Loading services and products...
            </div>
          ) : (
            <>
              {view === "services" && (
                <div className="mb-8">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search services..."
                      value={serviceSearchTerm}
                      onChange={(e) => setServiceSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-6">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No services match your search
                      </div>
                    ) : (
                      filteredServices.map((service) => (
                        <div
                          key={service.id}
                          className="border rounded-md p-4 hover:bg-glamour-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={selectedServices.includes(service.id)}
                              onCheckedChange={() =>
                                handleServiceToggle(service.id)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`service-${service.id}`}
                                className="font-medium text-base cursor-pointer flex justify-between"
                              >
                                <span>{service.name}</span>
                                <span>${service.price}</span>
                              </Label>
                              <p className="text-sm text-gray-500 mt-1">
                                {service.description}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Duration: {service.duration} minutes
                                </p>
                                <Link
                                  to={`/services/${service.id}`}
                                  className="text-xs text-glamour-700 hover:text-glamour-800 underline"
                                >
                                  View details
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Staff selection for this service */}
                          {selectedServices.includes(service.id) &&
                            staff.length > 0 && (
                              <div className="mt-4 pt-3 border-t">
                                <Label
                                  htmlFor={`staff-${service.id}`}
                                  className="block text-sm font-medium mb-1"
                                >
                                  Select Staff for this Service:
                                </Label>
                                <Select
                                  value={selectedStaff[service.id] || ""}
                                  onValueChange={(value) =>
                                    handleStaffSelect(service.id, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a staff member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {staff.map((member) => (
                                      <SelectItem
                                        key={member.id}
                                        value={member.name}
                                      >
                                        {member.name} ({member.position})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Only one staff member can be assigned to each
                                  service
                                </p>
                              </div>
                            )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {view === "products" && (
                <div className="mb-8">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {recommendedProducts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-glamour-700 mb-2">
                        Recommended products based on your services:
                      </h4>
                      <div className="space-y-3">
                        {products
                          .filter((product) =>
                            recommendedProducts.includes(product.id)
                          )
                          .filter(
                            (product, index, self) =>
                              self.findIndex((p) => p.id === product.id) ===
                              index
                          )
                          .map((product) => (
                            <div
                              key={product.id}
                              className="flex items-start space-x-3 border border-glamour-200 bg-glamour-50 rounded-md p-4 hover:bg-glamour-100 transition-colors"
                            >
                              <Checkbox
                                id={`recommended-product-${product.id}`}
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={() =>
                                  handleProductToggle(product.id)
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`recommended-product-${product.id}`}
                                  className="font-medium text-base cursor-pointer flex justify-between"
                                >
                                  <span>{product.name}</span>
                                  <span>${product.price}</span>
                                </Label>
                                <p className="text-sm text-gray-500 mt-1">
                                  {product.description}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <p className="text-xs text-muted-foreground">
                                    Stock: {product.stock_quantity}
                                  </p>
                                  <Link
                                    to={`/products/${product.id}`}
                                    className="text-xs text-glamour-700 hover:text-glamour-800 underline"
                                  >
                                    View details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <Separator className="my-4" />
                    </div>
                  )}

                  <div className="space-y-4">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No products match your search
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-start space-x-3 border rounded-md p-4 hover:bg-glamour-50 transition-colors"
                        >
                          <Checkbox
                            id={`product-${product.id}`}
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() =>
                              handleProductToggle(product.id)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`product-${product.id}`}
                              className="font-medium text-base cursor-pointer flex justify-between"
                            >
                              <span>{product.name}</span>
                              <span>${product.price}</span>
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-muted-foreground">
                                Stock: {product.stock_quantity}
                              </p>
                              <Link
                                to={`/products/${product.id}`}
                                className="text-xs text-glamour-700 hover:text-glamour-800 underline"
                              >
                                View details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="flex justify-between text-lg font-medium">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={selectedServices.length === 0}
              className="bg-glamour-700 hover:bg-glamour-800"
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSelection;
