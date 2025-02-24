import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }

      try {
        // courses from API
        // courses from API

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Calculate students and assignments
        // Calculate students and assignments

        const coursesWithCounts = response.data.map((course) => {
          const studentsCount = course.students ? course.students.length : 0;
          const assignmentsCount = course.assignments
            ? course.assignments.length
            : 0;

          return {
            ...course,
            studentsCount,
            assignmentsCount,
          };
        });

        setCourses(coursesWithCounts);
      } catch (err) {
        setError("Failed to load courses.");
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [token]);

  const handleCourseDetails = (courseId) => {
    navigate(`/teacher-dashboard/course/${courseId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Teacher Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.category}</p>

                  <div className="d-flex justify-content-between">
                    <span>
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </span>
                    <span>{course.time}</span>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <span className="badge bg-primary">
                      {course.studentsCount} Students
                    </span>
                    <span className="badge bg-secondary">
                      {course.assignmentsCount} Assignments
                    </span>
                  </div>

                  <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => handleCourseDetails(course.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
