import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(15);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({
    name: "",
    category: "",
    startDate: "",
    endDate: "",
    time: "",
    zoom: "",
  });
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses.");
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [token]);

  //Detail
  //Detail

  const handleDetails = (courseId) => {
    const course = courses.find((course) => course.id === courseId);
    setSelectedCourse(course);
  };

  //Back Dashboard
  //Back Dashboard

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard");
  };

  //Edit
  //Edit

  const handleEdit = (courseId) => {
    navigate(`/admin-dashboard/courses/edit/${courseId}`);
  };

  // Add Course
  // Add Course

  const handleAddCourse = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses`,
        newCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses([response.data, ...courses]);
      setShowAddCourseModal(false);
      setSuccessMessage("Course added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to add course.");
      console.error("Error adding course:", err);
    }
  };

  // For Search
  // For Search

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="container mt-5">
      <h2>Manage Courses</h2>
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
      <br></br>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddCourseModal(true)}
      >
        Add Course
      </button>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search courses by name or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add Course*/}
      {/* Add Course*/}

      {showAddCourseModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Course</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddCourseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Course Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCourse.name}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCourse.category}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, category: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newCourse.startDate}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newCourse.endDate}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCourse.time}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, time: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Zoom Link</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCourse.zoom}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, zoom: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddCourseModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddCourse}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List courses */}
      {/* List courses */}

      <ul className="list-group">
        {currentCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          currentCourses.map((course) => (
            <li key={course.id} className="list-group-item">
              {course.name} ({course.category})
              <button
                className="btn btn-info btn-sm float-end ms-2"
                onClick={() => handleDetails(course.id)}
              >
                Details
              </button>
              <button
                className="btn btn-warning btn-sm float-end ms-2"
                onClick={() => handleEdit(course.id)}
              >
                Edit
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      {/* Pagination */}

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for course details */}
      {/* Modal for course details */}

      {selectedCourse && (
        <div
          className="modal show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-labelledby="courseDetailsModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="courseDetailsModalLabel">
                  Course Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedCourse(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {selectedCourse.name}
                </p>
                <p>
                  <strong>Category:</strong> {selectedCourse.category}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(selectedCourse.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(selectedCourse.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {selectedCourse.time}
                </p>
                <p>
                  <strong>Teacher:</strong>{" "}
                  {selectedCourse.teacher
                    ? selectedCourse.teacher.name
                    : "None"}
                </p>
                <p>
                  <strong>Students:</strong>{" "}
                  {selectedCourse.students.length > 0
                    ? selectedCourse.students
                        .map((student) => student.user.name)
                        .join(", ")
                    : "None"}
                </p>
                <p>
                  <strong>Zoom Link:</strong>{" "}
                  {selectedCourse.zoom ? (
                    <a
                      href={selectedCourse.zoom}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedCourse.zoom}
                    </a>
                  ) : (
                    "No Zoom link provided"
                  )}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedCourse(null)}
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

export default ManageCourses;
