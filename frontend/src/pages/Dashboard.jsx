import { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import { getDashboardSummary, getEmployees, getAttendance } from '../api/axios';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, employeesRes, attendanceRes] = await Promise.all([
        getDashboardSummary(),
        getEmployees(),
        getAttendance(),
      ]);
      setSummary(summaryRes.data);
      setRecentEmployees((employeesRes.data.results || []).slice(0, 5));
      setRecentAttendance((attendanceRes.data.results || []).slice(0, 5));
    } catch {
      setError('Failed to load dashboard data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your workforce at a glance</p>
      </div>

      {error && (
        <div className="alert alert-error">⚠️ {error}</div>
      )}

      <DashboardCards summary={summary} loading={loading} />

      <div className="two-col-grid">
        {/* Recent Employees */}
        <div className="card">
          <h2 className="card-title">Recent Employees</h2>
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : recentEmployees.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👤</span>
              <p>No employees yet. Add some from the Employees page.</p>
            </div>
          ) : (
            <ul className="mini-list">
              {recentEmployees.map((emp) => (
                <li key={emp.id} className="mini-list-item">
                  <div className="mini-avatar">{emp.full_name.charAt(0)}</div>
                  <div>
                    <p className="mini-name">{emp.full_name}</p>
                    <p className="mini-sub">{emp.employee_id} · {emp.department}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="card">
          <h2 className="card-title">Recent Attendance</h2>
          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : recentAttendance.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No attendance records yet.</p>
            </div>
          ) : (
            <ul className="mini-list">
              {recentAttendance.map((rec) => (
                <li key={rec.id} className="mini-list-item">
                  <span className={`status-dot status-${rec.status.toLowerCase()}`} />
                  <div>
                    <p className="mini-name">{rec.employee_name}</p>
                    <p className="mini-sub">
                      {new Date(rec.date).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })} ·{' '}
                      <span className={rec.status === 'Present' ? 'text-green' : 'text-red'}>
                        {rec.status}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
