import { useState } from 'react';
import { toggleAttendance } from '../api/axios';

export default function AttendanceTable({ records, loading, onToggled }) {
  const [togglingId, setTogglingId] = useState(null);

  const handleToggle = async (rec) => {
    const newStatus = rec.status === 'Present' ? 'Absent' : 'Present';
    if (!window.confirm(`Change ${rec.employee_name}'s status on ${rec.date} to ${newStatus}?`)) return;
    setTogglingId(rec.id);
    try {
      await toggleAttendance(rec.id);
      if (onToggled) onToggled();
    } catch {
      alert('Failed to toggle attendance status.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading attendance records…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="card-title">Attendance Records</h2>
        <span className="badge">{records.length} records</span>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <p>No attendance records found. Try adjusting your filters or mark attendance above.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id}>
                  <td><span className="emp-id-badge">{rec.employee_emp_id}</span></td>
                  <td className="font-medium">{rec.employee_name}</td>
                  <td className="text-muted">
                    {new Date(rec.date).toLocaleDateString('en-GB', {
                      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <span className={`status-badge status-${rec.status.toLowerCase()}`}>
                      {rec.status === 'Present' ? '✅' : '❌'} {rec.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${rec.status === 'Present' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleToggle(rec)}
                      disabled={togglingId === rec.id}
                    >
                      {togglingId === rec.id ? (
                        <span className="spinner-sm" />
                      ) : rec.status === 'Present' ? (
                        'Mark Absent'
                      ) : (
                        'Mark Present'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
