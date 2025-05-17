import React from "react";
import { useOrder } from "@/context/OrderContext";
import CustomerInfo from "./CustomerInfo";
import ServiceSelection from "./ServiceSelection";
import PaymentDetails from "./PaymentDetails";
import BookingConfirmation from "./BookingConfirmation";
import { useAuth } from "@/hooks/use-auth";

export type BookingMode = "customer" | "staff";

interface CheckoutFlowProps {
  bookingMode?: BookingMode;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  bookingMode = "customer",
}) => {
  const { orderState, setCurrentStep } = useOrder();
  const { currentStep } = orderState;

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div
            className={`step ${currentStep >= 1 ? "active" : ""} ${
              currentStep > 1 ? "cursor-pointer" : ""
            }`}
            onClick={() => handleStepClick(1)}
          >
            <div className="step-number">1</div>
            <div className="step-label">Customer Info</div>
          </div>
          <div className="step-connector"></div>
          <div
            className={`step ${currentStep >= 2 ? "active" : ""} ${
              currentStep > 2 ? "cursor-pointer" : ""
            }`}
            onClick={() => handleStepClick(2)}
          >
            <div className="step-number">2</div>
            <div className="step-label">Services & Products</div>
          </div>
          <div className="step-connector"></div>
          <div
            className={`step ${currentStep >= 3 ? "active" : ""} ${
              currentStep > 3 ? "cursor-pointer" : ""
            }`}
            onClick={() => handleStepClick(3)}
          >
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="step-connector"></div>
          <div
            className={`step ${currentStep >= 4 ? "active" : ""}`}
            onClick={() => handleStepClick(4)}
          >
            <div className="step-number">4</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>
      </div>

      {currentStep === 1 && <CustomerInfo bookingMode={bookingMode} />}
      {currentStep === 2 && <ServiceSelection />}
      {currentStep === 3 && <PaymentDetails />}
      {currentStep === 4 && <BookingConfirmation />}

      <style>
        {`
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .step-label {
          font-size: 14px;
          color: #6b7280;
        }
        .step.active .step-number {
          background-color: #9f7aea;
          color: white;
        }
        .step.active .step-label {
          color: #4b5563;
          font-weight: 600;
        }
        .step-connector {
          flex-grow: 1;
          height: 2px;
          background-color: #e5e7eb;
          margin: 0 8px;
          margin-bottom: 25px;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        `}
      </style>
    </div>
  );
};

export default CheckoutFlow;
