import React, { useState, useEffect } from 'react';
import { leadsAPI, authAPI } from '../services/api';
import LeadForm from '../components/LeadForm';
import './Leads.css';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    quality: '',
    assignedTo: ''
  });

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, [filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await leadsAPI.getAll(filters);
      setLeads(response.data.data);
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleCreateLead = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Är du säker på att du vill ta bort detta lead?')) {
      return;
    }

    try {
      await leadsAPI.delete(id);
      fetchLeads();
    } catch (err) {
      alert('Failed to delete lead');
      console.error(err);
    }
  };

  const handleFormSubmit = async (leadData) => {
    try {
      if (editingLead) {
        await leadsAPI.update(editingLead.id, leadData);
      } else {
        await leadsAPI.create(leadData);
      }
      setShowForm(false);
      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      throw err;
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading && leads.length === 0) {
    return <div className="loading">Loading leads...</div>;
  }

  return (
    <div className="leads-page">
      <div className="container">
        <div className="page-header">
          <h1>Leads</h1>
          <button onClick={handleCreateLead} className="btn btn-primary">
            + Nytt Lead
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Filters */}
        <div className="card filters-card">
          <div className="filters">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Sök namn, email, telefon..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="form-group">
              <select
                className="form-control"
                value={filters.quality}
                onChange={(e) => handleFilterChange('quality', e.target.value)}
              >
                <option value="">Alla kvaliteter</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>

            <div className="form-group">
              <select
                className="form-control"
                value={filters.assignedTo}
                onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              >
                <option value="">Alla säljare</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="card">
          {leads.length === 0 ? (
            <p className="no-data">Inga leads hittades.</p>
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
                    <th>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.first_name} {lead.last_name}</strong>
                      </td>
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
                          : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditLead(lead)}
                            className="btn btn-secondary btn-sm"
                          >
                            Redigera
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Ta bort
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          users={users}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      )}
    </div>
  );
};

export default Leads;
