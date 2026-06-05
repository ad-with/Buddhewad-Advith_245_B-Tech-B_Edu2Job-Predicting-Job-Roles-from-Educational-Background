import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { Search, Users, ChevronLeft, ChevronRight, Activity, Filter } from 'lucide-react';
import './AdminUsers.css';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Temporarily appending search to query if supported, but for now we just fetch paginated
      // To properly support search, the backend requires passing it. We updated it.
      const url = `/admin/users?page=${page}&limit=${limit}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`;
      // Since our api service getUsersList takes page and limit, we can't pass search unless we modify api.js again.
      // Let's modify api.js to support search query param if we must, or we just do client side search if small, 
      // but the instructions said backend pagination. Let's just use the api directly with fetch if needed, 
      // or we just pass search to `adminService.getUsersList(page, limit, search)`.
      // Actually, let's just make the fetch here using the adminService token helper.
      
      const token = localStorage.getItem('admin_access_token') || localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1${url}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      
      setUsers(data.data);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, debouncedSearch]);

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'Anonymous') return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-users-page animate-in">
      <div className="admin-users-header">
        <div className="header-title">
          <h2>User Management</h2>
          <div className="total-badge">
            <Users size={16} />
            <span>{total} Total Users</span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="admin-users-table-container glass-card">
        {loading ? (
          <div className="table-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-row skeleton-shimmer">
                <div className="skel-avatar"></div>
                <div className="skel-info"></div>
                <div className="skel-stats"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <Activity size={32} />
            <p>Failed to load users: {error}</p>
            <button onClick={fetchUsers}>Retry</button>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-glow"></div>
            <Users size={48} className="empty-icon" />
            <h3>No users found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Predictions</th>
                  <th>Avg Match</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover-row">
                    <td>
                      <div className="user-cell">
                        <div className="avatar">
                          {getInitials(user.name)}
                        </div>
                        <div className="user-name">{user.name}</div>
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <div className="predictions-badge">
                        <Activity size={14} />
                        <span>{user.total_predictions}</span>
                      </div>
                    </td>
                    <td>
                      <div className="match-cell">
                        <div className="match-bar-bg">
                          <div 
                            className="match-bar-fill" 
                            style={{ width: `${user.avg_match}%` }}
                          ></div>
                        </div>
                        <span className="match-text">{user.avg_match}%</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        View Analytics
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i + 1} 
                className={`page-num ${page === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            className="page-btn" 
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
