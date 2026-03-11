import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ──── Employee APIs ────────────────────────────────────────
export const getEmployees = (search = '') =>
  api.get(`/employees/${search ? `?search=${search}` : ''}`);

export const createEmployee = (data) => api.post('/employees/', data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}/`);

// ──── Attendance APIs ─────────────────────────────────────
export const getAttendance = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.date) params.append('date', filters.date);
  if (filters.employee_id) params.append('employee_id', filters.employee_id);
  if (filters.status) params.append('status', filters.status);
  return api.get(`/attendance/?${params.toString()}`);
};

export const markAttendance = (data) => api.post('/attendance/', data);

export const toggleAttendance = (id) => api.patch(`/attendance/toggle/${id}/`);

export const getEmployeeAttendance = (employeeId, date = '') =>
  api.get(`/attendance/${employeeId}/${date ? `?date=${date}` : ''}`);

// ──── Dashboard ───────────────────────────────────────────
export const getDashboardSummary = () => api.get('/dashboard/');

export default api;
