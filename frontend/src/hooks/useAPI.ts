"use client";

import { useState, useCallback, useEffect } from "react";
import {
  authAPI, sitesAPI, vehiclesAPI, employeesAPI, trafficAPI,
  quotationsAPI, ordersAPI, detectionAPI, deviceAPI, systemAPI,
  getErrorMessage,
} from "@/lib/api";
import {
  UserResponse, TokenResponse, ConstructionSiteResponse, ConstructionSiteCreate, ConstructionSiteUpdate,
  VehicleResponse, VehicleCreate, VehicleUpdate, VehicleLocationUpdate, ActiveVehiclesResponse,
  EmployeeResponse, EmployeeCreate, EmployeeUpdate, EmployeeCheckIn, EmployeeCheckOut,
  AttendanceStatsResponse, OnSiteEmployeeResponse,
  GatePassResponse, GatePassCreate, GatePassUpdate, TrafficVehicleCreate, CurrentSiteTrafficResponse,
  TrafficStatsResponse,
  QuotationResponse, QuotationCreate, QuotationUpdate,
  QuotationStatsResponse,
  OrderResponse, OrderCreate, OrderUpdate,
  OrderStatsResponse,
  DetectionEventResponse, StatsResponse, DeviceStatusResponse,
} from "@/lib/types";

// ============================================================================
// COMMON HOOKS
// ============================================================================

/**
 * Hook to handle async operations with loading, error, and success states
 */
export function useAsyncOperation<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await operation();
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Operation error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, success };
}

/**
 * Hook to fetch data with automatic loading and error handling
 */
export function useFetch<T>(
  fetchFn: () => Promise<any>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      setData(response.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

export function useLogin() {
  const { execute, loading, error, success } = useAsyncOperation<TokenResponse>();

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await execute(() => authAPI.login({ username, password }).then(r => r.data));
      if (result) {
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      return result;
    },
    [execute]
  );

  return { login, loading, error, success };
}

export function useLogout() {
  const { execute, loading, error } = useAsyncOperation<void>();

  const logout = useCallback(async () => {
    await execute(() => authAPI.logout().then(r => r.data));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, [execute]);

  return { logout, loading, error };
}

export function useRegister() {
  const { execute, loading, error, success } = useAsyncOperation<TokenResponse>();

  const register = useCallback(
    async (username: string, email: string, password: string, full_name: string) => {
      const result = await execute(() =>
        authAPI.register({ username, email, password, full_name }).then(r => r.data)
      );
      if (result) {
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      return result;
    },
    [execute]
  );

  return { register, loading, error, success };
}

export function useCurrentUser() {
  return useFetch<UserResponse>(
    () => authAPI.getCurrentUser(),
    []
  );
}

// ============================================================================
// SITES HOOKS
// ============================================================================

export function useSites(companyId?: number, skip = 0, limit = 100) {
  return useFetch<ConstructionSiteResponse[]>(
    () => sitesAPI.getSites(skip, limit),
    [companyId, skip, limit]
  );
}

export function useSite(siteId: number) {
  return useFetch<ConstructionSiteResponse>(
    () => sitesAPI.getSite(siteId),
    [siteId]
  );
}

export function useSiteStats(siteId: number) {
  return useFetch(
    () => sitesAPI.getSiteStats(siteId),
    [siteId]
  );
}

export function useSiteDetections(siteId: number, skip = 0, limit = 100) {
  return useFetch<DetectionEventResponse[]>(
    () => sitesAPI.getSiteDetections(siteId, skip, limit),
    [siteId, skip, limit]
  );
}

export function useCreateSite() {
  const { execute, loading, error, success } = useAsyncOperation<ConstructionSiteResponse>();

  const createSite = useCallback(
    async (data: ConstructionSiteCreate) => {
      return await execute(() => sitesAPI.createSite(data).then(r => r.data));
    },
    [execute]
  );

  return { createSite, loading, error, success };
}

export function useUpdateSite(siteId: number) {
  const { execute, loading, error, success } = useAsyncOperation<ConstructionSiteResponse>();

  const updateSite = useCallback(
    async (data: ConstructionSiteUpdate) => {
      return await execute(() => sitesAPI.updateSite(siteId, data).then(r => r.data));
    },
    [execute, siteId]
  );

  return { updateSite, loading, error, success };
}

export function useDeleteSite(siteId: number) {
  const { execute, loading, error, success } = useAsyncOperation<void>();

  const deleteSite = useCallback(async () => {
    return await execute(() => sitesAPI.deleteSite(siteId).then(r => r.data));
  }, [execute, siteId]);

  return { deleteSite, loading, error, success };
}

// ============================================================================
// VEHICLE HOOKS
// ============================================================================

export function useVehicles(companyId?: number, skip = 0, limit = 100) {
  return useFetch<VehicleResponse[]>(
    () => vehiclesAPI.getSiteVehicles(companyId || 1, skip, limit),
    [companyId, skip, limit]
  );
}

export function useVehicle(vehicleId: number) {
  return useFetch<VehicleResponse>(
    () => vehiclesAPI.getVehicle(vehicleId, 1), // Add siteId as second parameter
    [vehicleId]
  );
}

export function useActiveVehicles(companyId: number) {
  return useFetch<ActiveVehiclesResponse[]>(
    () => vehiclesAPI.getActiveVehiclesForSite(companyId),
    [companyId]
  );
}

export function useCreateVehicle() {
  const { execute, loading, error, success } = useAsyncOperation<VehicleResponse>();

  const createVehicle = useCallback(
    async (siteId: number, data: VehicleCreate) => {
      return await execute(() => vehiclesAPI.createForSite(siteId, data).then((r: any) => r.data));
    },
    [execute]
  );

  return { createVehicle, loading, error, success };
}

export function useUpdateVehicle(vehicleId: number) {
  const { execute, loading, error, success } = useAsyncOperation<VehicleResponse>();

  const updateVehicle = useCallback(
    async (data: VehicleUpdate) => {
      return await execute(() => vehiclesAPI.updateVehicle(vehicleId, 1, data).then(r => r.data));
    },
    [execute, vehicleId]
  );

  return { updateVehicle, loading, error, success };
}

export function useUpdateVehicleLocation(vehicleId: number) {
  const { execute, loading, error, success } = useAsyncOperation<VehicleResponse>();

  const updateLocation = useCallback(
    async (data: VehicleLocationUpdate) => {
      return await execute(() => vehiclesAPI.updateVehicleLocation(vehicleId, 1, data).then(r => r.data));
    },
    [execute, vehicleId]
  );

  return { updateLocation, loading, error, success };
}

export function useDeleteVehicle(vehicleId: number) {
  const { execute, loading, error, success } = useAsyncOperation<void>();

  const deleteVehicle = useCallback(async () => {
    return await execute(() => vehiclesAPI.deleteVehicle(vehicleId, 1).then(r => r.data));
  }, [execute, vehicleId]);

  return { deleteVehicle, loading, error, success };
}

// ============================================================================
// EMPLOYEE HOOKS
// ============================================================================

export function useEmployees(companyId?: number, skip = 0, limit = 100) {
  return useFetch<EmployeeResponse[]>(
    () => employeesAPI.getSiteEmployees(companyId || 1, skip, limit),
    [companyId, skip, limit]
  );
}

export function useEmployee(employeeId: number) {
  return useFetch<EmployeeResponse>(
    () => employeesAPI.getEmployee(employeeId, 1),
    [employeeId]
  );
}

export function useAttendanceStats(companyId: number, startDate?: string, endDate?: string) {
  return useFetch<AttendanceStatsResponse>(
    () => employeesAPI.getAttendanceStats(companyId),
    [companyId, startDate, endDate]
  );
}

export function useOnSiteEmployees(siteId: number) {
  return useFetch<OnSiteEmployeeResponse[]>(
    () => employeesAPI.getOnSiteEmployees(siteId),
    [siteId]
  );
}

export function useCreateEmployee() {
  const { execute, loading, error, success } = useAsyncOperation<EmployeeResponse>();

  const createEmployee = useCallback(
    async (siteId: number, data: EmployeeCreate) => {
      return await execute(() => employeesAPI.createForSite(siteId, data).then(r => r.data));
    },
    [execute]
  );

  return { createEmployee, loading, error, success };
}

export function useUpdateEmployee(employeeId: number) {
  const { execute, loading, error, success } = useAsyncOperation<EmployeeResponse>();

  const updateEmployee = useCallback(
    async (data: EmployeeUpdate) => {
      return await execute(() => employeesAPI.updateEmployee(employeeId, 1, data).then(r => r.data));
    },
    [execute, employeeId]
  );

  return { updateEmployee, loading, error, success };
}

export function useCheckInEmployee(employeeId: number) {
  const { execute, loading, error, success } = useAsyncOperation<EmployeeResponse>();

  const checkIn = useCallback(
    async (data: EmployeeCheckIn) => {
      return await execute(() => employeesAPI.checkInEmployee(employeeId, 1, data).then(r => r.data));
    },
    [execute, employeeId]
  );

  return { checkIn, loading, error, success };
}

export function useCheckOutEmployee(employeeId: number) {
  const { execute, loading, error, success } = useAsyncOperation<EmployeeResponse>();

  const checkOut = useCallback(
    async (data: EmployeeCheckOut) => {
      return await execute(() => employeesAPI.checkOutEmployee(employeeId, 1, data).then(r => r.data));
    },
    [execute, employeeId]
  );

  return { checkOut, loading, error, success };
}

export function useDeleteEmployee(employeeId: number) {
  const { execute, loading, error, success } = useAsyncOperation<void>();

  const deleteEmployee = useCallback(async () => {
    return await execute(() => employeesAPI.deleteEmployee(employeeId, 1).then(r => r.data));
  }, [execute, employeeId]);

  return { deleteEmployee, loading, error, success };
}

// ============================================================================
// TRAFFIC HOOKS
// ============================================================================

export function useGatePasses(siteId?: number, skip = 0, limit = 100) {
  return useFetch<GatePassResponse[]>(
    () => trafficAPI.getGatePasses(skip, limit, siteId),
    [siteId, skip, limit]
  );
}

export function useCurrentSiteTraffic(siteId: number) {
  return useFetch<CurrentSiteTrafficResponse>(
    () => trafficAPI.getCurrentSiteTraffic(siteId),
    [siteId]
  );
}

export function useSiteTrafficStats(siteId: number, startDate?: string, endDate?: string) {
  return useFetch<TrafficStatsResponse>(
    () => trafficAPI.getSiteTrafficStats(siteId),
    [siteId, startDate, endDate]
  );
}

// export function useRecordTrafficVehicle() {
//   const { execute, loading, error, success } = useAsyncOperation<any>();

//   const recordVehicle = useCallback(
//     async (siteId: number, data: TrafficVehicleCreate) => {
//       return await execute(() => trafficAPI.recordTrafficVehicle(siteId, data).then(r => r.data));
//     },
//     [execute]
//   );

//   return { recordVehicle, loading, error, success };
// }

// ============================================================================
// QUOTATION HOOKS
// ============================================================================

export function useQuotations(companyId?: number, status?: string, skip = 0, limit = 100) {
  return useFetch<QuotationResponse[]>(
    () => quotationsAPI.getQuotations(skip, limit, status),
    [companyId, status, skip, limit]
  );
}

export function useQuotation(quotationId: number) {
  return useFetch<QuotationResponse>(
    () => quotationsAPI.getQuotation(quotationId),
    [quotationId]
  );
}

export function useQuotationStats(companyId: number, startDate?: string, endDate?: string) {
  return useFetch<QuotationStatsResponse>(
    () => quotationsAPI.getQuotationStats(),
    [companyId, startDate, endDate]
  );
}

export function useCreateQuotation() {
  const { execute, loading, error, success } = useAsyncOperation<QuotationResponse>();

  const createQuotation = useCallback(
    async (data: QuotationCreate) => {
      return await execute(() => quotationsAPI.createQuotation(data).then(r => r.data));
    },
    [execute]
  );

  return { createQuotation, loading, error, success };
}

export function useUpdateQuotation(quotationId: number) {
  const { execute, loading, error, success } = useAsyncOperation<QuotationResponse>();

  const updateQuotation = useCallback(
    async (data: QuotationUpdate) => {
      return await execute(() => quotationsAPI.updateQuotation(quotationId, data).then(r => r.data));
    },
    [execute, quotationId]
  );

  return { updateQuotation, loading, error, success };
}

export function useApproveQuotation(quotationId: number) {
  const { execute, loading, error, success } = useAsyncOperation<QuotationResponse>();

  const approve = useCallback(
    async () => {
      return await execute(() => quotationsAPI.approveQuotation(quotationId).then(r => r.data));
    },
    [execute, quotationId]
  );

  return { approve, loading, error, success };
}

export function useRejectQuotation(quotationId: number) {
  const { execute, loading, error, success } = useAsyncOperation<QuotationResponse>();

  const reject = useCallback(
    async () => {
      return await execute(() => quotationsAPI.rejectQuotation(quotationId).then(r => r.data));
    },
    [execute, quotationId]
  );

  return { reject, loading, error, success };
}

export function useDeleteQuotation(quotationId: number) {
  const { execute, loading, error, success } = useAsyncOperation<void>();

  const deleteQuotation = useCallback(async () => {
    return await execute(() => quotationsAPI.deleteQuotation(quotationId).then(r => r.data));
  }, [execute, quotationId]);

  return { deleteQuotation, loading, error, success };
}

// ============================================================================
// ORDER HOOKS
// ============================================================================

export function useOrders(companyId?: number, status?: string, skip = 0, limit = 100) {
  return useFetch<OrderResponse[]>(
    () => ordersAPI.getOrders(skip, limit, status),
    [companyId, status, skip, limit]
  );
}

export function useOrder(orderId: number) {
  return useFetch<OrderResponse>(
    () => ordersAPI.getOrder(orderId),
    [orderId]
  );
}

export function useOrderStats(companyId: number, startDate?: string, endDate?: string) {
  return useFetch<OrderStatsResponse>(
    () => ordersAPI.getOrderStats(),
    [companyId, startDate, endDate]
  );
}

export function useCreateOrder() {
  const { execute, loading, error, success } = useAsyncOperation<OrderResponse>();

  const createOrder = useCallback(
    async (data: OrderCreate) => {
      return await execute(() => ordersAPI.createOrder(data).then(r => r.data));
    },
    [execute]
  );

  return { createOrder, loading, error, success };
}

export function useUpdateOrder(orderId: number) {
  const { execute, loading, error, success } = useAsyncOperation<OrderResponse>();

  const updateOrder = useCallback(
    async (data: OrderUpdate) => {
      return await execute(() => ordersAPI.updateOrder(orderId, data).then(r => r.data));
    },
    [execute, orderId]
  );

  return { updateOrder, loading, error, success };
}

export function useShipOrder(orderId: number) {
  const { execute, loading, error, success } = useAsyncOperation<OrderResponse>();

  const ship = useCallback(
    async () => {
      return await execute(() => ordersAPI.shipOrder(orderId).then(r => r.data));
    },
    [execute, orderId]
  );

  return { ship, loading, error, success };
}

export function useDeliverOrder(orderId: number) {
  const { execute, loading, error, success } = useAsyncOperation<OrderResponse>();

  const deliver = useCallback(
    async () => {
      return await execute(() => ordersAPI.deliverOrder(orderId).then(r => r.data));
    },
    [execute, orderId]
  );

  return { deliver, loading, error, success };
}

export function useCancelOrder(orderId: number) {
  const { execute, loading, error, success } = useAsyncOperation<OrderResponse>();

  const cancel = useCallback(
    async () => {
      return await execute(() => ordersAPI.cancelOrder(orderId).then(r => r.data));
    },
    [execute, orderId]
  );

  return { cancel, loading, error, success };
}

export function useDeleteOrder(orderId: number) {
  const { execute, loading, error, success } = useAsyncOperation<void>();

  const deleteOrder = useCallback(async () => {
    return await execute(() => ordersAPI.deleteOrder(orderId).then(r => r.data));
  }, [execute, orderId]);

  return { deleteOrder, loading, error, success };
}

// ============================================================================
// USER MANAGEMENT HOOKS
// ============================================================================

// User management will be implemented directly in the dashboard component
// using fetch API calls to avoid API dependency issues

// ============================================================================
// DETECTION HOOKS
// ============================================================================

export function useLatestDetections(limit = 10) {
  return useFetch<DetectionEventResponse[]>(
    () => detectionAPI.getLatestDetections(limit),
    [limit]
  );
}

export function useDetections(deviceId?: string, limit = 100, skip = 0) {
  return useFetch<DetectionEventResponse[]>(
    () => detectionAPI.getDetections(deviceId, limit, skip),
    [deviceId, limit, skip]
  );
}

export function useDetectionStats() {
  return useFetch<StatsResponse>(
    () => detectionAPI.getStats(),
    []
  );
}

// ============================================================================
// DEVICE HOOKS
// ============================================================================

export function useDeviceStatus() {
  return useFetch<DeviceStatusResponse[]>(
    () => deviceAPI.getStatus(),
    []
  );
}

export function useDeviceStatusById(deviceId: string) {
  return useFetch<DeviceStatusResponse>(
    () => deviceAPI.getDeviceStatus(deviceId),
    [deviceId]
  );
}

// ============================================================================
// SYSTEM HOOKS
// ============================================================================

export function useSystemHealth() {
  return useFetch(
    () => systemAPI.getHealth(),
    []
  );
}

export function useSystemInfo() {
  return useFetch(
    () => systemAPI.getSystemInfo(),
    []
  );
}
