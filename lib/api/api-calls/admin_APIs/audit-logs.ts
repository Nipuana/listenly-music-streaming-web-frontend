// API layer for admin audit/security logs
// Provides methods to list and retrieve audit logs from backend

import axios from "../../axios";
import { API } from "../../endpoints";

function handleApiError(err: any, defaultMessage: string): never {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error" || !err.response) {
    throw new Error("Unable to connect to server. Please try again later.");
  }

  throw new Error(err.response?.data?.message || err.message || defaultMessage);
}

// List audit logs with optional query params (limit, page, adminId, action, etc.)
export const listAuditLogs = async (params?: Record<string, string | number>) => {
  try {
    const query = params && Object.keys(params).length ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    const response = await axios.get(`/api/admin/audit-logs${query}`);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch audit logs");
  }
};

// Get an audit log by id
export const getAuditLogById = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/audit-logs/${id}`);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch audit log");
  }
};
