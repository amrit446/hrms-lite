import { useState } from 'react';
import { deleteEmployee } from '../api/axios';

export default function EmployeeTable({ employees, loading, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete ${emp.full_name}? This will also remove all their attendance records.`)) return;
    setDeletingId(emp.id);
    setError(null);
    try {
      await deleteEmployee(emp.id);
      if (onDeleted) onDeleted();
    } catch (err) {
      setError(`Failed to delete employee: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="card-title">Employee List</h2>
        <span className="badge">{employees.length} total</span>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {employees.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🗂️</span>
          <p>No employees found. Add your first employee above!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td><span className="emp-id-badge">{emp.employee_id}</span></td>
                  <td className="font-medium">{emp.full_name}</td>
                  <td className="text-muted">{emp.email}</td>
                  <td>
                    <span className="dept-badge">{emp.department}</span>
                  </td>
                  <td className="text-muted">
                    {new Date(emp.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(emp)}
                      disabled={deletingId === emp.id}
                    >
                      {deletingId === emp.id ? <span className="spinner-sm" /> : 'Delete'}
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
