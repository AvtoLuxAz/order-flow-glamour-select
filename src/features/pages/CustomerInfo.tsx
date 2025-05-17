import { useState, useEffect } from "react";
import supabase from "../../lib/supabase";

interface CustomerData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  date?: string;
  time?: string;
  notes?: string;
}

interface CustomerInfoProps {
  customerId?: string;
  onClose: () => void;
  onSubmit: (data: CustomerData) => Promise<void>;
}

function CustomerInfo({ customerId, onClose, onSubmit }: CustomerInfoProps) {
  const [formData, setFormData] = useState<Omit<CustomerData, "id">>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (customerId) {
      // Fetch customer data if editing
      const fetchCustomer = async () => {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", customerId)
          .single();

        if (error) {
          console.error("Error fetching customer:", error);
          return;
        }

        if (data) {
          setFormData({
            name: data.name,
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            date: data.date || "",
            time: data.time || "",
            notes: data.notes || "",
          });
        }
      };

      fetchCustomer();
    }
  }, [customerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        ...(customerId && { id: customerId }),
      });
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled={!!customerId}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={!!customerId}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={!!customerId}
        />
      </div>

      <div>
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender
        </label>
        <select
          id="gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={!!customerId}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date || ""}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700"
        >
          Time
        </label>
        <input
          type="time"
          id="time"
          value={formData.time || ""}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {customerId ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

export default CustomerInfo;
