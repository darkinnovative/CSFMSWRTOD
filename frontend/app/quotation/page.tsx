"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Download, Eye, Check, X as XIcon } from "lucide-react";

interface Quotation {
  id: number;
  client_name: string;
  client_email: string;
  budget_amount: number;
  project_name: string;
  created_date: string;
  valid_until: string;
  status: "Pending" | "Approved" | "Rejected";
}

export default function Quotation() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || "");
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    setLoading(false);
  }, []);

  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    amount: "",
    scope: "",
    validUntil: "",
  });

  const handleAddQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.email || !formData.amount || !formData.scope || !formData.validUntil) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Validate token exists and is not empty
      if (!token || token.trim() === '') {
        alert('Please log in to create quotations');
        return;
      }

      // Get user info for company_id
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : {};
      
      const quotationData = {
        project_name: formData.scope,
        state: "Maharashtra", // Default state
        city: "Mumbai", // Default city
        pincode: "400001", // Default pincode
        landmark: "", // Optional
        client_name: formData.clientName,
        client_email: formData.email,
        entry_gates: 2, // Default
        required_cameras: 4, // Default
        land_area: parseFloat(formData.amount) || 0, // Convert amount to land_area
        duration_days: 30, // Default
        budget_amount: parseFloat(formData.amount) || 0,
        project_type: "Construction", // Default
        has_promotional_clips: false,
        project_design_file: null, // Optional
        map_url: null, // Optional
        valid_until: new Date(formData.validUntil).toISOString(), // Required field from form
      };

      console.log('Creating quotation with data:', JSON.stringify(quotationData, null, 2));
      console.log('Token being used:', token);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/quotations/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const newQuotation = await response.json();
        console.log('Quotation created successfully:', newQuotation);
        alert("Quotation created successfully!");
        // Refresh quotations list or update state
        setQuotations([...quotations, { 
          id: newQuotation.id, 
          client_name: formData.clientName, 
          client_email: formData.email, 
          budget_amount: parseFloat(formData.amount), 
          project_name: formData.scope, 
          created_date: new Date().toISOString(), 
          valid_until: newQuotation.valid_until, 
          status: "Pending" 
        }]);
        setFormData({ clientName: "", email: "", amount: "", scope: "", validUntil: "" });
        setShowAddModal(false);
      } else {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        try {
          const error = JSON.parse(errorText);
          console.log('Parsed error:', error);
          alert(`Failed to create quotation: ${error.detail || 'Unknown error'}`);
        } catch (e) {
          console.log('Failed to parse error:', e);
          alert(`Failed to create quotation: ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation. Please try again.');
    }
  };

  const handleApproveQuotation = async (quotationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/quotations/${quotationId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert("Quotation approved successfully!");
        // Update quotation status in state
        setQuotations(quotations.map(q => 
          q.id === quotationId ? { ...q, status: "Approved" } : q
        ));
      } else {
        const errorText = await response.text();
        alert(`Failed to approve quotation: ${errorText}`);
      }
    } catch (error) {
      console.error('Error approving quotation:', error);
      alert('Failed to approve quotation. Please try again.');
    }
  };

  const handleRejectQuotation = async (quotationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/quotations/${quotationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert("Quotation rejected successfully!");
        // Update quotation status in state
        setQuotations(quotations.map(q => 
          q.id === quotationId ? { ...q, status: "Rejected" } : q
        ));
      } else {
        const errorText = await response.text();
        alert(`Failed to reject quotation: ${errorText}`);
      }
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      alert('Failed to reject quotation. Please try again.');
    }
  };

  const handleDeleteQuotation = async (quotationId: number) => {
    if (!confirm('Are you sure you want to delete this quotation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/quotations/${quotationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert("Quotation deleted successfully!");
        // Remove quotation from state
        setQuotations(quotations.filter(q => q.id !== quotationId));
      } else {
        const errorText = await response.text();
        alert(`Failed to delete quotation: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Failed to delete quotation. Please try again.');
    }
  };

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/quotations/`, {
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuotations(data);
      } else {
        console.error('Failed to fetch quotations');
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pcb-pattern">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-b border-cyan-500/20 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Quotations</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 active:scale-95"
          >
            <Plus size={18} />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading quotations...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Quotations</div>
                <div className="text-4xl font-bold text-cyan-400">{quotations.length}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300">
                <div className="text-slate-400 text-sm font-medium mb-2">Pending</div>
                <div className="text-4xl font-bold text-yellow-400">{quotations.filter(q => q.status === "Pending").length}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300">
                <div className="text-slate-400 text-sm font-medium mb-2">Approved</div>
                <div className="text-4xl font-bold text-green-400">{quotations.filter(q => q.status === "Approved").length}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300">
                <div className="text-slate-400 text-sm font-medium mb-2">Rejected</div>
                <div className="text-4xl font-bold text-red-400">{quotations.filter(q => q.status === "Rejected").length}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                <div className="text-slate-400 text-sm font-medium mb-2">Total Value</div>
                <div className="text-4xl font-bold text-blue-400">₹{quotations.reduce((sum, q) => sum + q.budget_amount, 0).toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Quotations Table */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Client Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Scope</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Valid Until</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {quotations.map((quotation, index) => (
                    <tr 
                      key={quotation.id} 
                      className="hover:bg-cyan-500/5 transition-all duration-300 animate-slideInUp"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <td className="px-6 py-4 text-slate-300 font-medium">{quotation.id}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{quotation.client_name}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{quotation.client_email}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">₹{quotation.budget_amount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 text-slate-400">{quotation.project_name}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{new Date(quotation.created_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{new Date(quotation.valid_until).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          quotation.status === "Approved"
                            ? "bg-green-900/30 text-green-300 border-green-500/30"
                            : quotation.status === "Pending"
                            ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                            : "bg-red-900/30 text-red-300 border-red-500/30"
                        }`}>
                          {quotation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-cyan-500/10 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors" title="View">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-green-500/10 rounded-lg text-green-400 hover:text-green-300 transition-colors" title="Download">
                            <Download size={16} />
                          </button>
                          {userRole === "admin" && (
                            <>
                              <button 
                                onClick={() => handleApproveQuotation(quotation.id)}
                                className="p-2 hover:bg-green-500/10 rounded-lg text-green-400 hover:text-green-300 transition-colors" 
                                title="Approve"
                                disabled={quotation.status !== "Pending"}
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleRejectQuotation(quotation.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors" 
                                title="Reject"
                                disabled={quotation.status !== "Pending"}
                              >
                                <XIcon size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteQuotation(quotation.id)}
                                className="p-2 hover:bg-orange-500/10 rounded-lg text-orange-400 hover:text-orange-300 transition-colors" 
                                title="Delete"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Add Quotation Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-8 animate-fadeInUp">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">New Quotation</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddQuotation} className="space-y-4">
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
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                    placeholder="client@example.com"
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
                    placeholder="Project scope and details"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Valid Until *</label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
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
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30"
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
