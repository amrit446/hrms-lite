import { useState, useEffect } from 'react';
import { markAttendance, getEmployees } from '../api/axios';

export default function AttendanceForm({ onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employee: '', date: '', status: 'Present' });
  const [loading, setLoading] = useState(false);
  const [loadingEmps, setLoadingEmps] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data.results || []))
      .catch(() => setEmployees([]))
      .finally(() => setLoadingEmps(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await markAttendance(form);
      const wasUpdated = res.data.updated;
      setSuccess(
        wasUpdated
          ? '🔄 Attendance status updated successfully!'
          : '✅ Attendance marked successfully!'
      );
      setForm({ employee: '', date: '', status: 'Present' });
      if (onSuccess) onSuccess();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const msgs = Object.values(data.errors).flat().join(' | ');
        setError(msgs);
      } else {
        setError('Failed to mark attendance. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Mark Attendance</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Employee *</label>
          <select
            className="form-input"
            name="employee"
            value={form.employee}
            onChange={handleChange}
            required
            disabled={loadingEmps}
          >
            <option value="">
              {loadingEmps ? 'Loading employees…' : 'Select employee…'}
            </option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_id} — {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date *</label>
          <input
            className="form-input"
            type="date"
            name="date"
            value={form.date}
            max={new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status *</label>
          <div className="status-toggle">
            {['Present', 'Absent'].map((s) => (
              <label
                key={s}
                className={`status-option ${form.status === s ? `active-${s.toLowerCase()}` : ''}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={handleChange}
                  hidden
                />
                {s === 'Present' ? '✅' : '❌'} {s}
              </label>
            ))}
          </div>
        </div>

        <div className="form-submit-row">
          <button className="btn btn-primary" type="submit" disabled={loading || loadingEmps}>
            {loading ? <span className="spinner-sm" /> : 'Mark Attendance'}
          </button>
        </div>
      </form>
    </div>
  );
}
