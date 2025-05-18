import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { InfoIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StaffPaymentReportProps {
  staffId: string;
}

export function StaffPaymentReport({ staffId }: StaffPaymentReportProps) {
  const {
    data: staff,
    isLoading: isLoadingStaff,
    error: staffError,
  } = useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("id", staffId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    error: appointmentsError,
  } = useQuery({
    queryKey: ["staff-appointments", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          customers (name),
          services (price, name),
          payments (amount, status)
        `
        )
        .eq("staff_id", staffId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const {
    data: salaryTransactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["staff-salary", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salary_transactions")
        .select("*")
        .eq("staff_id", staffId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useQuery({
    queryKey: ["staff-expenses", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("staff_id", staffId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const calculateMonthlyCommission = () => {
    if (!staff || !appointments) return 0;

    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate >= monthStart &&
          appointmentDate <= monthEnd &&
          appointment.payments?.[0]?.status === "paid"
        );
      })
      .reduce((total, appointment) => {
        const servicePrice = appointment.services?.price || 0;
        const commission = (servicePrice * (staff.commission_rate || 0)) / 100;
        return total + commission;
      }, 0);
  };

  const calculateTotalEarnings = () => {
    if (!staff) return 0;
    const commission = calculateMonthlyCommission();
    return staff.salary_type === "fixed"
      ? staff.salary_amount + commission
      : commission;
  };

  const calculateTotalPaid = () => {
    if (!salaryTransactions) return 0;
    return salaryTransactions.reduce((total, transaction) => {
      return total + (transaction.type === "payment" ? transaction.amount : 0);
    }, 0);
  };

  const calculateTotalExpenses = () => {
    if (!expenses) return 0;
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateTotalDue = () => {
    return (
      calculateTotalEarnings() - calculateTotalPaid() - calculateTotalExpenses()
    );
  };

  const isLoading =
    isLoadingStaff ||
    isLoadingAppointments ||
    isLoadingTransactions ||
    isLoadingExpenses;
  const hasError =
    staffError || appointmentsError || transactionsError || expensesError;

  if (hasError) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <InfoIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Payment Report</SheetTitle>
          </SheetHeader>
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>
              Failed to load payment report. Please try again later.
            </AlertDescription>
          </Alert>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Payment Report - {staff?.name || "Loading..."}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Base Salary</p>
                    <p className="text-2xl font-bold">
                      ${staff?.salary_amount.toFixed(2)}
                    </p>
                  </div>
                  {staff?.salary_type !== "fixed" && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Commission Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {staff?.commission_rate}%
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      This Month's Commission
                    </p>
                    <p className="text-2xl font-bold">
                      ${calculateMonthlyCommission().toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earnings
                    </p>
                    <p className="text-2xl font-bold">
                      ${calculateTotalEarnings().toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold">
                      ${calculateTotalPaid().toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold">
                      ${calculateTotalExpenses().toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Due</p>
                    <p className="text-2xl font-bold">
                      ${calculateTotalDue().toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Work History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments?.map((appointment) => {
                      const servicePrice = appointment.services?.price || 0;
                      const commission =
                        (servicePrice * (staff?.commission_rate || 0)) / 100;

                      return (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            {format(new Date(appointment.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{appointment.customers?.name}</TableCell>
                          <TableCell>{appointment.services?.name}</TableCell>
                          <TableCell>${servicePrice.toFixed(2)}</TableCell>
                          <TableCell>${commission.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                appointment.payments?.[0]?.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {appointment.payments?.[0]?.status || "pending"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses?.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {format(new Date(expense.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{expense.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Salary Transactions
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryTransactions?.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="capitalize">
                          {transaction.type}
                        </TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{transaction.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
