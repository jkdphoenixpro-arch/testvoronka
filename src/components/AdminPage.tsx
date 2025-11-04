import React, { useState, useEffect } from 'react';
import '../styles/admin.css';
import API_CONFIG from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  hasPassword: boolean;
  password?: string;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError('Failed to load users');
      }
    } catch (error) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionToggle = async (userId: number, currentRole: string) => {
    setActionLoading(userId);
    try {
      const newRole = currentRole === 'customer' ? 'lead' : 'customer';
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users/${userId}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      if (data.success) {
        // Обновляем локальное состояние
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, role: data.user.role, hasPassword: data.user.hasPassword, password: data.user.password }
              : user
          )
        );
      } else {
        setError(data.message || 'Failed to change subscription');
      }
    } catch (error) {
      setError('Server connection error');
    } finally {
      setActionLoading(null);
    }
  };

  const copyPassword = async (password: string, userId: number) => {
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess(`copied-${userId}`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-stats">
          Total users: {users.length}
        </div>
      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <div className="admin-users-container">
        <div className="users-header">
          <div className="header-item">ID</div>
          <div className="header-item">Name</div>
          <div className="header-item">Email</div>
          <div className="header-item">Role</div>
          <div className="header-item">Password</div>
          <div className="header-item">Created</div>
          <div className="header-item">Actions</div>
        </div>
        
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <div className="admin-user-cell" data-label="ID">{user.id}</div>
            <div className="admin-user-cell admin-user-name" data-label="Name">{user.name}</div>
            <div className="admin-user-cell admin-user-email" data-label="Email">{user.email}</div>
            <div className="admin-user-cell" data-label="Role">
              <span className={`role-badge ${user.role}`}>
                {user.role === 'customer' ? 'Customer' : 'Lead'}
              </span>
            </div>
            <div className="admin-user-cell" data-label="Password">
              <div className="password-cell">
                <span className={`password-status ${user.hasPassword ? 'has' : 'no'}`}>
                  {user.hasPassword ? 'Yes' : 'No'}
                </span>
                {user.hasPassword && user.password && (
                  <button 
                    className="copy-btn"
                    onClick={() => copyPassword(user.password!, user.id)}
                    title="Copy password"
                  >
                    {copySuccess === `copied-${user.id}` ? '✓' : '📋'}
                  </button>
                )}
              </div>
            </div>
            <div className="admin-user-cell" data-label="Created">{formatDate(user.createdAt)}</div>
            <div className="admin-user-cell" data-label="Actions">
              <button
                className={`action-btn ${user.role === 'customer' ? 'remove' : 'add'}`}
                onClick={() => handleSubscriptionToggle(user.id, user.role)}
                disabled={actionLoading === user.id}
              >
                {actionLoading === user.id ? (
                  'Processing...'
                ) : user.role === 'customer' ? (
                  'Remove subscription'
                ) : (
                  'Add subscription'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="admin-empty">
          No users found
        </div>
      )}
    </div>
  );
};

export default AdminPage;