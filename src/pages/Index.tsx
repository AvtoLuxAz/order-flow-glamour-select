
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ChevronRight, Lock } from "lucide-react";
import HomeServicesSection from "@/components/HomeServicesSection";
import HomeProductsSection from "@/components/HomeProductsSection";
import { useLanguage } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { serviceService } from "@/services/service.service";
import { productService } from "@/services/product.service";

const HeroContent = ({
  t,
  onBookingClick,
}: {
  t: (key: string) => string;
  onBookingClick: () => void;
}) => (
  <div className="text-center lg:text-left">
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in">
      {t("home.title")}
    </h1>
    <p
      className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in"
      style={{ animationDelay: "0.2s" }}
    >
      {t("home.subtitle")}
    </p>
    <div
      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in"
      style={{ animationDelay: "0.4s" }}
    >
      <Button onClick={onBookingClick} size="lg" className="font-semibold">
        {t("home.makeAppointment")}
        <Calendar className="ml-2 h-4 w-4" />
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link to="/services">
          {t("home.viewServices")}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>

    <div
      className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm animate-fade-in"
      style={{ animationDelay: "0.6s" }}
    >
      <h3 className="font-medium text-amber-800 mb-2">{t("admin.login")}</h3>
      <Button asChild variant="default" size="lg" className="w-full">
        <Link to="/login">
          <Lock className="mr-2 h-5 w-5" />
          {t("admin.login")}
        </Link>
      </Button>
      <p className="mt-2 text-xs text-amber-700">{t("admin.demoLogin")}</p>
    </div>
  </div>
);

const HeroSection = ({
  t,
  onBookingClick,
}: {
  t: (key: string) => string;
  onBookingClick: () => void;
}) => (
  <section className="relative bg-gradient-to-b from-primary/10 to-primary/5 px-4 py-12 sm:py-16 md:py-20 lg:py-24">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <HeroContent t={t} onBookingClick={onBookingClick} />
        <div
          className="hidden lg:block animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <img
            src="/placeholder.svg"
            alt="Salon Management System"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
);

const ServicesSection = ({ t }: { t: (key: string) => string }) => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-8">
      {t("home.services")}
    </h2>
    <HomeServicesSection />
  </div>
);

const ProductsSection = ({ t }: { t: (key: string) => string }) => (
  <div>
    <h2 className="text-3xl font-bold text-center mb-8">
      {t("home.products")}
    </h2>
    <HomeProductsSection />
  </div>
);

const ServicesAndProductsSection = ({ t }: { t: (key: string) => string }) => (
  <section className="py-12 px-4 bg-background">
    <div className="container mx-auto max-w-6xl">
      <div className="space-y-12">
        <ServicesSection t={t} />
        <ProductsSection t={t} />
      </div>
    </div>
  </section>
);

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Add error handling for the queries
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: () => serviceService.getAll(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Log errors for debugging
  if (servicesQuery.error) {
    console.log("Services query error:", servicesQuery.error);
  }
  if (productsQuery.error) {
    console.log("Products query error:", productsQuery.error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection t={t} onBookingClick={() => navigate("/booking")} />
        <ServicesAndProductsSection t={t} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
