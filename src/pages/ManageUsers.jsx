import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchUser, setSearchUser] = useState("");
  const token = localStorage.getItem("access");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users.");
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [token]);

  // Delete
  // Delete

  const handleDelete = async (userId, role) => {
    if (role === "admin") {
      setError("Cannot delete an admin user.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.filter((user) => user.id !== userId));
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  //Handle Detail
  //Handle Detail

  const handleDetails = (userId) => {
    const user = users.find((user) => user.id === userId);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "bg-success";
      case "teacher":
        return "bg-primary";
      case "admin":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Filter users based on search
  // Filter users based on search

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Get paginated users for current page
  // Get paginated users for current page

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle page change
  // Handle page change

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <button
        className="btn btn-secondary mb-3"
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </button>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search Users"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* User List */}
          <ul className="list-group">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <li
                  key={user.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.name}</strong>
                    <div>
                      <span className={`badge ${getRoleColor(user.role)} ms-2`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleDetails(user.id)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(user.id, user.role)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item">No users available.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Pagination */}
      {/* Pagination */}

      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="d-flex align-items-center">
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for user details */}
      {/* Modal for user details */}

      {selectedUser && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-labelledby="userDetailsModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="userDetailsModalLabel">
                  User Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
