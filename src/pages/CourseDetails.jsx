import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const { courseId } = useParams();
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    startDate: "",
    dueDate: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const studentsPerPage = 5;
  const assignmentsPerPage = 10;
  const [currentPageStudents, setCurrentPageStudents] = useState(1);
  const [currentPageAssignments, setCurrentPageAssignments] = useState(1);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }

      try {
        setError("");

        const courseResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(courseResponse.data);

        const studentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(studentsResponse.data);

        const assignmentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/assignments/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAssignments(assignmentsResponse.data);
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error fetching course details:", err);
      }
    };

    fetchCourseDetails();
  }, [courseId, token]);

  const handleCreateAssignment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/assignments/course/${courseId}`,
        newAssignment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignments([...assignments, response.data]);
      setSuccessMessage("Assignment created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setNewAssignment({
        title: "",
        startDate: "",
        dueDate: "",
      });
    } catch (err) {
      setError("Failed to create assignment.");
      console.error("Error creating assignment:", err);
    }
  };

  const handleViewAssignment = (assignmentId) => {
    const selected = assignments.find(
      (assignment) => assignment.id === assignmentId
    );
    setSelectedAssignment(selected);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignmentId) => {
    const selected = assignments.find(
      (assignment) => assignment.id === assignmentId
    );
    setSelectedAssignment(selected);
    setIsEditMode(true);
    setNewAssignment({
      title: selected.title,
      startDate: selected.startDate,
      dueDate: selected.dueDate,
    });
    setIsModalOpen(true);
  };

  //

  const handleSaveAssignment = async () => {
    try {
      const updatedAssignment = {
        ...selectedAssignment,
        title: newAssignment.title,
        startDate: newAssignment.startDate,
        dueDate: newAssignment.dueDate,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/assignments/${
          selectedAssignment.id
        }`,
        updatedAssignment,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedAssignments = assignments.map((assignment) =>
        assignment.id === selectedAssignment.id ? response.data : assignment
      );
      setAssignments(updatedAssignments);
      setSuccessMessage("Assignment updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to update assignment.");
      console.error("Error updating assignment:", err);
    }
  };

  const handleViewSubmission = (assignmentId) => {
    navigate(`/course/${courseId}/assignment/${assignmentId}/submissions`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleBackToDashboard = () => {
    navigate("/teacher-dashboard");
  };

  // Pagination for students
  // Pagination for students

  const indexOfLastStudent = currentPageStudents * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Pagination for assignments
  // Pagination for assignments

  const indexOfLastAssignment = currentPageAssignments * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignments.slice(
    indexOfFirstAssignment,
    indexOfLastAssignment
  );
  if (!course) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container mt-5">
      <h2>Course Details</h2>
      <br></br>
      <br></br>
      <br></br>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="row">
        {/* Course Information */}
        {/* Course Information */}

        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Course Information</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> {course.name}
              </p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(course.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(course.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {course.time}
              </p>
              <p>
                <strong>Zoom Link:</strong> {course.zoom || "None"}
              </p>

              <p>
                <strong>Enrolled Students:</strong>
              </p>
              <ul className="list-group">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <li key={student.id} className="list-group-item">
                      {student.name}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No students enrolled</li>
                )}
              </ul>

              {/* Pagination for students */}
              {/* Pagination for students */}
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setCurrentPageStudents(Math.max(1, currentPageStudents - 1))
                  }
                  disabled={currentPageStudents === 1}
                >
                  Previous
                </button>
                <span>Page {currentPageStudents}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setCurrentPageStudents(
                      Math.min(
                        Math.ceil(students.length / studentsPerPage),
                        currentPageStudents + 1
                      )
                    )
                  }
                  disabled={
                    currentPageStudents ===
                    Math.ceil(students.length / studentsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        {/* Assignments List */}

        <div className="col-lg-6 col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Assignments List</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {currentAssignments.length > 0 ? (
                  currentAssignments.map((assignment) => (
                    <li
                      key={assignment.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <span>{assignment.title}</span>
                      <div>
                        <button
                          className="btn btn-info btn-sm mx-1"
                          onClick={() => handleViewAssignment(assignment.id)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-warning btn-sm mx-1"
                          onClick={() => handleEditAssignment(assignment.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-primary btn-sm mx-1"
                          onClick={() => handleViewSubmission(assignment.id)}
                        >
                          View Submission
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No assignments yet</li>
                )}
              </ul>

              {/* Pagination for assignments */}
              {/* Pagination for assignments */}

              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setCurrentPageAssignments(
                      Math.max(1, currentPageAssignments - 1)
                    )
                  }
                  disabled={currentPageAssignments === 1}
                >
                  Previous
                </button>
                <span>Page {currentPageAssignments}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setCurrentPageAssignments(
                      Math.min(
                        Math.ceil(assignments.length / assignmentsPerPage),
                        currentPageAssignments + 1
                      )
                    )
                  }
                  disabled={
                    currentPageAssignments ===
                    Math.ceil(assignments.length / assignmentsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*Create Assignment */}
        {/*Create Assignment */}

        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Create Assignment</h5>
            </div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
              />
              <input
                type="date"
                className="form-control mb-2"
                value={newAssignment.startDate}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    startDate: e.target.value,
                  })
                }
              />
              <input
                type="date"
                className="form-control mb-2"
                value={newAssignment.dueDate}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    dueDate: e.target.value,
                  })
                }
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleCreateAssignment}
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Detail */}
      {/* Assignment Detail */}

      {isModalOpen && selectedAssignment && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Assignment" : "View Assignment"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(selectedAssignment.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                </p>

                {isEditMode && (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={newAssignment.title}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          title: e.target.value,
                        })
                      }
                    />
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={newAssignment.startDate}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          startDate: e.target.value,
                        })
                      }
                    />
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                {isEditMode && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveAssignment}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <button
          className="btn btn-secondary mb-3"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
