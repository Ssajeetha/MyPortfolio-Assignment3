import React, { useState, useEffect } from 'react';
import auth from '../auth-helper';

function Education() {
  // State for qualifications list from MongoDB
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if current user is Admin
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt && jwt.user && jwt.user.role === 'admin';

  // Form State (for adding & editing)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    firstname: jwt?.user?.name || 'Loshika',
    lastname: 'Pragasam',
    email: jwt?.user?.email || 'lpragasa@my.centennialcollege.ca',
    description: '',
    completion: new Date().toISOString().split('T')[0]
  });

  // 1. READ: Fetch all qualifications from MongoDB
  const loadQualifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/qualifications');
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setQualifications(data);
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQualifications();
  }, []);

  // Handle typing inside Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open Form to Add
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      firstname: jwt?.user?.name || 'Loshika',
      lastname: 'Pragasam',
      email: jwt?.user?.email || 'lpragasa@my.centennialcollege.ca',
      description: '',
      completion: new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  // Open Form to Edit
  const handleOpenEdit = (qual) => {
    setEditingId(qual._id);
    setFormData({
      title: qual.title,
      firstname: qual.firstname,
      lastname: qual.lastname,
      email: qual.email,
      description: qual.description,
      completion: qual.completion ? qual.completion.split('T')[0] : ''
    });
    setShowForm(true);
  };

  // 2. CREATE & UPDATE: Submit form to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:3000/api/qualifications/${editingId}`
      : 'http://localhost:3000/api/qualifications';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt.token // 👈 Sends JWT token for Admin verification
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setShowForm(false);
        loadQualifications(); // Refresh list
      }
    } catch (err) {
      alert('Error saving qualification.');
    }
  };

  // 3. DELETE: Remove qualification from Backend
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this qualification?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/qualifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt.token // 👈 Sends JWT token
        }
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        loadQualifications(); // Refresh list
      }
    } catch (err) {
      alert('Error deleting qualification.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '4px' }}>Education & Qualifications</h1>
          <p style={{ color: '#64748b' }}>Academic milestones fetched live from MongoDB database.</p>
        </div>

        {/* ONLY ADMIN SEES THIS ADD BUTTON */}
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Add Qualification
          </button>
        )}
      </div>

      {/* Role Banner */}
      <div style={{
        backgroundColor: isAdmin ? '#ecfdf5' : '#f8fafc',
        border: `1px solid ${isAdmin ? '#a7f3d0' : '#e2e8f0'}`,
        color: isAdmin ? '#065f46' : '#475569',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '28px'
      }}>
        {isAdmin ? (
          <span>🛡️ <strong>Admin Mode Active:</strong> You can Create, Edit, and Delete education records.</span>
        ) : (
          <span>👀 <strong>Viewer Mode:</strong> You can browse and read qualifications. Log in as Admin to manage.</span>
        )}
      </div>

      {/* Admin Form Box */}
      {showForm && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #2563eb',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '16px' }}>
            {editingId ? '✏️ Edit Qualification' : '➕ Add New Qualification'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Title / Program *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Software Engineering Technology"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>First Name *</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Last Name *</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Completion Date</label>
                <input
                  type="date"
                  name="completion"
                  value={formData.completion}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Description *</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Details, courses, achievements..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {editingId ? 'Save Changes' : 'Create Qualification'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#475569',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Qualifications List Cards */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading qualifications from database...</p>
      ) : qualifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>No qualifications found in the database.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {qualifications.map((qual) => (
            <div
              key={qual._id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '6px' }}>
                    {qual.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                    Student: {qual.firstname} {qual.lastname} ({qual.email})
                  </p>
                  <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                    {qual.description}
                  </p>
                  {qual.completion && (
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      Completed: {new Date(qual.completion).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* ADMIN ONLY BUTTONS */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(qual)}
                      style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(qual._id)}
                      style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Education;