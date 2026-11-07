
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

function UserList() {

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [editingUser, setEditingUser] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [deleteUser, setDeleteUser] = useState(null);

  // Fetch users from Firebase
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, 'users'));

      const userList = querySnapshot.docs
        .map((document) => ({
          id: document.id,
          ...document.data()
        }))
        .filter((user) => user.role === 'user');

      setUsers(userList);

    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Unable to load users.');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search users
  const filteredUsers = users.filter((user) =>
    (user.name || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valueA = (a[sortField] || '').toString().toLowerCase();
    const valueB = (b[sortField] || '').toString().toLowerCase();

    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }

    if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }

    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);

    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');

    setMessage('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingUser(null);

    setName('');
    setEmail('');
    setPhone('');

    setMessage('');
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage('Please fill in all fields.');
      setMessageType('danger');
      return;
    }

    if (name.trim().length < 3) {
      setMessage('Name must contain at least 3 characters.');
      setMessageType('danger');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage('Please enter a valid email address.');
      setMessageType('danger');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setMessage('Phone number must contain 10 digits.');
      setMessageType('danger');
      return;
    }

    try {
      setUpdating(true);

      await updateDoc(doc(db, 'users', editingUser.id), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      });

      setMessage('User updated successfully!');
      setMessageType('success');

      setEditingUser(null);
      setName('');
      setEmail('');
      setPhone('');

      await fetchUsers();

    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Unable to update user.');
      setMessageType('danger');
    } finally {
      setUpdating(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (user) => {
    setDeleteUser(user);
  };

  // Delete user
  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleting(true);

      await deleteDoc(doc(db, 'users', deleteUser.id));

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== deleteUser.id)
      );

      setMessage('User deleted successfully!');
      setMessageType('success');

      setDeleteUser(null);

    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Unable to delete user.');
      setMessageType('danger');
    } finally {
      setDeleting(false);
    }
  };

  // Reset search and sorting
  const handleReset = () => {
    setSearchTerm('');
    setSortField('name');
    setSortOrder('asc');
  };

  return (
    <div className="container my-5">

      <h2 className="text-center mb-4">
        Registered Users
      </h2>

      {/* Message */}
      {message && (
        <div className={`alert alert-${messageType} alert-dismissible fade show`}>
          {message}

          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {/* Edit Form */}
      {editingUser && (
        <div className="card mb-4">

          <div className="card-header bg-dark text-white">
            Update User
          </div>

          <div className="card-body">

            <form onSubmit={handleUpdate}>

              <div className="mb-3">
                <label className="form-label">Name</label>

                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>

                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>

                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={updating}
              >
                Cancel
              </button>

            </form>

          </div>
        </div>
      )}

      {/* Search and Reset */}
      {!editingUser && (
        <>

          <div
            className="d-flex gap-2 mb-3 align-items-center"
            style={{ width: '100%' }}
          >

            <input
              type="text"
              className="form-control"
              style={{
      flex: '1',
      minWidth: '0',
      height: '40px'
    }}
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-secondary"
              style={{ height: '40px' }}
              onClick={handleReset}
            >
              Reset
            </button>

          </div>

          {loading ? (

            <div className="text-center my-4">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading users...</p>
            </div>

          ) : sortedUsers.length === 0 ? (

            <p className="text-center text-muted my-4">
              No users found.
            </p>

          ) : (

            <>

              {/* Desktop Table */}
              <div className="table-responsive d-none d-md-block">

                <table className="table table-bordered table-striped text-center align-middle">

                  <thead className="table-dark">
                    <tr>

                      <th>No.</th>

                      <th>
                        <button
                          type="button"
                          className="btn btn-link text-white text-decoration-none p-0 fw-bold"
                          onClick={() => handleSort('name')}
                        >
                          Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </button>
                      </th>

                      <th>
                        <button
                          type="button"
                          className="btn btn-link text-white text-decoration-none p-0 fw-bold"
                          onClick={() => handleSort('email')}
                        >
                          Email {sortField === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                        </button>
                      </th>

                      <th>Phone</th>
                      <th>Actions</th>

                    </tr>
                  </thead>

                  <tbody>

                    {sortedUsers.map((user, index) => (
                      <tr key={user.id}>

                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>

                        <td>

                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteClick(user)}
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              {/* Mobile User Cards */}
              <div className="d-md-none">

                {sortedUsers.map((user) => (
                  <div className="card mb-3 shadow-sm" key={user.id}>

                    <div className="card-body">

                      <h5 className="card-title">
                        {user.name}
                      </h5>

                      <p className="card-text mb-2">
                        <strong>Email:</strong> {user.email}
                      </p>

                      <p className="card-text mb-3">
                        <strong>Phone:</strong> {user.phone}
                      </p>

                      <div className="d-flex gap-2">

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </>

          )}

        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (

        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Confirm Delete
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteUser(null)}
                  disabled={deleting}
                ></button>

              </div>

              <div className="modal-body">
                Are you sure you want to delete
                <strong> {deleteUser.name} </strong>?
              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteUser(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default UserList;
