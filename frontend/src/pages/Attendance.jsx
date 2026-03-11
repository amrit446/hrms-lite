import { useState, useEffect, useCallback } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';
import { getAttendance, getEmployees, getEmployeeAttendance } from '../api/axios';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterEmpId, setFilterEmpId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Per-employee summary (bonus feature)
  const [empSummary, setEmpSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data.results || []))
      .catch(() => setEmployees([]));
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAttendance({
        date: filterDate,
        employee_id: filterEmpId,
        status: filterStatus,
      });
      setRecords(res.data.results || []);
    } catch {
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterEmpId, filterStatus]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // Load employee summary when a specific employee is selected
  useEffect(() => {
    if (!filterEmpId) { setEmpSummary(null); return; }
    setSummaryLoading(true);
    getEmployeeAttendance(filterEmpId)
      .then((res) => setEmpSummary(res.data))
      .catch(() => setEmpSummary(null))
      .finally(() => setSummaryLoading(false));
  }, [filterEmpId]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterEmpId('');
    setFilterStatus('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-subtitle">Mark and track daily attendance records</p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <AttendanceForm onSuccess={fetchRecords} />

      {/* Employee Summary Panel */}
      {filterEmpId && (
        <div className="card">
          <h2 className="card-title">Employee Summary</h2>
          {summaryLoading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : empSummary ? (
            <div className="emp-summary-grid">
              <div className="emp-summary-info">
                <p><strong>Name:</strong> {empSummary.employee.full_name}</p>
                <p><strong>ID:</strong> {empSummary.employee.employee_id}</p>
                <p><strong>Dept:</strong> {empSummary.employee.department}</p>
              </div>
              <div className="summary-stat stat-blue">
                <span className="stat-value">{empSummary.summary.total_days}</span>
                <span className="stat-label">Total Days</span>
              </div>
              <div className="summary-stat stat-green">
                <span className="stat-value">{empSummary.summary.present}</span>
                <span className="stat-label">Present</span>
              </div>
              <div className="summary-stat stat-red">
                <span className="stat-value">{empSummary.summary.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="card-header-row">
          <h2 className="card-title">Filter Records</h2>
          {(filterDate || filterEmpId || filterStatus) && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              ✕ Clear Filters
            </button>
          )}
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Filter by Date</label>
            <input
              className="form-input"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Filter by Employee</label>
            <select
              className="form-input"
              value={filterEmpId}
              onChange={(e) => setFilterEmpId(e.target.value)}
            >
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.employee_id} — {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Filter by Status</label>
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      <AttendanceTable records={records} loading={loading} onToggled={fetchRecords} />
    </div>
  );
}
