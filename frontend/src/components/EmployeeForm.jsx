import { useState } from 'react';
import { createEmployee } from '../api/axios';

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Other',
];

export default function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createEmployee(form);
      setSuccess(true);
      setForm({ employee_id: '', full_name: '', email: '', department: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const msgs = Object.entries(data.errors)
          .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
          .join(' | ');
        setError(msgs);
      } else {
        setError('Failed to create employee. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Add New Employee</h2>

      {success && (
        <div className="alert alert-success">✅ Employee added successfully!</div>
      )}
      {error && (
        <div className="alert alert-error">⚠️ {error}</div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Employee ID *</label>
          <input
            className="form-input"
            type="text"
            name="employee_id"
            placeholder="e.g. EMP-001"
            value={form.employee_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            className="form-input"
            type="text"
            name="full_name"
            placeholder="e.g. Jane Doe"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="e.g. jane@company.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department *</label>
          <select
            className="form-input"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department...</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-submit-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : '+ Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
