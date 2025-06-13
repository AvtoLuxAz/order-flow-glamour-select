
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import BookingDetailPage from "@/components/admin/BookingDetailPage";

// Proper TypeScript interfaces
interface CustomerInfo {
  full_name?: string;
  email?: string;
  number?: string;
  gender?: string;
  date?: string;
  time?: string;
  note?: string;
}

interface ServiceInfo {
  id: number;
  name: string;
  price: number;
  discount: number;
  discounted_price: number;
  duration: number;
  user_id?: string;
}

interface ProductInfo {
  id: number;
  name: string;
  price: number;
  discount: number;
  quantity: number;
  discounted_price: number;
}

interface PaymentDetails {
  method?: string;
  paid_amount?: number;
  total_amount?: number;
  discount_amount?: number;
}

interface RequestInfo {
  ip?: string;
  browser?: string;
  device?: string;
  os?: string;
  page?: string;
  entry_time?: string;
}

interface AppointmentJson {
  customer_info?: CustomerInfo;
  services?: ServiceInfo[];
  products?: ProductInfo[];
  payment_details?: PaymentDetails;
  request_info?: RequestInfo;
}

// issued_at is now REQUIRED
interface Invoice {
  id: number;
  invoice_number: string;
  total_amount: number;
  status: string;
  appointment_json: AppointmentJson;
  created_at: string;
  issued_at: string; // ✅ Required
}

// Type guard for AppointmentJson
const isValidAppointmentJson = (data: any): data is AppointmentJson => {
  return data && typeof data === 'object' && !Array.isArray(data);
};

const BookingDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchInvoiceDetails();
    } else {
      setError('Sifariş ID-si URL-də tapılmadı');
      setLoading(false);
    }
  }, [orderId]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('invoice_number', orderId)
        .maybeSingle();

      if (error) {
        setError('Məlumat bazası xətası baş verdi');
        return;
      }

      if (data) {
        if (!data.appointment_json) {
          setError('Sifariş məlumatları natamam: təyinat məlumatları yoxdur');
          return;
        }

        let appointmentJson: AppointmentJson;
        try {
          appointmentJson = typeof data.appointment_json === 'string'
            ? JSON.parse(data.appointment_json)
            : data.appointment_json as AppointmentJson;
        } catch {
          setError('Sifariş məlumatları səhvdir: JSON formatında deyil');
          return;
        }

        if (!isValidAppointmentJson(appointmentJson)) {
          setError('Sifariş məlumatları səhvdir: təyinat məlumatları düzgün formatda deyil');
          return;
        }

        if (!appointmentJson.customer_info) {
          setError('Sifariş məlumatları natamam: müştəri məlumatları yoxdur');
          return;
        }

        // Ensure issued_at is always present
        const invoiceWithIssuedAt: Invoice = {
          ...data,
          appointment_json: appointmentJson,
          issued_at: data.issued_at || data.created_at // fallback
        };

        setInvoice(invoiceWithIssuedAt);
      } else {
        setError('Sifariş tapılmadı');
      }
    } catch {
      setError('Sifariş məlumatları yüklənə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (orderId) fetchInvoiceDetails();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-700 font-medium text-lg">Sifariş məlumatları yüklənir...</span>
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 pb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-slate-800 mb-3">
                  Sifariş Tapılmadı
                </CardTitle>
                <p className="text-slate-600 text-lg">
                  {error || 'Axtardığınız sifariş mövcud deyil.'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-amber-800">
                  <div className="space-y-3">
                    <p className="font-semibold">Debug məlumatları:</p>
                    <div className="space-y-2 text-sm">
                      <p>Sifariş ID: <Badge variant="outline" className="ml-1 font-mono">{orderId || 'Təyin edilməyib'}</Badge></p>
                      <p>Axtarılan invoice_number: <code className="bg-amber-100 px-2 py-1 rounded text-xs">{orderId}</code></p>
                      <p>URL: <code className="bg-amber-100 px-2 py-1 rounded text-xs break-all">{window.location.href}</code></p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  disabled={!orderId}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Yenidən Cəhd Et
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="px-8 py-3 text-lg border-2"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Geri Qayıt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <BookingDetailPage invoice={invoice} />
    </div>
  );
};

export default BookingDetails;
