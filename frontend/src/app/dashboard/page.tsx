"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Upload, Edit, Check, RotateCcw } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LiveCameraFeed from "@/components/LiveCameraFeed";
import SitesActivity from "@/components/SitesActivity";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { quotationsAPI, ordersAPI, getErrorMessage } from "@/lib/api";
import { QuotationCreate, QuotationResponse } from "@/lib/types";

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: string;
  company_id: number;
}

interface Employee {
  image: string;
  name: string;
  age: number;
  joinDate: string;
  shift: "Morning" | "Afternoon" | "Night";
  time: string;
  post: string;
  status: "Checked In" | "Absent";
}

interface Site {
  name: string;
  location: string;
  manager: string;
  status: "Active" | "Paused" | "Completed";
}

interface Quotation {
  id: string;
  projectName: string;
  state: string;
  city: string;
  pincode: string;
  landmark?: string;
  clientName: string;
  email: string;
  entryGates: number;
  requiredCameras: number;
  landArea: number;
  duration: number;
  mapUrl: string;
  hasPromotionalClips: boolean;  // Yes/No option
  projectDesignFile?: string;  // File path or URL
  budgetAmount: number;
  projectType: "Residential" | "Commercial" | "Industrial" | "Infrastructure";
  date: string;
  validUntil: string;
  status: "Pending" | "Approved" | "Rejected";
}

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

interface SidebarProps {
  activeTab: "live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users";
  onTabChange: (tab: "live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users") => void;
  onModeChange?: (mode: "full" | "shrink" | "hidden") => void;
  selectedSiteId?: number | null;
  onSiteChange?: (siteId: number) => void;
  userRole?: string; // Add user role prop
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "sites" | "vehicles" | "employees" | "traffic" | "quotation" | "order" | "settings" | "contact" | "users">("live");
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);

  // Get user role from localStorage
  const [userRole, setUserRole] = useState<string>("");
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('Initial user data check:', {
      storedUser: !!storedUser,
      storedToken: !!storedToken,
      storedUserContent: storedUser
    });
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        setUser(userData);
        setUserRole(userData.role || "");
        console.log('Set user role to:', userData.role || "");
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    } else {
      console.log('No user data found in localStorage');
    }
    setLoading(false);
  }, []);
  const [loading, setLoading] = useState(true);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [showAddQuotationModal, setShowAddQuotationModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserImportModal, setShowUserImportModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const handleEditUser = (user: any) => {
    console.log('Edit user:', user);
  };

  const handleDeactivateUser = async (user: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/users/${user.id}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update user status in the local state
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: 'inactive' } : u
        ));
        alert('User deactivated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error deactivating user: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  const handleActivateUser = async (user: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/users/${user.id}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update user status in the local state
        setUsers(users.map(u => 
          u.id === user.id ? { ...u, status: 'active' } : u
        ));
        alert('User activated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error activating user: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Error activating user');
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`Are you sure you want to delete user ${user.full_name}?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove user from the local state
        setUsers(users.filter(u => u.id !== user.id));
        alert('User deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error deleting user: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleCreateUser = async (userData: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/users/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, { ...newUser, status: 'active' }]);
        setShowAddUserModal(false);
        alert('User created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error creating user: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching users - Token exists:', !!token);
    console.log('Fetching users - User role:', userRole);
    
    if (!token) {
      console.log('No token found, cannot fetch users');
      return;
    }

    try {
      console.log('Making API call to fetch users...');
      const response = await fetch('http://localhost:8000/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API response status:', response.status);

      if (response.ok) {
        const usersData = await response.json();
        console.log('Users data received:', usersData);
        const processedUsers = usersData.map((user: any) => ({
          ...user,
          status: user.is_active ? 'active' : 'inactive'
        }));
        console.log('Processed users:', processedUsers);
        setUsers(processedUsers);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch users - Status:', response.status, 'Error:', errorText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users when component mounts or user role changes
  useEffect(() => {
    if (userRole === 'administrator') {
      fetchUsers();
    }
  }, [userRole]);

  // Manual refresh function for users
  const refreshUsers = () => {
    console.log('Manual refresh triggered for users list');
    fetchUsers();
  };

  // Test authentication function
  const testAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('=== AUTHENTICATION TEST ===');
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'none');
    console.log('User data exists:', !!user);
    console.log('User data:', user);
    console.log('Current userRole state:', userRole);
    
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('Parsed user role:', parsedUser.role);
        console.log('Is administrator?', parsedUser.role === 'administrator');
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    console.log('=== END TEST ===');
  };

    
  const [sites, setSites] = useState<Site[]>([
    { name: "Downtown Office Complex", location: "123 Main St, NY", manager: "John Smith", status: "Active" },
    { name: "Harbor Bridge Renovation", location: "456 Harbor Rd, CA", manager: "Sarah Johnson", status: "Active" },
    { name: "Airport Terminal Expansion", location: "789 Aviation Ave, TX", manager: "Michael Chen", status: "Paused" },
  ]);

  const [siteFormData, setSiteFormData] = useState({
    name: "",
    location: "",
    manager: "",
    status: "Active" as const,
  });
  
  const [employees, setEmployees] = useState<Employee[]>([
    { image: "👨‍💼", name: "John Smith", age: 32, joinDate: "2023-01-15", shift: "Morning", time: "08:00 - 16:00", post: "Site Manager", status: "Checked In" },
    { image: "👩‍💼", name: "Sarah Johnson", age: 28, joinDate: "2023-03-22", shift: "Afternoon", time: "14:00 - 22:00", post: "Safety Officer", status: "Checked In" },
    { image: "👨‍🔧", name: "Michael Chen", age: 35, joinDate: "2022-11-10", shift: "Morning", time: "08:00 - 16:00", post: "Equipment Supervisor", status: "Checked In" },
    { image: "👩‍🔨", name: "Emily Davis", age: 26, joinDate: "2023-06-05", shift: "Night", time: "22:00 - 06:00", post: "Site Coordinator", status: "Absent" },
    { image: "👨‍🏗️", name: "James Wilson", age: 40, joinDate: "2022-05-20", shift: "Morning", time: "08:00 - 16:00", post: "Project Lead", status: "Checked In" },
    { image: "👩‍💻", name: "Lisa Anderson", age: 30, joinDate: "2023-02-14", shift: "Afternoon", time: "14:00 - 22:00", post: "Data Analyst", status: "Checked In" },
    { image: "👨‍⚙️", name: "Robert Taylor", age: 45, joinDate: "2021-09-08", shift: "Morning", time: "08:00 - 16:00", post: "Maintenance Chief", status: "Checked In" },
    { image: "👩‍🌾", name: "Amanda Brown", age: 29, joinDate: "2023-04-12", shift: "Night", time: "22:00 - 06:00", post: "Security Lead", status: "Checked In" },
  ]);
  
  const [formData, setFormData] = useState({
    image: "👤",
    name: "",
    age: "",
    joinDate: "",
    shift: "Morning" as const,
    time: "08:00 - 16:00",
    post: "",
    status: "Checked In" as const,
  });

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [quotationLoading, setQuotationLoading] = useState(false);
  const [quotationError, setQuotationError] = useState<string | null>(null);
  const [quotationSubmitting, setQuotationSubmitting] = useState(false);

  const [quotationFormData, setQuotationFormData] = useState({
    projectName: "",
    state: "",
    city: "",
    pincode: "",
    landmark: "",
    clientName: "",
    email: "",
    entryGates: "",
    requiredCameras: "",
    landArea: "",
    duration: "",
    mapUrl: "",
    hasPromotionalClips: false,
    budgetAmount: "",
    projectType: "Commercial" as const,
    validUntil: "",
    projectDesignFile: null as File | null,
  });


  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [orderFormData, setOrderFormData] = useState({
    quotationId: "",
    clientName: "",
    amount: "",
    scope: "",
    dueDate: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userStr));
      setLoading(false);
    } catch (err) {
      router.push("/login");
    }

    // Fetch quotations from backend
    const fetchQuotations = async () => {
      setQuotationLoading(true);
      setQuotationError(null);
      try {
        // Administrators should see all quotations, other users see only their own
        const userId = userRole === "administrator" ? undefined : user?.id?.toString();
        console.log("Fetching quotations - User role:", userRole, "User ID:", userId);
        const response = await quotationsAPI.getQuotations(0, 100, userId);
        console.log("Quotations API response:", response);
        console.log("Number of quotations received:", response.data.length);
        console.log("Quotation details:", response.data);
        const quotationData = response.data.map((q: QuotationResponse) => ({
          id: `Q${String(q.id).padStart(3, "0")}`,
          projectName: q.project_name,
          state: q.state,
          city: q.city,
          pincode: q.pincode,
          landmark: q.landmark || "",
          clientName: q.client_name,
          email: q.client_email,
          entryGates: q.entry_gates || 0,
          requiredCameras: q.required_cameras,
          landArea: q.land_area || 0,
          duration: q.duration_days || 0,
          mapUrl: q.map_url || "",
          hasPromotionalClips: q.has_promotional_clips || false,
          projectDesignFile: q.project_design_file || "",
          budgetAmount: q.budget_amount,
          projectType: q.project_type as any,
          date: q.created_date.split('T')[0],
          validUntil: q.valid_until.split('T')[0],
          status: q.status.charAt(0).toUpperCase() + q.status.slice(1) as any,
        }));
        setQuotations(quotationData);
      } catch (error: any) {
        console.error("Error fetching quotations:", error);
        setQuotationError(getErrorMessage(error));
      } finally {
        setQuotationLoading(false);
      }
    };

    if (token) {
      fetchQuotations();
      fetchOrders();
    }
  }, [router]);

  // Fetch orders from backend
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await ordersAPI.getOrders(0, 100, user?.company_id?.toString());
      const orderData = response.data.map((o: any) => ({
        id: `ORD${String(o.id).padStart(3, "0")}`,
        quotationId: `Q${String(o.quotation_id).padStart(3, "0")}`,
        clientName: o.client_name,
        amount: o.amount,
        scope: o.scope,
        orderDate: o.created_date.split('T')[0],
        dueDate: o.due_date.split('T')[0],
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1) as any,
      }));
      setOrders(orderData);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.joinDate || !formData.post) {
      alert("Please fill in all required fields");
      return;
    }

    const newEmployee: Employee = {
      image: formData.image,
      name: formData.name,
      age: parseInt(formData.age),
      joinDate: formData.joinDate,
      shift: formData.shift,
      time: formData.time,
      post: formData.post,
      status: formData.status,
    };

    setEmployees([...employees, newEmployee]);
    setFormData({
      image: "👤",
      name: "",
      age: "",
      joinDate: "",
      shift: "Morning",
      time: "08:00 - 16:00",
      post: "",
      status: "Checked In",
    });
    setShowAddEmployeeModal(false);
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteFormData.name || !siteFormData.location || !siteFormData.manager) {
      alert("Please fill in all required fields");
      return;
    }

    const newSite: Site = {
      name: siteFormData.name,
      location: siteFormData.location,
      manager: siteFormData.manager,
      status: siteFormData.status,
    };

    setSites([...sites, newSite]);
    setSiteFormData({
      name: "",
      location: "",
      manager: "",
      status: "Active",
    });
    setShowAddSiteModal(false);
  };

  const handleAddQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quotationFormData.projectName || !quotationFormData.state || !quotationFormData.city || !quotationFormData.pincode || !quotationFormData.clientName || !quotationFormData.email || !quotationFormData.requiredCameras || !quotationFormData.budgetAmount || !quotationFormData.validUntil) {
      alert("Please fill in all required fields");
      return;
    }

    setQuotationSubmitting(true);
    setQuotationError(null);

    try {
      // Check if token exists and is valid
      const token = localStorage.getItem("token");
      if (!token) {
        const errorMsg = "Authentication token not found. Please log in again.";
        console.error("[Quotation Create] " + errorMsg);
        setQuotationError(errorMsg);
        alert(errorMsg);
        setQuotationSubmitting(false);
        return;
      }
      
      console.log("[Quotation Create] Token exists, attempting to create quotation...");
      console.log("[Quotation Create] Token preview:", token.substring(0, 20) + "...");
      // Prepare quotation data (convert field names to snake_case for backend)
      const quotationCreateData = {
        project_name: quotationFormData.projectName,
        state: quotationFormData.state,
        city: quotationFormData.city,
        pincode: quotationFormData.pincode,
        landmark: quotationFormData.landmark,
        client_name: quotationFormData.clientName,
        client_email: quotationFormData.email,
        entry_gates: parseInt(quotationFormData.entryGates as string) || 1,
        required_cameras: parseInt(quotationFormData.requiredCameras as string),
        land_area: parseInt(quotationFormData.landArea as string) || 0,
        duration_days: parseInt(quotationFormData.duration as string) || 30,
        map_url: quotationFormData.mapUrl,
        has_promotional_clips: quotationFormData.hasPromotionalClips,
        budget_amount: parseInt(quotationFormData.budgetAmount as string),
        project_type: quotationFormData.projectType,
        valid_until: quotationFormData.validUntil,
        user_id: user?.id,
      } as QuotationCreate;

      // Create quotation
      const response = await quotationsAPI.createQuotation(quotationCreateData);
      const createdQuotation = response.data;

      // Upload project design file if provided
      if (quotationFormData.projectDesignFile) {
        try {
          await quotationsAPI.uploadProjectDesign(createdQuotation.id, quotationFormData.projectDesignFile);
        } catch (uploadError: any) {
          console.error("Error uploading project design file:", uploadError);
          // Continue even if file upload fails
        }
      }

      // Clear form and close modal
      setQuotationFormData({
        projectName: "",
        state: "",
        city: "",
        pincode: "",
        landmark: "",
        clientName: "",
        email: "",
        entryGates: "",
        requiredCameras: "",
        landArea: "",
        duration: "",
        mapUrl: "",
        hasPromotionalClips: false,
        budgetAmount: "",
        projectType: "Commercial",
        validUntil: "",
        projectDesignFile: null,
      });
      setShowAddQuotationModal(false);

      // Refresh quotations list
      try {
        const userId = userRole === "administrator" ? undefined : user?.id?.toString();
        const refreshResponse = await quotationsAPI.getQuotations(0, 100, userId);
        const quotationData = refreshResponse.data.map((q: QuotationResponse) => ({
          id: `Q${String(q.id).padStart(3, "0")}`,
          projectName: q.project_name,
          state: q.state,
          city: q.city,
          pincode: q.pincode,
          landmark: q.landmark || "",
          clientName: q.client_name,
          email: q.client_email,
          entryGates: q.entry_gates || 0,
          requiredCameras: q.required_cameras,
          landArea: q.land_area || 0,
          duration: q.duration_days || 0,
          mapUrl: q.map_url || "",
          hasPromotionalClips: q.has_promotional_clips || false,
          projectDesignFile: q.project_design_file || "",
          budgetAmount: q.budget_amount,
          projectType: q.project_type as any,
          date: q.created_date.split('T')[0],
          validUntil: q.valid_until.split('T')[0],
          status: q.status.charAt(0).toUpperCase() + q.status.slice(1) as any,
        }));
        setQuotations(quotationData);
      } catch (error: any) {
        console.error("Error refreshing quotations:", error);
      }

      alert("Quotation created successfully!");
    } catch (error: any) {
      console.error("Error creating quotation:", error);
      const errorMsg = getErrorMessage(error);
      setQuotationError(errorMsg);
      alert(`Error creating quotation: ${errorMsg}`);
    } finally {
      setQuotationSubmitting(false);
    }
  };

  const handleDeleteQuotation = async (quotationId: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) {
      return;
    }

    try {
      const id = parseInt(quotationId.replace("Q", ""));
      await quotationsAPI.deleteQuotation(id);
      setQuotations(quotations.filter(q => q.id !== quotationId));
      alert("Quotation deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting quotation:", error);
      alert(`Error deleting quotation: ${getErrorMessage(error)}`);
    }
  };

  const handleApproveQuotation = async (quotationId: string) => {
    try {
      const id = parseInt(quotationId.replace("Q", ""));
      await quotationsAPI.approveQuotation(id);
      
      // Update the quotation in the list
      setQuotations(quotations.map(q => 
        q.id === quotationId 
          ? { ...q, status: "Approved" as any }
          : q
      ));
      alert("Quotation approved successfully!");
    } catch (error: any) {
      console.error("Error approving quotation:", error);
      alert(`Error approving quotation: ${getErrorMessage(error)}`);
    }
  };

  const handleRejectQuotation = async (quotationId: string) => {
    try {
      const id = parseInt(quotationId.replace("Q", ""));
      await quotationsAPI.rejectQuotation(id);
      
      // Update the quotation in the list
      setQuotations(quotations.map(q => 
        q.id === quotationId 
          ? { ...q, status: "Rejected" as any }
          : q
      ));
      alert("Quotation rejected successfully!");
    } catch (error: any) {
      console.error("Error rejecting quotation:", error);
      alert(`Error rejecting quotation: ${getErrorMessage(error)}`);
    }
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFormData.quotationId || !orderFormData.clientName || !orderFormData.amount || !orderFormData.scope || !orderFormData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const orderData = {
        quotation_id: parseInt(orderFormData.quotationId.replace("Q", "")),
        client_name: orderFormData.clientName,
        client_contact: orderFormData.clientName,
        amount: parseInt(orderFormData.amount),
        scope: orderFormData.scope,
        description: orderFormData.scope,
        due_date: orderFormData.dueDate,
      };

      await ordersAPI.createOrder(orderData);
      
      // Refresh orders list
      await fetchOrders();
      
      setOrderFormData({
        quotationId: "",
        clientName: "",
        amount: "",
        scope: "",
        dueDate: "",
      });
      setShowAddOrderModal(false);
      alert("Order created successfully!");
    } catch (error: any) {
      console.error("Error creating order:", error);
      alert(`Error creating order: ${getErrorMessage(error)}`);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-slate-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 pcb-pattern flex flex-col overflow-hidden">
      {/* Header */}
      <DashboardHeader 
        user={user} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      {/* Main Layout */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          selectedSiteId={selectedSiteId}
          onSiteChange={setSelectedSiteId}
          userRole={userRole}
        />

        {/* Main Content Area - Full Screen */}
        <main className="flex-1 overflow-auto px-3 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6 animate-fadeIn">
        {/* Content Container */}
        <div>
        {/* Live Camera Feed Tab */}
        {activeTab === "live" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 md:mb-6">Live Camera Feed</h2>
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <LiveCameraFeed />
            </div>
          </div>
        )}

        {/* Construction Sites Tab */}
        {activeTab === "sites" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Construction Sites</h2>
              <button
                onClick={() => setShowAddSiteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
              >
                <Plus size={18} />
                <span>Add Site</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2 group-hover:text-cyan-400 transition-colors">Active Sites</div>
                  <div className="text-4xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">12</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2 group-hover:text-purple-400 transition-colors">Paused Sites</div>
                  <div className="text-4xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300">2</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2 group-hover:text-green-400 transition-colors">Completed Sites</div>
                  <div className="text-4xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">28</div>
                </div>
              </div>
            </div>

            {/* Sites Activity Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-purple-300">Sites Activity</h3>
              <SitesActivity />
            </div>

            {/* Sites Table */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 camera-grid">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Site Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Manager</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {sites.map((site, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-cyan-500/5 transition-all duration-300 hover:-translate-y-0.5 animate-slideInUp"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <td className="px-6 py-4 text-slate-300 font-medium">{site.name}</td>
                      <td className="px-6 py-4 text-slate-400">{site.location}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{site.manager}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 inline-block border ${
                          site.status === "Active"
                            ? "bg-green-900/30 text-green-300 border-green-500/30"
                            : site.status === "Paused"
                            ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                            : "bg-blue-900/30 text-blue-300 border-blue-500/30"
                        }`}>
                          {site.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Site Modal */}
            {showAddSiteModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-8 animate-fadeInUp">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Add New Site</h3>
                    <button
                      onClick={() => setShowAddSiteModal(false)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAddSite} className="space-y-4">
                    {/* Site Name */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Site Name *</label>
                      <input
                        type="text"
                        required
                        value={siteFormData.name}
                        onChange={(e) => setSiteFormData({ ...siteFormData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        placeholder="e.g. Downtown Office Complex"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Location *</label>
                      <input
                        type="text"
                        required
                        value={siteFormData.location}
                        onChange={(e) => setSiteFormData({ ...siteFormData, location: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        placeholder="e.g. 123 Main St, NY"
                      />
                    </div>

                    {/* Manager */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Site Manager *</label>
                      <input
                        type="text"
                        required
                        value={siteFormData.manager}
                        onChange={(e) => setSiteFormData({ ...siteFormData, manager: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        placeholder="Manager name"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Status</label>
                      <select
                        value={siteFormData.status}
                        onChange={(e) => setSiteFormData({ ...siteFormData, status: e.target.value as any })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddSiteModal(false)}
                        className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-lg font-medium transition-all border border-slate-600/50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
                      >
                        Add Site
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === "vehicles" && (
          <div className="space-y-6 animate-slideInUp">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">Vehicle Fleet Management</h2>

            {/* Fleet Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Total Vehicles</div>
                  <div className="text-4xl font-bold text-cyan-400">45</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.1s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Active</div>
                  <div className="text-4xl font-bold text-green-400">38</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.2s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Parked</div>
                  <div className="text-4xl font-bold text-yellow-400">5</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.3s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Maintenance</div>
                  <div className="text-4xl font-bold text-red-400">2</div>
                </div>
              </div>
            </div>

            {/* Vehicle List Table */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 camera-grid">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Registration No.</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Camera No.</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {[
                    { regNo: "AB-CD-1234", dateTime: "2026-04-17 14:32", camNo: "CAM-01", duration: "45 min", type: "Truck", status: "Active" },
                    { regNo: "XY-ZA-5678", dateTime: "2026-04-17 13:15", camNo: "CAM-03", duration: "2h 30min", type: "Excavator", status: "Active" },
                    { regNo: "MN-OP-9012", dateTime: "2026-04-17 12:00", camNo: "CAM-02", duration: "1h 15min", type: "Bulldozer", status: "Parked" },
                    { regNo: "EF-GH-3456", dateTime: "2026-04-17 11:45", camNo: "CAM-04", duration: "3h 20min", type: "Crane", status: "Active" },
                    { regNo: "IJ-KL-7890", dateTime: "2026-04-17 10:30", camNo: "CAM-05", duration: "1h", type: "Compactor", status: "Maintenance" },
                  ].map((vehicle, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-cyan-500/5 transition-all duration-300 hover:-translate-y-0.5 animate-slideInUp"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <td className="px-6 py-4 text-slate-300 font-semibold">{vehicle.regNo}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{vehicle.dateTime}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{vehicle.camNo}</td>
                      <td className="px-6 py-4 text-slate-300 font-medium">{vehicle.duration}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-900/30 text-purple-300 border border-purple-500/30">
                          {vehicle.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 inline-block border ${
                          vehicle.status === "Active"
                            ? "bg-green-900/30 text-green-300 border-green-500/30"
                            : vehicle.status === "Parked"
                            ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                            : "bg-red-900/30 text-red-300 border-red-500/30"
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6 animate-slideInUp">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Employee Tracking</h2>
              <button
                onClick={() => setShowAddEmployeeModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 active:scale-95"
              >
                <Plus size={18} />
                <span>Add Employee</span>
              </button>
            </div>

            {/* Attendance Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Total Employees</div>
                  <div className="text-4xl font-bold text-cyan-400">156</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.1s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Checked In Today</div>
                  <div className="text-4xl font-bold text-green-400">142</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.2s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Absent</div>
                  <div className="text-4xl font-bold text-red-400">14</div>
                </div>
              </div>
            </div>

            {/* Employee List Table */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 camera-grid">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Image</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Name</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Age</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Join Date</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Shift</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Time</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Post</th>
                    <th className="px-4 md:px-6 py-4 text-left text-sm font-bold text-cyan-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {employees.map((employee, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-cyan-500/5 transition-all duration-300 hover:-translate-y-0.5 animate-slideInUp"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg border border-cyan-500/30">
                          {employee.image}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-slate-300 font-medium">{employee.name}</td>
                      <td className="px-4 md:px-6 py-4 text-slate-400">{employee.age}</td>
                      <td className="px-4 md:px-6 py-4 text-slate-400 text-sm">{employee.joinDate}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          employee.shift === "Morning"
                            ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                            : employee.shift === "Afternoon"
                            ? "bg-orange-900/30 text-orange-300 border-orange-500/30"
                            : "bg-indigo-900/30 text-indigo-300 border-indigo-500/30"
                        }`}>
                          {employee.shift}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-slate-300 font-medium text-sm">{employee.time}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-900/30 text-purple-300 border border-purple-500/30">
                          {employee.post}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 inline-block border ${
                          employee.status === "Checked In"
                            ? "bg-green-900/30 text-green-300 border-green-500/30"
                            : "bg-red-900/30 text-red-300 border-red-500/30"
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Employee Modal */}
            {showAddEmployeeModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-8 animate-fadeInUp">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Add New Employee</h3>
                    <button
                      onClick={() => setShowAddEmployeeModal(false)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        placeholder="Employee name"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Age *</label>
                      <input
                        type="number"
                        required
                        min="18"
                        max="100"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        placeholder="Age"
                      />
                    </div>

                    {/* Join Date */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Join Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.joinDate}
                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      />
                    </div>

                    {/* Shift */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Shift</label>
                      <select
                        value={formData.shift}
                        onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      >
                        <option value="Morning">Morning (08:00 - 16:00)</option>
                        <option value="Afternoon">Afternoon (14:00 - 22:00)</option>
                        <option value="Night">Night (22:00 - 06:00)</option>
                      </select>
                    </div>

                    {/* Post */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Post/Position *</label>
                      <input
                        type="text"
                        required
                        value={formData.post}
                        onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        placeholder="e.g. Site Manager, Safety Officer"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      >
                        <option value="Checked In">Checked In</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddEmployeeModal(false)}
                        className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 rounded-lg font-medium transition-all border border-slate-600/50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30"
                      >
                        Add Employee
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Traffic Analytics Tab */}
        {activeTab === "traffic" && (
          <div className="space-y-6 animate-slideInUp">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">Traffic Analytics</h2>

            {/* Traffic Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Total Vehicles</div>
                  <div className="text-4xl font-bold text-cyan-400">1,247</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.1s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Avg Speed</div>
                  <div className="text-4xl font-bold text-green-400">42 km/h</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.2s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Congestion</div>
                  <div className="text-4xl font-bold text-yellow-400">23%</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 animate-slideInUp pcb-pattern relative overflow-hidden" style={{animationDelay: '0.3s'}}>
                <div className="relative z-10">
                  <div className="text-slate-400 text-sm font-medium mb-2">Incidents</div>
                  <div className="text-4xl font-bold text-red-400">5</div>
                </div>
              </div>
            </div>

            {/* Hourly Traffic Volume Chart */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Hourly Traffic Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { time: "00:00", vehicles: 120 },
                  { time: "04:00", vehicles: 95 },
                  { time: "08:00", vehicles: 420 },
                  { time: "12:00", vehicles: 680 },
                  { time: "16:00", vehicles: 890 },
                  { time: "20:00", vehicles: 520 },
                  { time: "24:00", vehicles: 200 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                  <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.8)" />
                  <YAxis stroke="rgba(148, 163, 184, 0.8)" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(34, 211, 238, 0.5)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="vehicles" stroke="rgba(34, 211, 238, 1)" strokeWidth={2} dot={{ fill: "rgba(34, 211, 238, 1)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic by Road Type & Vehicle Type Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart - Traffic by Road Type */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Traffic by Road Type</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[
                    { type: "Highway", vehicles: 420 },
                    { type: "Main Road", vehicles: 380 },
                    { type: "Local Road", vehicles: 250 },
                    { type: "Residential", vehicles: 150 },
                    { type: "Industrial", vehicles: 200 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                    <XAxis dataKey="type" stroke="rgba(148, 163, 184, 0.8)" />
                    <YAxis stroke="rgba(148, 163, 184, 0.8)" />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(168, 85, 247, 0.5)" }} />
                    <Bar dataKey="vehicles" fill="rgba(168, 85, 247, 0.8)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Vehicle Type Distribution */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <h3 className="text-xl font-bold text-green-400 mb-4">Vehicle Type Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Cars", value: 480 },
                        { name: "Trucks", value: 280 },
                        { name: "Buses", value: 150 },
                        { name: "Motorcycles", value: 210 },
                        { name: "Others", value: 127 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="rgba(34, 211, 238, 0.8)" />
                      <Cell fill="rgba(168, 85, 247, 0.8)" />
                      <Cell fill="rgba(34, 197, 94, 0.8)" />
                      <Cell fill="rgba(249, 115, 22, 0.8)" />
                      <Cell fill="rgba(239, 68, 68, 0.8)" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(34, 197, 94, 0.5)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Road Condition Status */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Road Condition Status</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-400 text-sm font-medium mb-2">Clear</div>
                  <div className="text-3xl font-bold text-green-300">8 Roads</div>
                  <div className="text-slate-400 text-xs mt-2">Normal traffic flow</div>
                </div>
                <div className="bg-slate-700/30 border border-yellow-500/30 rounded-lg p-4">
                  <div className="text-yellow-400 text-sm font-medium mb-2">Moderate</div>
                  <div className="text-3xl font-bold text-yellow-300">5 Roads</div>
                  <div className="text-slate-400 text-xs mt-2">Slow traffic flow</div>
                </div>
                <div className="bg-slate-700/30 border border-red-500/30 rounded-lg p-4">
                  <div className="text-red-400 text-sm font-medium mb-2">Congested</div>
                  <div className="text-3xl font-bold text-red-300">2 Roads</div>
                  <div className="text-slate-400 text-xs mt-2">Heavy congestion</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quotations Tab - All Users */}
        {activeTab === "quotation" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Quotations</h2>
              <button
                onClick={() => setShowAddQuotationModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
              >
                <Plus size={18} />
                <span>Add Quotation</span>
              </button>
            </div>

            {/* Quotation Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-pink-400 transition-colors">Total</div>
                  <div className="text-2xl md:text-3xl font-bold text-pink-400 group-hover:scale-110 transition-transform duration-300">{quotations.length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-yellow-400 transition-colors">Pending</div>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-300">{quotations.filter(q => q.status === "Pending").length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-green-400 transition-colors">Approved</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">{quotations.filter(q => q.status === "Approved").length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-amber-400 transition-colors">Total Value</div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 group-hover:scale-110 transition-transform duration-300">${(quotations.reduce((sum, q) => sum + q.budgetAmount, 0) / 1000).toFixed(0)}k</div>
                </div>
              </div>
            </div>

            {/* Quotations Error */}
            {quotationError && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm">
                {quotationError}
              </div>
            )}

            {/* Quotations Loading */}
            {quotationLoading && (
              <div className="p-8 text-center text-slate-400">
                Loading quotations...
              </div>
            )}

            {/* Quotations Table */}
            {!quotationLoading && (
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-pink-500/20 rounded-xl overflow-x-auto shadow-md hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 camera-grid">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-pink-500/20">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">ID</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Project Name</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Location</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Cameras</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Budget</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Type</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-pink-400 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-500/10">
                  {quotations.length > 0 ? (
                    quotations.map((quotation, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-pink-500/5 transition-all duration-300 hover:-translate-y-0.5 animate-slideInUp"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm font-medium">{quotation.id}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm font-medium">{quotation.projectName}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">{quotation.city}, {quotation.state}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">{quotation.requiredCameras}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">${quotation.budgetAmount}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">{quotation.projectType}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold transition-all duration-300 inline-block border whitespace-nowrap ${
                            quotation.status === "Approved"
                              ? "bg-green-900/30 text-green-300 border-green-500/30"
                              : quotation.status === "Pending"
                              ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30"
                              : "bg-red-900/30 text-red-300 border-red-500/30"
                          }`}>
                            {quotation.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex gap-2 flex-wrap">
                            {quotation.status === "Pending" && userRole === "administrator" && (
                              <>
                                <button
                                  onClick={() => handleApproveQuotation(quotation.id)}
                                  className="px-2 py-1 bg-green-600/30 text-green-300 border border-green-500/50 rounded text-xs hover:bg-green-600/50 transition-all"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectQuotation(quotation.id)}
                                  className="px-2 py-1 bg-red-600/30 text-red-300 border border-red-500/50 rounded text-xs hover:bg-red-600/50 transition-all"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteQuotation(quotation.id)}
                              className="px-2 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded text-xs hover:bg-red-600/40 transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                          </div>
                          <div>
                            <p className="text-slate-400 text-lg font-medium">No quotations found</p>
                            <p className="text-slate-500 text-sm mt-1">Create your first quotation to get started</p>
                          </div>
                          <button
                            onClick={() => setShowAddQuotationModal(true)}
                            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 active:scale-95"
                          >
                            Create Quotation
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}

            {/* Add Quotation Modal */}
            {showAddQuotationModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-pink-500/30 rounded-2xl shadow-2xl shadow-pink-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fadeInUp">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white">New Quotation</h3>
                    <button
                      onClick={() => setShowAddQuotationModal(false)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleAddQuotation} className="space-y-3">
                    {quotationError && (
                      <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
                        {quotationError}
                      </div>
                    )}
                    {/* Project Name */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Project Name *</label>
                      <input type="text" required value={quotationFormData.projectName} onChange={(e) => setQuotationFormData({ ...quotationFormData, projectName: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="Enter project name" />
                    </div>

                    {/* Location: State, City, Pincode, Landmark */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">State *</label>
                        <input type="text" required value={quotationFormData.state} onChange={(e) => setQuotationFormData({ ...quotationFormData, state: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="State" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">City *</label>
                        <input type="text" required value={quotationFormData.city} onChange={(e) => setQuotationFormData({ ...quotationFormData, city: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="City" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Pincode *</label>
                        <input type="text" required value={quotationFormData.pincode} onChange={(e) => setQuotationFormData({ ...quotationFormData, pincode: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="Pincode" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Landmark</label>
                        <input type="text" value={quotationFormData.landmark} onChange={(e) => setQuotationFormData({ ...quotationFormData, landmark: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="Landmark (Optional)" />
                      </div>
                    </div>

                    {/* Client Name */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Client Name *</label>
                      <input type="text" required value={quotationFormData.clientName} onChange={(e) => setQuotationFormData({ ...quotationFormData, clientName: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="Enter client name" />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Email *</label>
                      <input type="email" required value={quotationFormData.email} onChange={(e) => setQuotationFormData({ ...quotationFormData, email: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="Enter email" />
                    </div>

                    {/* Entry Gates & Cameras Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Entry Gates</label>
                        <input type="number" value={quotationFormData.entryGates} onChange={(e) => setQuotationFormData({ ...quotationFormData, entryGates: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="e.g., 4" min="1" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Cameras Required *</label>
                        <input type="number" required value={quotationFormData.requiredCameras} onChange={(e) => setQuotationFormData({ ...quotationFormData, requiredCameras: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="e.g., 24" min="1" />
                      </div>
                    </div>

                    {/* Land Area & Duration Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Land Area (sqft)</label>
                        <input type="number" value={quotationFormData.landArea} onChange={(e) => setQuotationFormData({ ...quotationFormData, landArea: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="e.g., 5000" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Duration (days)</label>
                        <input type="number" value={quotationFormData.duration} onChange={(e) => setQuotationFormData({ ...quotationFormData, duration: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="e.g., 90" />
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Project Type</label>
                      <select value={quotationFormData.projectType} onChange={(e) => setQuotationFormData({ ...quotationFormData, projectType: e.target.value as any })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all">
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </select>
                    </div>

                    {/* Map URL */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Map URL</label>
                      <input type="url" value={quotationFormData.mapUrl} onChange={(e) => setQuotationFormData({ ...quotationFormData, mapUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="https://maps.example.com" />
                    </div>

                    {/* Promotional Clips */}
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={quotationFormData.hasPromotionalClips} 
                          onChange={(e) => setQuotationFormData({ ...quotationFormData, hasPromotionalClips: e.target.checked })} 
                          className="w-4 h-4 text-pink-500 bg-slate-700/50 border-pink-500/30 rounded focus:ring-2 focus:ring-pink-500/60"
                        />
                        <span className="ml-3 text-slate-300 text-sm font-medium">Include Promotional Clips?</span>
                      </label>
                    </div>

                    {/* Project Design File */}
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Project Design File (PDF/JPG)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setQuotationFormData({ ...quotationFormData, projectDesignFile: e.target.files?.[0] || null })} 
                        className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all file:bg-pink-500/20 file:border-0 file:text-pink-300 file:mr-2 cursor-pointer" 
                      />
                      {quotationFormData.projectDesignFile && (
                        <p className="text-xs text-pink-300 mt-1">✓ {quotationFormData.projectDesignFile.name}</p>
                      )}
                    </div>

                    {/* Budget & Valid Until Row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Budget Amount *</label>
                        <input type="number" required value={quotationFormData.budgetAmount} onChange={(e) => setQuotationFormData({ ...quotationFormData, budgetAmount: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" placeholder="e.g., 45000" />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Valid Until *</label>
                        <input type="date" required value={quotationFormData.validUntil} onChange={(e) => setQuotationFormData({ ...quotationFormData, validUntil: e.target.value })} className="w-full px-3 py-2 bg-slate-700/50 border border-pink-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all" />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={quotationSubmitting}
                      className={`w-full mt-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white rounded-lg font-bold text-sm transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 active:scale-95 ${
                        quotationSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {quotationSubmitting ? "Creating..." : "Create Quotation"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Tab - All Users */}
        {activeTab === "order" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Orders</h2>
              <button
                onClick={() => setShowAddOrderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 active:scale-95"
              >
                <Plus size={18} />
                <span>New Order</span>
              </button>
            </div>

            {/* Order Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-amber-400 transition-colors">Total Orders</div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 group-hover:scale-110 transition-transform duration-300">{orders.length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-yellow-400 transition-colors">Processing</div>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-300">{orders.filter(o => o.status === "Processing").length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-blue-400 transition-colors">Shipped</div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 group-hover:scale-110 transition-transform duration-300">{orders.filter(o => o.status === "Shipped").length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-green-400 transition-colors">Delivered</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">{orders.filter(o => o.status === "Delivered").length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-purple-400 transition-colors">Revenue</div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300">${(orders.reduce((sum, o) => sum + o.amount, 0) / 1000).toFixed(0)}k</div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            {!ordersLoading && (
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-amber-500/20 rounded-xl overflow-x-auto shadow-md hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 camera-grid">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-b border-amber-500/20">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Order ID</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Quote ID</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Client</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Amount</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Scope</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Due Date</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-amber-400 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-amber-500/5 transition-all duration-300 hover:-translate-y-0.5 animate-slideInUp"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm font-medium">{order.id}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">{order.quotationId}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm font-medium">{order.clientName}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">${order.amount}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">{order.scope}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-slate-400 text-sm">{order.dueDate}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-bold transition-all duration-300 inline-block border whitespace-nowrap ${
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                          </div>
                          <div>
                            <p className="text-slate-400 text-lg font-medium">No orders found</p>
                            <p className="text-slate-500 text-sm mt-1">Create your first order to get started</p>
                          </div>
                          <button
                            onClick={() => setShowAddOrderModal(true)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 active:scale-95"
                          >
                            Create Order
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
            {/* Add Order Modal */}
            {showAddOrderModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fadeInUp">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white">New Order</h3>
                    <button
                      onClick={() => setShowAddOrderModal(false)}
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
                        value={orderFormData.quotationId}
                        onChange={(e) => setOrderFormData({ ...orderFormData, quotationId: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                        placeholder="e.g., Q001"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Client Name *</label>
                      <input
                        type="text"
                        required
                        value={orderFormData.clientName}
                        onChange={(e) => setOrderFormData({ ...orderFormData, clientName: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Amount *</label>
                      <input
                        type="number"
                        required
                        value={orderFormData.amount}
                        onChange={(e) => setOrderFormData({ ...orderFormData, amount: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Scope *</label>
                      <input
                        type="text"
                        required
                        value={orderFormData.scope}
                        onChange={(e) => setOrderFormData({ ...orderFormData, scope: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                        placeholder="Enter scope"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Due Date *</label>
                      <input
                        type="date"
                        required
                        value={orderFormData.dueDate}
                        onChange={(e) => setOrderFormData({ ...orderFormData, dueDate: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 active:scale-95"
                    >
                      Create Order
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab - All Users */}
        {activeTab === "settings" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">Settings</h2>

            {/* Quotations Subsection */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-pink-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
              <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full"></span>
                Quotations Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Total Quotations</p>
                    <p className="text-slate-400 text-sm">All company quotations</p>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-pink-400">{quotations.length}</div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Pending Quotations</p>
                    <p className="text-slate-400 text-sm">Awaiting approval</p>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400">{quotations.filter(q => q.status === "Pending").length}</div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <button
                    onClick={() => setShowAddQuotationModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50 active:scale-95"
                  >
                    <Plus size={18} />
                    <span>Add Quotation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Subsection */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-amber-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                Orders Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Total Orders</p>
                    <p className="text-slate-400 text-sm">All company orders</p>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400">{orders.length}</div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Processing Orders</p>
                    <p className="text-slate-400 text-sm">Currently being processed</p>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">{orders.filter(o => o.status === "Processing").length}</div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <button
                    onClick={() => setShowAddOrderModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 active:scale-95"
                  >
                    <Plus size={18} />
                    <span>Add Order</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Tab - All Users */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></span>
                Contact Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Support Email</p>
                    <p className="text-slate-400 text-sm">support@company.com</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
                    Contact
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Phone</p>
                    <p className="text-slate-400 text-sm">+1-800-555-0123</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
                    Call
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-300 font-medium">Response Time</p>
                    <p className="text-slate-400 text-sm">24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab - Admin Only */}
        {activeTab === "users" && userRole === "administrator" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">User Management</h2>

            {/* User Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-indigo-400 transition-colors">Total Users</div>
                  <div className="text-2xl md:text-3xl font-bold text-indigo-400 group-hover:scale-110 transition-transform duration-300">{users.length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-green-400 transition-colors">Active Users</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">{users.filter(u => u.status === "active").length}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6 rounded-xl border border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer pcb-pattern relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-slate-400 text-xs md:text-sm font-medium mb-2 group-hover:text-yellow-400 transition-colors">Admin Users</div>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-300">{users.filter(u => u.role === "administrator").length}</div>
                </div>
              </div>
            </div>

            {/* User Management Actions */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-300">User Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={testAuth}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 active:scale-95"
                >
                  <Check size={18} />
                  <span>Test Auth</span>
                </button>
                <button
                  onClick={refreshUsers}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
                >
                  <RotateCcw size={18} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 active:scale-95"
                >
                  <Plus size={18} />
                  <span>Add User</span>
                </button>
                <button
                  onClick={() => setShowUserImportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 active:scale-95"
                >
                  <Upload size={18} />
                  <span>Import Users</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-500/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/50 border-b border-slate-600/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-300 font-medium">User</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-medium">Email</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-medium">Role</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600/50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-600/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-300">{user.full_name}</div>
                              <div className="text-slate-400 text-sm">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "administrator" 
                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50"
                              : "bg-green-500/20 text-green-400 border border-green-500/50"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "active" 
                              ? "bg-green-500/20 text-green-400 border border-green-500/50"
                              : "bg-slate-500/20 text-slate-400 border border-slate-500/50"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all duration-300"
                            >
                              <Edit size={14} />
                            </button>
                            {user.status === "active" ? (
                              <button
                                onClick={() => handleDeactivateUser(user)}
                                className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm transition-all duration-300"
                              >
                                <X size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user)}
                                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-all duration-300"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab - All Users */}
        {activeTab === "contact" && (
          <div className="space-y-4 md:space-y-6 animate-slideInUp">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">Contact Support</h2>

            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></span>
                Contact Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Support Email</p>
                    <p className="text-slate-400 text-sm">support@company.com</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
                    Contact
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
                  <div>
                    <p className="text-slate-300 font-medium">Phone</p>
                    <p className="text-slate-400 text-sm">+1-800-555-0123</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
                    Call
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-slate-300 font-medium">Response Time</p>
                    <p className="text-slate-400 text-sm">24-48 hours</p>
                  </div>
                </div>
    </div>
    <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
      Contact
    </button>
  </div>
  <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
    <div>
      <p className="text-slate-300 font-medium">Phone</p>
      <p className="text-slate-400 text-sm">+1-800-555-0123</p>
    </div>
    <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
      Call
    </button>
  </div>
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-slate-300 font-medium">Response Time</p>
      <p className="text-slate-400 text-sm">24-48 hours</p>
    </div>
  </div>
</div>

)}


{/* Contact Tab - All Users */}
{activeTab === "contact" && (
  <div className="space-y-4 md:space-y-6 animate-slideInUp">
    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">Contact Support</h2>

    <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
      <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></span>
        Contact Support
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
          <div>
            <p className="text-slate-300 font-medium">Support Email</p>
            <p className="text-slate-400 text-sm">support@company.com</p>
          </div>
          <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
            Contact
          </button>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-slate-600/50">
          <div>
            <p className="text-slate-300 font-medium">Phone</p>
            <p className="text-slate-400 text-sm">+1-800-555-0123</p>
          </div>
          <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300">
            Call
          </button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-slate-300 font-medium">Response Time</p>
            <p className="text-slate-400 text-sm">24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Add User Modal */}
{showAddUserModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-300">Add New User</h3>
        <button
          onClick={() => setShowAddUserModal(false)}
          className="text-slate-400 hover:text-slate-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = {
          username: formData.get('username'),
          email: formData.get('email'),
          full_name: formData.get('full_name'),
          password: formData.get('password'),
          role: formData.get('role'),
        };
        handleCreateUser(userData);
      }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select
              name="role"
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowAddUserModal(false)}
            className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 active:scale-95"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        </div>
      </main>
    </div>
  </div>
);
}
