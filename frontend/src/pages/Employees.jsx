import { useState, useEffect, useCallback } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import { getEmployees } from '../api/axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees(search);
      setEmployees(res.data.results || []);
    } catch {
      setError('Failed to load employees. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Employee Management</h1>
        <p className="page-subtitle">Add, view, and manage your team members</p>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <EmployeeForm onSuccess={fetchEmployees} />

      <div className="search-bar-row">
        <input
          className="form-input search-input"
          type="text"
          placeholder="🔍  Search by name, ID, or department…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <EmployeeTable employees={employees} loading={loading} onDeleted={fetchEmployees} />
    </div>
  );
}
