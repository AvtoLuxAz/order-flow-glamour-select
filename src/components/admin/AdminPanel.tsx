import React from "react";
import CashTab from "./CashTab";
import LogViewer from "./LogViewer";

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Admin Panel</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <CashTab />
        </div>
        <div>
          <LogViewer />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
