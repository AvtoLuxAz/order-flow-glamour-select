
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Product } from "@/models/product.model";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductData } from '@/features/products/hooks/useProductData';

const FeaturedProducts = () => {
  const { 
    data: products = [], // Default to empty array if data is undefined
    isLoading, 
    isError, 
    error 
  } = useProductData({ isFeatured: true, limit: 3 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <Skeleton className="h-10 w-10 rounded mb-4" />
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Xəta baş verdi: {error?.message || "Məhsullar yüklənərkən naməlum xəta."}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Seçilmiş məhsul tapılmadı.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/products">
            Bütün məhsullara bax
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {products.map((product: Product) => ( // Explicitly type product here
          <div key={product.id} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="text-primary mb-4">
              {/* Placeholder for an icon, or use a specific product icon if available */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 16v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1"></path>
                <path d="M12 12v4"></path>
                <path d="M8 7v1"></path>
                <path d="M16 7v1"></path>
                <path d="M12 7v1"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">{product.description || "Məhsul haqqında məlumat yoxdur"}</p>
            <div className="text-sm text-muted-foreground">Qiymət: {product.price} AZN</div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button asChild variant="outline">
          <Link to="/products">
            Bütün məhsullara bax
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedProducts;
