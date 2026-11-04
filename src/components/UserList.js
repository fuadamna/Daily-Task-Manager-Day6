import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function UserList() {

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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
      const valueA = (a[key] || '').toLowerCase();
      const valueB = (b[key] || '').toLowerCase();

      if (sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setUsers(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">Registered Users</h2>

      {/* Search box */}
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
    onClick={() => window.location.reload()}
  >
    Reset
  </button>

</div>
      {/* Desktop and Tablet Table */}
      <div className="table-responsive d-none d-md-block">

        <table className="table table-bordered table-striped">

          <thead className="table-dark">
            <tr>
              <th onClick={() => sortBy('name')} style={{ cursor: 'pointer' }}>
                Name ▲
              </th>

              <th onClick={() => sortBy('email')} style={{ cursor: 'pointer' }}>
                Email ▲
              </th>

              <th>Phone</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map(user => (

                <tr key={user.id}>
                  <td>{user.name || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.phone || '-'}</td>
                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="3" className="text-center">
                  No users found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}
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

                <p className="card-text mb-0">
                  <strong>Phone:</strong> {user.phone || '-'}
                </p>

              </div>

            </div>

          ))

        ) : (

          <p className="text-center">
            No users found
          </p>

        )}

      </div>

    </div>
  );
}

export default UserList;