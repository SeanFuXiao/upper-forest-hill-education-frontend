import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [course, setCourse] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [newTeacherId, setNewTeacherId] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPageStudents, setCurrentPageStudents] = useState(1);
  const [studentsPerPage] = useState(5);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(response.data);
      } catch (err) {
        setError("Failed to load course.");
        console.error("Error fetching course:", err);
      }
    };

    //Fetch Teacher and Student
    //Fetch Teacher and Student

    const fetchTeachersAndStudents = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }

      try {
        const teachersResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users?role=teacher`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTeachers(teachersResponse.data);

        const studentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users?role=student`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(studentsResponse.data);
      } catch (err) {
        setError("Failed to load teachers or students.");
        console.error("Error fetching teachers or students:", err);
      }
    };

    fetchCourse();
    fetchTeachersAndStudents();
  }, [token, courseId]);

  //Edit Course
  //Edit Course

  const handleEditCourse = async () => {
    if (!course) return;

    try {
      const updatedCourse = {
        name: course.name,
        category: course.category,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate),
        time: course.time,
        zoom: course.zoom,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`,
        updatedCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(response.data);
      setSuccessMessage("Course updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update course.");
      console.error("Error updating course:", err);
    }
  };

  //Assign Teacher
  //Assign Teacher

  const handleAssignTeacher = async () => {
    if (!newTeacherId) {
      setError("Please select a teacher.");
      return;
    }

    try {
      await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/courses/${courseId}/assign-teacher`,
        { teacherId: newTeacherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const assignedTeacher = teachers.find((t) => t.id === newTeacherId);
      setCourse((prevCourse) => ({
        ...prevCourse,
        teacher: assignedTeacher,
      }));

      setSuccessMessage("Teacher assigned successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to assign teacher.");
      console.error("Error assigning teacher:", err);
    }
  };

  //Add Student
  //Add Student

  const handleAddStudent = async () => {
    if (!newStudentId) {
      setError("Please select a student.");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/add-student`,
        { studentId: newStudentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addedStudent = students.find((s) => s.id === newStudentId);
      setCourse((prevCourse) => ({
        ...prevCourse,
        students: [...prevCourse.students, { user: addedStudent }], // 添加新学生
      }));

      setSuccessMessage("Student added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to add student.");
      console.error("Error adding student:", err);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/courses/${courseId}/remove-student`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse({
        ...course,
        students: course.students.filter((student) => student.id !== studentId),
      });
      setSuccessMessage("Student removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to remove student.");
      console.error("Error removing student:", err);
    }
  };

  //Delete Teacher
  //Delete Teacher

  const handleDeleteTeacher = async () => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/courses/${courseId}/remove-teacher`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse({ ...course, teacher: null });
      setSuccessMessage("Teacher removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to remove teacher.");
      console.error("Error removing teacher:", err);
    }
  };

  // Pagination logic for students
  // Pagination logic for students

  const indexOfLastStudent = currentPageStudents * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = course?.students?.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPagesStudents = course?.students
    ? Math.ceil(course.students.length / studentsPerPage)
    : 0;

  const renderEmptyStudents = () => {
    let emptyStudents = [];
    for (let i = 0; i < studentsPerPage; i++) {
      emptyStudents.push(
        <tr key={i}>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      );
    }
    return emptyStudents;
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Course</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div
        className="row mb-4"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {/*Course Information */}
        {/*Course Information */}

        <div
          className="col-md-5"
          style={{
            height: "800px",
            width: "600px",
            padding: "20px",
            border: "1px solid #ddd",
          }}
        >
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header bg-primary text-white">
              <h5>Course Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={course.name}
                  onChange={(e) =>
                    setCourse({ ...course, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  value={course.category}
                  onChange={(e) =>
                    setCourse({ ...course, category: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={course.startDate}
                  onChange={(e) =>
                    setCourse({ ...course, startDate: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={course.endDate}
                  onChange={(e) =>
                    setCourse({ ...course, endDate: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={course.time}
                  onChange={(e) =>
                    setCourse({ ...course, time: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Zoom Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={course.zoom}
                  onChange={(e) =>
                    setCourse({ ...course, zoom: e.target.value })
                  }
                />
              </div>
              <button className="btn btn-primary" onClick={handleEditCourse}>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/*Teachers and Students */}
        {/*Teachers and Students */}

        <div
          className="col-md-6"
          style={{
            height: "800px",
            width: "600px",
            padding: "20px",
            border: "1px solid #ddd",
          }}
        >
          <div className="card" style={{ height: "100%" }}>
            <div className="card-header bg-success text-white">
              <h5>Teacher and Students</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Assigned Teacher</h6>
                {course.teacher ? (
                  <div>
                    <p>{course.teacher.name}</p>
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteTeacher}
                    >
                      Remove Teacher
                    </button>
                  </div>
                ) : (
                  <p>No teacher assigned yet.</p>
                )}
                <select
                  className="form-control mt-3"
                  onChange={(e) => setNewTeacherId(e.target.value)}
                >
                  <option value="">Assign New Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleAssignTeacher}
                >
                  Assign Teacher
                </button>
              </div>

              <div className="mb-3">
                <h6>Assigned Students</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents?.length > 0
                      ? currentStudents.map((student) => (
                          <tr key={student.id}>
                            <td>{student.user.name}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                Remove Student
                              </button>
                            </td>
                          </tr>
                        ))
                      : renderEmptyStudents()}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {/* Pagination Controls */}

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setCurrentPageStudents(
                        Math.max(1, currentPageStudents - 1)
                      )
                    }
                    disabled={currentPageStudents === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPageStudents} of {totalPagesStudents}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setCurrentPageStudents(
                        Math.min(totalPagesStudents, currentPageStudents + 1)
                      )
                    }
                    disabled={currentPageStudents === totalPagesStudents}
                  >
                    Next
                  </button>
                </div>

                {/* Add New Student */}
                {/* Add New Student */}

                <select
                  className="form-control mt-3"
                  onChange={(e) => setNewStudentId(e.target.value)}
                >
                  <option value="">Add New Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleAddStudent}
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admin-dashboard/courses")}
      >
        Back to Course List
      </button>
    </div>
  );
};

export default EditCourse;
