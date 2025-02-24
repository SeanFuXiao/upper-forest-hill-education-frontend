import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id || !token) {
      setError("No user token found. Please login.");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Fetched courses:", response.data);
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses.");
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [user?.id, token]);

  //Handle CouseClick
  //Handle CouseClick

  const handleCourseClick = (courseId) => {
    navigate(`/course-detail/${user.id}/${courseId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Dashboard</h2>
      <br></br>
      <br></br>
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <h3>My Courses</h3>
      <br></br>
      <br></br>
      <br></br>
      {courses.length === 0 ? (
        <p className="text-center">You are not enrolled in any courses.</p>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div key={course.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5
                    className="card-title text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCourseClick(course.id)}
                  >
                    {course.name}
                  </h5>
                  <p className="card-text">
                    <strong>Category:</strong> {course.category}
                  </p>
                  <p className="card-text">
                    <strong>Start Date:</strong>{" "}
                    {new Date(course.startDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>End Date:</strong>{" "}
                    {new Date(course.endDate).toLocaleDateString()}
                  </p>

                  <button
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
