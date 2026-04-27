import { useState, useCallback } from 'react';
import StatsCard from './components/StatsCard';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import CompanyForm from './components/CompanyForm';

function App() {
  const [editingApplication, setEditingApplication] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleAddApplication = (newApp) => {
    setShowForm(false);
    triggerRefresh();
  };

  const handleEditApplication = (app) => {
    setEditingApplication(app);
    setShowForm(true);
  };

  const handleUpdateApplication = (updatedApp) => {
    setEditingApplication(null);
    setShowForm(false);
    triggerRefresh();
  };

  const handleDeleteApplication = (id) => {
    triggerRefresh();
  };

  const handleCancelEdit = () => {
    setEditingApplication(null);
    setShowForm(false);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Job Tracker</h1>
        <p>Track your job applications in one place</p>
      </div>

      <StatsCard refreshKey={refreshKey} />

      <CompanyForm onCompanyAdded={triggerRefresh} />

      {showForm ? (
        <ApplicationForm
          initialData={editingApplication}
          onSubmit={editingApplication ? handleUpdateApplication : handleAddApplication}
          onCancel={handleCancelEdit}
          refreshKey={refreshKey}
        />
      ) : (
        <button className="btn btn-submit" onClick={() => setShowForm(true)}>
          Add New Application
        </button>
      )}

      <ApplicationList
        key={refreshKey}
        onEdit={handleEditApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
}

export default App;
