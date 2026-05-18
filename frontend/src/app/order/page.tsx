"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface Order {
  id: string;
  quotationId: string;
  clientName: string;
  amount: number;
  scope: string;
  orderDate: string;
  dueDate: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

export default function Order() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD001", quotationId: "Q002", clientName: "XYZ Builders", amount: 32500, scope: "Safety Monitoring", orderDate: "2026-04-12", dueDate: "2026-05-12", status: "Shipped" },
    { id: "ORD002", quotationId: "Q001", clientName: "ABC Construction", amount: 45000, scope: "Site Surveillance System", orderDate: "2026-04-16", dueDate: "2026-05-20", status: "Processing" },
  ]);

  const [formData, setFormData] = useState({
    quotationId: "",
    clientName: "",
    amount: "",
    scope: "",
    dueDate: "",
  });

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quotationId || !formData.clientName || !formData.amount || !formData.scope || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newOrder: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
      quotationId: formData.quotationId,
      clientName: formData.clientName,
      amount: parseFloat(formData.amount),
      scope: formData.scope,
      orderDate: new Date().toISOString().split("T")[0],
      dueDate: formData.dueDate,
      status: "Processing",
    };

    setOrders([...orders, newOrder]);
    setFormData({ quotationId: "", clientName: "", amount: "", scope: "", dueDate: "" });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pcb-pattern">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-b border-cyan-500/20 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Orders</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
          >
            <Plus size={18} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
            <div className="text-slate-400 text-sm font-medium mb-2">Total Orders</div>
            <div className="text-4xl font-bold text-cyan-400">{orders.length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300">
            <div className="text-slate-400 text-sm font-medium mb-2">Processing</div>
            <div className="text-4xl font-bold text-yellow-400">{orders.filter(o => o.status === "Processing").length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
            <div className="text-slate-400 text-sm font-medium mb-2">Shipped</div>
            <div className="text-4xl font-bold text-blue-400">{orders.filter(o => o.status === "Shipped").length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300">
            <div className="text-slate-400 text-sm font-medium mb-2">Delivered</div>
            <div className="text-4xl font-bold text-green-400">{orders.filter(o => o.status === "Delivered").length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300">
            <div className="text-slate-400 text-sm font-medium mb-2">Total Revenue</div>
            <div className="text-4xl font-bold text-red-400">${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-cyan-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Quotation ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Client Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Scope</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Order Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {orders.map((order, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-cyan-500/5 transition-all duration-300 animate-slideInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <td className="px-6 py-4 text-slate-300 font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-slate-400">{order.quotationId}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{order.clientName}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">${order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">{order.scope}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{order.orderDate}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{order.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      order.status === "Delivered"
                        ? "bg-green-900/30 text-green-300 border-green-500/30"
                        : order.status === "Shipped"
                        ? "bg-blue-900/30 text-blue-300 border-blue-500/30"
                        : order.status === "Processing"
                        ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                        : "bg-red-900/30 text-red-300 border-red-500/30"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-8 animate-fadeInUp">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">New Order</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddOrder} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Quotation ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.quotationId}
                    onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    placeholder="e.g. Q001"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    placeholder="Client company name"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Amount *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Scope *</label>
                  <textarea
                    required
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    placeholder="Order scope and details"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-lg font-medium transition-all border border-slate-600/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
