import { useState, useEffect } from 'react';

const ApplicationList = ({ onEdit, onDelete }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('dateApplied');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await fetch(`/api/applications?${params}`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setApplications(applications.filter(app => app._id !== id));
        onDelete(id);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete application');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSorted = applications
    .filter(app => {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.position?.toLowerCase().includes(searchLower) ||
        app.companyId?.name?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'companyId') {
        aVal = a.companyId?.name || '';
        bVal = b.companyId?.name || '';
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) return <div className="loading">Loading applications...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <h2 className="card-title">Applications</h2>
      
      <div className="controls">
        <input
          type="text"
          placeholder="Search by position or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('companyId')} style={{ cursor: 'pointer' }}>
              Company {sortField === 'companyId' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('position')} style={{ cursor: 'pointer' }}>
              Position {sortField === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('salaryRange')} style={{ cursor: 'pointer' }}>
              Salary {sortField === 'salaryRange' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('dateApplied')} style={{ cursor: 'pointer' }}>
              Date Applied {sortField === 'dateApplied' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSorted.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                No applications found.
              </td>
            </tr>
          ) : (
            filteredAndSorted.map(app => (
              <tr key={app._id}>
                <td>{app.companyId?.name || 'N/A'}</td>
                <td>{app.position}</td>
                <td>{app.salaryRange}</td>
                <td>
                  <span className={`badge badge-${app.status}`}>{app.status}</span>
                </td>
                <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-small btn-edit" onClick={() => onEdit(app)}>
                    Edit
                  </button>
                  <button className="btn btn-small btn-delete" onClick={() => handleDelete(app._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;
