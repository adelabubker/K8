// src/pages/LeadsPage.jsx — Admin inquiries management
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { Mail, Phone, Trash2, Search, RefreshCw, MessageSquare, ExternalLink, Filter } from 'lucide-react';

const LeadsPage = () => {
  const { isFullAdmin } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      setLeads(res.data.data);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Inquiry deleted');
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/contacts/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
                        l.email.toLowerCase().includes(search.toLowerCase()) ||
                        l.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'var(--accent-primary)';
      case 'contacted': return '#f59e0b';
      case 'qualified': return '#34d399';
      case 'closed': return 'var(--text-muted)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <DashboardLayout>
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Leads & Inquiries</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {leads.length} total submissions from Contact Page
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchLeads}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'New', count: leads.filter(l => l.status === 'new').length, color: 'var(--accent-primary)' },
            { label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: '#f59e0b' },
            { label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: '#34d399' },
            { label: 'Closed', count: leads.filter(l => l.status === 'closed').length, color: 'var(--text-muted)' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
              <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: '700', color }}>{count}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', maxWidth: '300px', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search by name, email, company..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '44px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="All">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 120px 140px 100px',
            padding: '14px 24px', background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Contact</span><span>Details</span><span>Service/Budget</span><span>Status</span><span>Date</span><span>Actions</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={40} style={{ opacity: 0.25 }} />
              <p style={{ fontWeight: '600' }}>No inquiries found</p>
            </div>
          ) : (
            filtered.map((l, i) => (
              <div key={l._id} style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 120px 140px 100px',
                padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)',
                alignItems: 'center', transition: 'background 0.15s ease',
                animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Contact Info */}
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{l.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{l.company || 'No Company'}</div>
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Mail size={12} /> {l.email}
                  </div>
                  {l.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <Phone size={12} /> {l.phone}
                    </div>
                  )}
                </div>

                {/* Service/Budget */}
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '500' }}>{l.service}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{l.budget || 'N/A'}</div>
                </div>

                {/* Status Select */}
                <div>
                  <select
                    value={l.status}
                    onChange={e => handleStatusUpdate(l._id, e.target.value)}
                    disabled={updating === l._id}
                    className="form-select"
                    style={{
                      padding: '4px 20px 4px 8px',
                      fontSize: '0.75rem',
                      color: getStatusColor(l.status),
                      borderColor: `${getStatusColor(l.status)}40`,
                    }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Date */}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {new Date(l.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    title="View Message"
                    onClick={() => {
                      alert(`Message from ${l.name}:\n\n${l.message}`);
                    }}
                    style={{ padding: '6px 10px' }}
                  >
                    <MessageSquare size={13} />
                  </button>
                  {isFullAdmin && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(l._id, l.name)}
                      disabled={deleting === l._id}
                      style={{ padding: '6px 10px' }}
                    >
                      {deleting === l._id ? <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} /> : <Trash2 size={13} />}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadsPage;
