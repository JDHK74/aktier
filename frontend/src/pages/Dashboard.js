import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats
      const statsResponse = await leadsAPI.getStats(user?.id);
      setStats(statsResponse.data.data);

      // Fetch recent leads
      const leadsResponse = await leadsAPI.getAll({ limit: 5 });
      setRecentLeads(leadsResponse.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>
        <p className="welcome-text">Välkommen, {user?.firstName}!</p>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.total || 0}</div>
              <div className="stat-label">Totalt Leads</div>
            </div>
          </div>

          <div className="stat-card hot">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.hot || 0}</div>
              <div className="stat-label">Hot Leads</div>
            </div>
          </div>

          <div className="stat-card warm">
            <div className="stat-icon">🌤️</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.warm || 0}</div>
              <div className="stat-label">Warm Leads</div>
            </div>
          </div>

          <div className="stat-card cold">
            <div className="stat-icon">❄️</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.cold || 0}</div>
              <div className="stat-label">Cold Leads</div>
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="card-header">
            <h2>Senaste Leads</h2>
            <Link to="/leads" className="btn btn-primary">Visa alla</Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className="no-data">Inga leads ännu.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Namn</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Kommun</th>
                    <th>Kvalitet</th>
                    <th>Tilldelad till</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.first_name} {lead.last_name}</td>
                      <td>{lead.email || '-'}</td>
                      <td>{lead.phone || '-'}</td>
                      <td>{lead.kommun || '-'}</td>
                      <td>
                        {lead.quality && (
                          <span className={`badge badge-${lead.quality}`}>
                            {lead.quality}
                          </span>
                        )}
                      </td>
                      <td>
                        {lead.assigned_first_name
                          ? `${lead.assigned_first_name} ${lead.assigned_last_name}`
                          : 'Ej tilldelad'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
