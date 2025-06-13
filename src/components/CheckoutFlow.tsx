
import React, { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";
import ServiceSelection from "./ServiceSelection";
import ProductSelection from "./ProductSelection";
import BookingDatePicker from "./BookingDatePicker";
import CustomerInfo from "./CustomerInfo";
import PaymentDetails from "./PaymentDetails";
import BookingConfirmation from "./BookingConfirmation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type BookingMode = "customer" | "admin";

interface CheckoutFlowProps {
  bookingMode: BookingMode;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ bookingMode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { orderState, resetOrder, setAppointmentDate } = useOrder();
  const { t } = useLanguage();

  const steps = [
    { key: "services", label: t("booking.selectServices"), component: ServiceSelection },
    { key: "products", label: t("booking.selectProducts"), component: ProductSelection },
    { key: "date", label: t("booking.selectDate"), component: BookingDatePicker },
    { key: "customer", label: t("booking.customerInfo"), component: CustomerInfo },
    { key: "payment", label: t("booking.paymentDetails"), component: PaymentDetails },
    { key: "confirmation", label: t("booking.confirmation"), component: BookingConfirmation },
  ];

  // Debug logging for order state
  useEffect(() => {
    console.log("CheckoutFlow: Current step:", currentStep);
    console.log("CheckoutFlow: Selected services:", orderState.selectedServices);
    console.log("CheckoutFlow: Service providers:", orderState.serviceProviders);
    console.log("CheckoutFlow: Order state:", orderState);
  }, [currentStep, orderState.selectedServices, orderState.serviceProviders, orderState]);

  const canProceedToNextStep = () => {
    console.log("CheckoutFlow: Checking if can proceed from step:", currentStep);
    
    switch (currentStep) {
      case 0: // Services
        const hasServices = orderState.selectedServices && orderState.selectedServices.length > 0;
        const hasServiceProviders = orderState.serviceProviders && orderState.serviceProviders.length > 0;
        const canProceed = hasServices && hasServiceProviders;
        
        console.log("CheckoutFlow: Services step check:", {
          hasServices,
          hasServiceProviders,
          canProceed,
          selectedServices: orderState.selectedServices,
          serviceProviders: orderState.serviceProviders
        });
        
        return canProceed;
      case 1: // Products - optional, always can proceed
        return true;
      case 2: // Date
        const hasDateTime = orderState.appointmentDate && orderState.appointmentTime;
        console.log("CheckoutFlow: Date step check:", {
          hasDateTime,
          appointmentDate: orderState.appointmentDate,
          appointmentTime: orderState.appointmentTime
        });
        return hasDateTime;
      case 3: // Customer
        const hasCustomerInfo = (
          orderState.customer &&
          orderState.customer.name &&
          orderState.customer.email &&
          orderState.customer.phone
        );
        console.log("CheckoutFlow: Customer step check:", {
          hasCustomerInfo,
          customer: orderState.customer
        });
        return hasCustomerInfo;
      case 4: // Payment
        const hasPayment = orderState.paymentMethod;
        console.log("CheckoutFlow: Payment step check:", {
          hasPayment,
          paymentMethod: orderState.paymentMethod
        });
        return hasPayment;
      default:
        return true;
    }
  };

  const handleNext = () => {
    console.log("CheckoutFlow: Attempting to go to next step");
    if (currentStep < steps.length - 1 && canProceedToNextStep()) {
      console.log("CheckoutFlow: Moving to step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("CheckoutFlow: Cannot proceed - requirements not met");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || canProceedToNextStep()) {
      setCurrentStep(stepIndex);
    }
  };

  const resetFlow = () => {
    setCurrentStep(0);
    resetOrder();
  };

  // Render the current step component with proper props
  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];
    
    // Handle each step specifically to ensure proper props
    switch (currentStepData.key) {
      case "services":
        return <ServiceSelection />;
      case "products":
        return <ProductSelection />;
      case "date":
        return (
          <BookingDatePicker
            value={orderState.appointmentDate}
            onChange={setAppointmentDate}
          />
        );
      case "customer":
        return <CustomerInfo />;
      case "payment":
        return <PaymentDetails />;
      case "confirmation":
        return <BookingConfirmation />;
      default:
        return null;
    }
  };

  const isProceedDisabled = !canProceedToNextStep();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center cursor-pointer ${
                index <= currentStep ? "text-glamour-700" : "text-gray-400"
              }`}
              onClick={() => handleStepClick(index)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? "bg-glamour-700 text-white"
                    : index === currentStep
                    ? "bg-glamour-100 text-glamour-700 border-2 border-glamour-700"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    index < currentStep ? "bg-glamour-700" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={`${step.key}-label`}
              className={`text-xs text-center ${
                index <= currentStep ? "text-glamour-700" : "text-gray-400"
              }`}
              style={{ width: `${100 / steps.length}%` }}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < steps.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("common.previous")}
          </Button>

          <div className="flex flex-col items-end">
            <Button
              onClick={handleNext}
              disabled={isProceedDisabled}
              className="flex items-center bg-glamour-700 hover:bg-glamour-800"
            >
              {t("common.next")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            {isProceedDisabled && currentStep === 0 && (
              <p className="text-xs text-red-600 mt-1">
                Xidmət və işçi seçilməlidir
              </p>
            )}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</h4>
        <p className="text-xs text-yellow-600">
          Addım: {currentStep + 1}/{steps.length}
        </p>
        <p className="text-xs text-yellow-600">
          Seçilmiş xidmətlər: {orderState.selectedServices?.length || 0}
        </p>
        <p className="text-xs text-yellow-600">
          Xidmət təminatçıları: {orderState.serviceProviders?.length || 0}
        </p>
        <p className="text-xs text-yellow-600">
          Növbəti addıma keçə bilər: {canProceedToNextStep() ? 'Bəli' : 'Xeyr'}
        </p>
      </div>

      {/* Reset Button on Confirmation Step */}
      {currentStep === steps.length - 1 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={resetFlow}
            variant="outline"
            className="border-glamour-700 text-glamour-700 hover:bg-glamour-50"
          >
            {t("booking.newBooking")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutFlow;
