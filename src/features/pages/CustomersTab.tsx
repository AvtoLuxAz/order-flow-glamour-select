import { useState, useEffect } from "react";
import supabase from "../../lib/supabase";
import CustomerInfo from "./CustomerInfo";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  created_at: string;
}

function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setCustomers(data);
      }
    } catch (err: unknown) {
      console.error("Error fetching customers:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (
    customerData: Omit<Customer, "id" | "created_at">
  ) => {
    try {
      const { error } = await supabase.from("customers").insert([customerData]);

      if (error) throw error;

      await fetchCustomers();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to add customer:", err);
    }
  };

  const handleUpdateCustomer = async (
    customerData: Omit<Customer, "created_at">
  ) => {
    try {
      const { error } = await supabase
        .from("customers")
        .update(customerData)
        .eq("id", customerData.id);

      if (error) throw error;

      await fetchCustomers();
      setSelectedCustomer(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to update customer:", err);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) throw error;

      await fetchCustomers();
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
          onClick={() => {
            setSelectedCustomer(null);
            setIsDialogOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Customer
        </button>
      </div>

      <div className="grid gap-4">
        {customers.map((customer, idx) => (
          <div key={customer.id} className="border p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {idx + 1}. {customer.name}
                </h3>
                <p className="text-xs text-gray-400">Sıra №: {idx + 1}</p>
                {customer.email && <p>Email: {customer.email}</p>}
                {customer.phone && <p>Phone: {customer.phone}</p>}
                {customer.gender && <p>Gender: {customer.gender}</p>}
                <p className="text-sm text-gray-500">
                  Created: {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsDialogOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {selectedCustomer ? "Edit Customer" : "Add Customer"}
            </h3>
            <CustomerInfo
              customerId={selectedCustomer?.id}
              onClose={() => {
                setIsDialogOpen(false);
                setSelectedCustomer(null);
              }}
              onSubmit={
                selectedCustomer ? handleUpdateCustomer : handleAddCustomer
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersTab;
