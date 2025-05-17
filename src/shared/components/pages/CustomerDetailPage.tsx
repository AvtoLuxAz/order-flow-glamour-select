import React from "react";
import { Customer } from "@/models/customer.model";
import { Card } from "@/shared/components/ui/card";
import { UserCircle, Phone, Mail, Calendar } from "lucide-react";

interface CustomerDetailPageProps {
  customer: Customer;
}

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer,
}) => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
          <UserCircle className="h-12 w-12 text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-glamour-800">
            {customer.name}
          </h2>
          <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
          </div>

          {customer.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">
                {new Date(customer.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {customer.gender && (
            <div className="flex items-center space-x-3">
              <UserCircle className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{customer.gender}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Add more sections as needed, such as appointment history, notes, etc. */}
    </div>
  );
};

export default CustomerDetailPage;
