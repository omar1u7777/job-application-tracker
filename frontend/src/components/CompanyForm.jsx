import { useState } from 'react';

const CompanyForm = ({ onCompanyAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    industry: '',
    website: '',
    size: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      onCompanyAdded(data.data);
      setFormData({ name: '', location: '', industry: '', website: '', size: 'Medium' });
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-edit" onClick={() => setOpen(true)}>
          + Add New Company
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Add Company</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <div className="form-row">
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Spotify" required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Stockholm" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Industry</label>
            <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology" required />
          </div>
          <div className="form-group">
            <label>Size</label>
            <select name="size" value={formData.size} onChange={handleChange}>
              <option value="Startup">Startup</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Website</label>
          <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="https://careers.company.com" />
        </div>
        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Company'}
        </button>
        <button type="button" className="btn btn-cancel" onClick={() => setOpen(false)}>Cancel</button>
      </form>
    </div>
  );
};

export default CompanyForm;
