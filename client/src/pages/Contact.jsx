import React, { useState, useEffect } from 'react';
import auth from '../auth-helper';

function Contact() {
  // Form State
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contactNumber: '',
    message: ''
  });

  const [status, setStatus] = useState({ success: '', error: '' });
  const [contacts, setContacts] = useState([]);

  // Check if current user is Admin
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt && jwt.user && jwt.user.role === 'admin';

  // 1. If Admin, load all received messages from MongoDB
  const loadContacts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/contacts');
      const data = await res.json();
      if (!data.error) {
        setContacts(data);
      }
    } catch (err) {
      console.log('Error loading contacts');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadContacts();
    }
  }, [isAdmin]);

  // Handle typing inside Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. CREATE: Submit message to Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: '', error: '' });

    try {
      const res = await fetch('http://localhost:3000/api/contacts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.error) {
        setStatus({ success: '', error: data.error });
      } else {
        setStatus({
          success: `Thank you, ${formData.firstname}! Your message was successfully sent and saved to MongoDB.`,
          error: ''
        });
        // Clear form
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          contactNumber: '',
          message: ''
        });
        if (isAdmin) loadContacts();
      }
    } catch (err) {
      setStatus({ success: '', error: 'Could not connect to backend server.' });
    }
  };

  // 3. DELETE: Admin can delete a contact message
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/contacts/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!data.error) {
        loadContacts();
      }
    } catch (err) {
      alert('Error deleting message.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '8px' }}>Get in Touch</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Have a question or want to collaborate? Send a message below.</p>

      {/* Main Grid: Info + Form */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Contact Info Panel */}
        <div style={{
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '36px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#f8fafc' }}>Contact Information</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
            Feel free to reach out directly through email, phone, or by submitting this form.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>Email</div>
              <a href="mailto:lpragasa@my.centennialcollege.ca" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '15px' }}>
                lpragasa@my.centennialcollege.ca
              </a>
            </div>

            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>Phone</div>
              <a href="tel:+14372990664" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '15px' }}>
                +1 (437) 299-0664
              </a>
            </div>

            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>Location</div>
              <div style={{ color: '#e2e8f0', fontSize: '15px' }}>Toronto, Ontario, Canada</div>
            </div>
          </div>
        </div>

        {/* The Live React Form */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '36px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '8px' }}>Send a Message</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Entries are saved directly into MongoDB.</p>

          {/* Feedback Alerts */}
          {status.success && (
            <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
              {status.success}
            </div>
          )}
          {status.error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>First Name *</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="Jane"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
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
                  placeholder="Doe"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="jane.doe@example.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Message *</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can I help you?"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* ADMIN INBOX: Only visible to Admin (Loshika) */}
      {isAdmin && (
        <div style={{ marginTop: '48px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '8px' }}>
            📬 Admin Messages Inbox ({contacts.length})
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            As Admin, you can review and manage all messages submitted through the contact form.
          </p>

          {contacts.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No contact messages in the database yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contacts.map((c) => (
                <div
                  key={c._id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>
                      {c.firstname} {c.lastname}{' '}
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal' }}>
                        ({c.email}) {c.contactNumber && `• ${c.contactNumber}`}
                      </span>
                    </h4>
                    <p style={{ color: '#334155', fontSize: '14px', marginTop: '6px' }}>
                      "{c.message || 'No message body'}"
                    </p>
                    {c.created && (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Received: {new Date(c.created).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteContact(c._id)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Contact;