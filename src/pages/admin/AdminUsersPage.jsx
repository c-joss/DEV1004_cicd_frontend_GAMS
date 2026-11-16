import { useEffect, useState } from 'react';
import Button from '../../components/forms/Button';
import api from '../../services/api';


function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/admin/users');
        setUsers(response.data.users);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  
async function handleViewProfile(userId) {
  try {
    setError('');
    const response = await api.get(`/admin/users/${userId}`);
    setSelectedUser(response.data.user);
  } catch (err) {
    console.error('Failed to load user profile:', err);
    setError('Unable to load user profile.');
  }
}

  return (
    <section className="admin-form-page">
      <h1>Guild Members</h1>

{selectedUser && (
  <div className="admin-user-card">
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {selectedUser.name}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Role:</strong> {selectedUser.role}</p>
    </div>

    <Button
      type="button"
      onClick={() => setSelectedUser(null)}
    >
      Back to Members
    </Button>
  </div>
)}

      {loading && <p>Loading users...</p>}
{error && <p role="alert">{error}</p>}
{!loading && !error && users.length === 0 && (
  <p>No users found.</p>
)}

      {!selectedUser && (
  <div className="admin-user-list">
        {users.map((user) => (
          <article className="admin-user-card" key={user.id}>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            

            <div>
              <p>{user.role}</p>
              <p>{user.status}</p>
            </div>
            

            
<Button
  type="button"
  onClick={() => handleViewProfile(user._id)}
>
  View Profile
</Button>

          </article>
        ))}
      </div>
      )}
    </section>
  );
}

export default AdminUsersPage;
