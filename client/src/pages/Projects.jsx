import React, { useState, useEffect } from 'react';
import auth from '../auth-helper';

function Projects() {
  // State for project list from MongoDB
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if current logged-in user is an Admin
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt && jwt.user && jwt.user.role === 'admin';

  // State for Form (Add / Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null when adding, holds ID when editing
  const [formData, setFormData] = useState({
    title: '',
    firstname: jwt?.user?.name || '',
    lastname: 'Pragasam',
    email: jwt?.user?.email || '',
    description: '',
    completion: new Date().toISOString().split('T')[0]
  });

  // 1. READ: Fetch all projects from Backend on load
  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/projects');
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setProjects(data);
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle typing inside Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open Form to Add New Project
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

  // Open Form to Edit Existing Project
  const handleOpenEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      firstname: project.firstname,
      lastname: project.lastname,
      email: project.email,
      description: project.description,
      completion: project.completion ? project.completion.split('T')[0] : ''
    });
    setShowForm(true);
  };

  // 2. CREATE & UPDATE: Submit form to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId 
      ? `http://localhost:3000/api/projects/${editingId}`
      : 'http://localhost:3000/api/projects';
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt.token // 👈 Sends JWT token so backend knows we are Admin
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setShowForm(false);
        loadProjects(); // Refresh the list
      }
    } catch (err) {
      alert('Error saving project.');
    }
  };

  // 3. DELETE: Remove project from Backend
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt.token // 👈 Sends JWT token for Admin verification
        }
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        loadProjects(); // Refresh the list
      }
    } catch (err) {
      alert('Error deleting project.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '4px' }}>Featured Projects</h1>
          <p style={{ color: '#64748b' }}>Projects fetched live from MongoDB database.</p>
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
            + Add New Project
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
          <span>🛡️ <strong>Admin Mode Active:</strong> You can Create, Edit, and Delete projects.</span>
        ) : (
          <span>👀 <strong>Viewer Mode:</strong> You can browse and read projects. Log in as Admin to manage.</span>
        )}
      </div>

      {/* Admin Form Modal / Inline Box */}
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
            {editingId ? '✏️ Edit Project' : '➕ Add New Project'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. AI Study Companion"
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
                placeholder="What does this project do?"
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
                {editingId ? 'Save Changes' : 'Create Project'}
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

      {/* Projects List Grid */}
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading projects from database...</p>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>No projects found in the database.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {projects.map((project) => (
            <div
              key={project._id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>
                  {project.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                  By: {project.firstname} {project.lastname} ({project.email})
                </p>
                <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                  {project.description}
                </p>
                {project.completion && (
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Completed: {new Date(project.completion).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* ADMIN ONLY BUTTONS */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    style={{
                      flex: 1,
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '8px',
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
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;