import React, { createContext, useContext, useState, ReactNode } from "react";

interface CustomerInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  date?: string;
  time?: string;
  notes?: string;
  customerId?: string;
}

interface Order {
  id?: string;
  customerInfo?: CustomerInfo;
  services?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total?: number;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  date?: string;
  notes?: string;
}

interface OrderState {
  currentStep: number;
  order: Order | null;
  customerInfo: CustomerInfo | null;
}

interface OrderContextType {
  orderState: OrderState;
  setOrder: (order: Order | null) => void;
  setCurrentStep: (step: number) => void;
  updateCustomerInfo: (customerInfo: CustomerInfo) => void;
  goToStep: (step: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orderState, setOrderState] = useState<OrderState>({
    currentStep: 1,
    order: null,
    customerInfo: null,
  });

  const setOrder = (order: Order | null) => {
    setOrderState((prev) => ({ ...prev, order }));
  };

  const setCurrentStep = (step: number) => {
    setOrderState((prev) => ({ ...prev, currentStep: step }));
  };

  const updateCustomerInfo = (customerInfo: CustomerInfo) => {
    setOrderState((prev) => ({
      ...prev,
      customerInfo,
      order: {
        ...prev.order,
        customerInfo,
      },
    }));
  };

  const goToStep = (step: number) => {
    setOrderState((prev) => ({ ...prev, currentStep: step }));
  };

  return (
    <OrderContext.Provider
      value={{
        orderState,
        setOrder,
        setCurrentStep,
        updateCustomerInfo,
        goToStep,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
