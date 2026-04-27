import { useState, useEffect } from 'react';

const ApplicationForm = ({ onSubmit, initialData = null, onCancel = null, refreshKey = 0 }) => {
  const [formData, setFormData] = useState({
    companyId: '',
    position: '',
    salaryRange: '',
    status: 'pending',
    dateApplied: '',
    expectedReplyDate: '',
    applicationNotes: ''
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        companyId: initialData.companyId?._id || initialData.companyId || '',
        position: initialData.position || '',
        salaryRange: initialData.salaryRange || '',
        status: initialData.status || 'pending',
        dateApplied: initialData.dateApplied ? initialData.dateApplied.split('T')[0] : '',
        expectedReplyDate: initialData.expectedReplyDate ? initialData.expectedReplyDate.split('T')[0] : '',
        applicationNotes: initialData.applicationNotes || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        if (data.success) setCompanies(data.data);
      } catch (err) {
        console.error('Failed to fetch companies', err);
      }
    };
    fetchCompanies();
  }, [refreshKey]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      dateApplied: new Date(formData.dateApplied).toISOString(),
      expectedReplyDate: formData.expectedReplyDate ? new Date(formData.expectedReplyDate).toISOString() : null
    };

    try {
      const url = initialData?._id ? `/api/applications/${initialData._id}` : '/api/applications';
      const method = initialData?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message);
      }

      onSubmit(data.data);
      if (!initialData) {
        setFormData({
          companyId: '',
          position: '',
          salaryRange: '',
          status: 'pending',
          dateApplied: '',
          expectedReplyDate: '',
          applicationNotes: ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">{initialData ? 'Edit Application' : 'Add Application'}</h2>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        
        <div className="form-row">
          <div className="form-group">
            <label>Company</label>
            <select name="companyId" value={formData.companyId} onChange={handleChange} required>
              <option value="">Select company...</option>
              {companies.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Position</label>
            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Junior Developer" required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Salary Range</label>
            <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="25–30k" required />
          </div>
          <div className="form-group">
            <label>Date Applied</label>
            <input type="date" name="dateApplied" value={formData.dateApplied} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expected Reply</label>
            <input type="date" name="expectedReplyDate" value={formData.expectedReplyDate} onChange={handleChange} />
          </div>
        </div>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea name="applicationNotes" value={formData.applicationNotes} onChange={handleChange} placeholder="Interview details, contact info..." />
        </div>
        
        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? 'Saving...' : (initialData ? 'Update Application' : 'Add Application')}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancel</button>
        )}
      </form>
    </div>
  );
};

export default ApplicationForm;
