import { useState, useEffect } from 'react';

const StatsCard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats/application-summary');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading stats...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-value">{stats.totalApplications}</div>
        <div className="stat-label">Total Applications</div>
      </div>
      <div className="stat">
        <div className="stat-value">{stats.statusBreakdown.pending}</div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat">
        <div className="stat-value">{stats.statusBreakdown.interview}</div>
        <div className="stat-label">Interview</div>
      </div>
      <div className="stat">
        <div className="stat-value">{stats.statusBreakdown.accepted}</div>
        <div className="stat-label">Accepted</div>
      </div>
      <div className="stat">
        <div className="stat-value">{stats.statusBreakdown.rejected}</div>
        <div className="stat-label">Rejected</div>
      </div>
    </div>
  );
};

export default StatsCard;
