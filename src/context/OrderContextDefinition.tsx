import { createContext } from "react";
import { OrderContextType } from "./OrderContext.d";

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);
