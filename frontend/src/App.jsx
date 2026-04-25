import { useState } from 'react';
import StatsCard from './components/StatsCard';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';

function App() {
  const [editingApplication, setEditingApplication] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddApplication = (newApp) => {
    setShowForm(false);
    window.location.reload();
  };

  const handleEditApplication = (app) => {
    setEditingApplication(app);
    setShowForm(true);
  };

  const handleUpdateApplication = (updatedApp) => {
    setEditingApplication(null);
    setShowForm(false);
    window.location.reload();
  };

  const handleDeleteApplication = (id) => {
    // ApplicationList handles the actual delete
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

      <StatsCard />

      {showForm ? (
        <ApplicationForm
          initialData={editingApplication}
          onSubmit={editingApplication ? handleUpdateApplication : handleAddApplication}
          onCancel={handleCancelEdit}
        />
      ) : (
        <button className="btn btn-submit" onClick={() => setShowForm(true)}>
          Add New Application
        </button>
      )}

      <ApplicationList
        onEdit={handleEditApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
}

export default App;
