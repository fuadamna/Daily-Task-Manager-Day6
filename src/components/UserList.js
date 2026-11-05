
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
  const [sortOrder, setSortOrder] = useState('asc');

  // States for Update
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // States for loading and messages
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // State for Delete Modal
  const [deleteUser, setDeleteUser] = useState(null);

  // Fetch data from Firebase
  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));

        const userData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(userData);

      } catch (error) {
        console.log('Error fetching users:', error);
        setMessage('Error fetching users');
        setMessageType('danger');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);

  // Search functionality
  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting function
  const sortBy = (key) => {

    const sorted = [...users].sort((a, b) => {
      const valueA = String(a[key] || '').toLowerCase();
      const valueB = String(b[key] || '').toLowerCase();

      if (sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setUsers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Delete functionality - Open Bootstrap Modal
  const handleDelete = (user) => {

    setMessage('');
    setDeleteUser(user);

  };

  // Confirm Delete functionality
  const confirmDelete = async () => {

    if (!deleteUser || deleting) {
      return;
    }

    setDeleting(true);

    try {

      await deleteDoc(doc(db, 'users', deleteUser.id));

      setUsers(prevUsers =>
        prevUsers.filter(user => user.id !== deleteUser.id)
      );

      setDeleteUser(null);

      setMessage('User deleted successfully!');
      setMessageType('success');

    } catch (err) {

      console.error(err);

      setDeleteUser(null);
      setMessage('Error deleting user');
      setMessageType('danger');

    } finally {
      setDeleting(false);
    }
  };

  // Close Delete Modal
  const handleCancelDelete = () => {

    if (!deleting) {
      setDeleteUser(null);
    }

  };

  // Edit functionality
  const handleEdit = (user) => {

    setEditingUser(user);

    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');

    setMessage('');

  };

  // Update functionality
  const handleUpdate = async (e) => {

    e.preventDefault();

    // Check empty fields
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage('All fields are required!');
      setMessageType('danger');
      return;
    }

    // Check valid email
    if (!email.includes("@") || !email.includes(".")) {
      setMessage('Please enter a valid email address!');
      setMessageType('danger');
      return;
    }

    // Check phone number
    if (phone.length !== 10 || isNaN(phone)) {
      setMessage('Phone number must be 10 digits!');
      setMessageType('danger');
      return;
    }

    setUpdating(true);

    try {

      const userRef = doc(db, 'users', editingUser.id);

      await updateDoc(userRef, {
        name,
        email,
        phone
      });

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === editingUser.id
            ? { ...u, name, email, phone }
            : u
        )
      );

      setEditingUser(null);

      setName('');
      setEmail('');
      setPhone('');

      setMessage('User updated successfully!');
      setMessageType('success');

    } catch (err) {

      console.error(err);

      setMessage('Error updating user');
      setMessageType('danger');

    } finally {
      setUpdating(false);
    }

  };

  // Cancel editing
  const handleCancel = () => {

    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

  };

  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">Registered Users</h2>

      {/* Success and Error Messages */}
      {message && (

        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>

      )}

      {/* Update Form */}
      {editingUser && (

        <div className="card shadow-sm mb-4">

          <div className="card-body">

            <h4 className="mb-3">Update User Details</h4>

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
                  type="text"
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

                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  'Update'
                )}

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

      {/* Search box */}
      {!editingUser && (

        <div className="d-flex gap-2 mb-4">

          <input
            type="text"
            className="form-control"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="btn btn-secondary"
            onClick={() => setSearchTerm('')}
          >
            Reset
          </button>

        </div>

      )}

      {/* Loading */}
      {loading ? (

        <div className="text-center">

          <div className="spinner-border text-primary"></div>

          <p>Loading users...</p>

        </div>

      ) : (

        <>

          {/* Desktop and Tablet Table */}
          {!editingUser && (

            <div className="table-responsive d-none d-md-block">

              <table className="table table-bordered table-striped">

                <thead className="table-dark">

                  <tr>

                    <th
                      onClick={() => sortBy('name')}
                      style={{ cursor: 'pointer' }}
                    >
                      Name {sortOrder === 'asc' ? '▲' : '▼'}
                    </th>

                    <th
                      onClick={() => sortBy('email')}
                      style={{ cursor: 'pointer' }}
                    >
                      Email {sortOrder === 'asc' ? '▲' : '▼'}
                    </th>

                    <th>Phone</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.length > 0 ? (

                    filteredUsers.map(user => (

                      <tr key={user.id}>

                        <td>{user.name || '-'}</td>
                        <td>{user.email || '-'}</td>
                        <td>{user.phone || '-'}</td>

                        <td>

                          <button
                            className="btn btn-primary btn-sm me-2 mb-1"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm mb-1"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="4" className="text-center">
                        No users found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* Mobile Cards */}
          {!editingUser && (

            <div className="d-md-none">

              {filteredUsers.length > 0 ? (

                filteredUsers.map(user => (

                  <div className="card mb-3 shadow-sm" key={user.id}>

                    <div className="card-body">

                      <h5 className="card-title">
                        {user.name || '-'}
                      </h5>

                      <p className="card-text mb-2">
                        <strong>Email:</strong> {user.email || '-'}
                      </p>

                      <p className="card-text mb-3">
                        <strong>Phone:</strong> {user.phone || '-'}
                      </p>

                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))

              ) : (

                <p className="text-center">
                  No users found
                </p>

              )}

            </div>

          )}

        </>

      )}

      {/* Bootstrap Delete Confirmation Modal */}
      {deleteUser && (

        <>

          <div
            className="modal fade show"
            style={{ display: 'block' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="deleteModalTitle"
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title" id="deleteModalTitle">
                    Confirm Delete
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancelDelete}
                    disabled={deleting}
                    aria-label="Close"
                  ></button>

                </div>

                <div className="modal-body">

                  <p>Are you sure you want to delete this user?</p>

                  <strong>
                    {deleteUser.name || deleteUser.email}
                  </strong>

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelDelete}
                    disabled={deleting}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                    disabled={deleting}
                  >

                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>

          <div className="modal-backdrop fade show"></div>

        </>

      )}

    </div>
  );
}

export default UserList;
