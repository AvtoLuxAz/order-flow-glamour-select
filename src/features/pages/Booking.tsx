import React from "react";
import { OrderProvider } from "@/context/OrderContext";
import CheckoutFlow from "@/shared/components/CheckoutFlow";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">
            Book Your Appointment
          </h1>
          <OrderProvider>
            <CheckoutFlow />
          </OrderProvider>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
