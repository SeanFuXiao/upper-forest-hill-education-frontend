import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userCounts, setUserCounts] = useState({
    student: 0,
    teacher: 0,
    admin: 0,
  });
  const [courses, setCourses] = useState([]);
  const [courseCounts, setCourseCounts] = useState({
    totalCourses: 0,
  });
  const [error, setError] = useState("");
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageCourses, setCurrentPageCourses] = useState(1);
  const [searchUser, setSearchUser] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No user token found");
        return;
      }
      try {
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(usersResponse.data);
        const counts = { student: 0, teacher: 0, admin: 0 };
        usersResponse.data.forEach((user) => {
          if (user.role === "student") counts.student++;
          if (user.role === "teacher") counts.teacher++;
          if (user.role === "admin") counts.admin++;
        });

        setUserCounts(counts);

        const coursesResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(coursesResponse.data);

        setCourseCounts({
          totalCourses: coursesResponse.data.length,
        });
      } catch (err) {
        setError("Failed to load data.");
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [token]);

  const handleManageUsers = () => {
    navigate("/admin-dashboard/users");
  };

  const handleManageCourses = () => {
    navigate("/admin-dashboard/courses");
  };

  const handlePageChangeUsers = (pageNumber) => {
    setCurrentPageUsers(pageNumber);
  };

  const handlePageChangeCourses = (pageNumber) => {
    setCurrentPageCourses(pageNumber);
  };

  const paginatedUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase())
    )
    .slice(
      (currentPageUsers - 1) * itemsPerPage,
      currentPageUsers * itemsPerPage
    );

  const paginatedCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(searchCourse.toLowerCase())
    )
    .slice(
      (currentPageCourses - 1) * itemsPerPage,
      currentPageCourses * itemsPerPage
    );

  const totalPagesUsers = Math.ceil(users.length / itemsPerPage);
  const totalPagesCourses = Math.ceil(courses.length / itemsPerPage);

  const getTeacherCount = (course) => {
    return course.teacherId ? 1 : 0;
  };

  const getStudentCount = (course) => {
    return course.students ? course.students.length : 0;
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <p className="text-center">Welcome, {user?.name}!</p>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4 d-flex">
        {/* User Overview Section */}
        {/* User Overview Section */}

        <div className="col-md-6 d-flex align-items-stretch mb-4 mb-md-0">
          <div className="card shadow-sm flex-fill">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
              <h5 className="card-title">User Overview</h5>
              <button className="btn btn-light" onClick={handleManageUsers}>
                Manage Users
              </button>
            </div>
            <div className="card-body">
              {/* User Statistics */}
              {/* User Statistics */}

              <div className="mb-4">
                <h6>User Statistics</h6>
                <p>Total Users: {users.length}</p>
                <p>Students: {userCounts.student}</p>
                <p>Teachers: {userCounts.teacher}</p>
                <p>Admins: {userCounts.admin}</p>
              </div>

              {/* Search Bar for Users */}
              {/* Search Bar for Users */}

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search Users"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />

              {/* User List */}
              {/* User List */}

              <h6>Users List</h6>
              <ul className="list-group">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <li
                      key={user.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div>
                        <strong>{user.name}</strong>
                      </div>
                      <div>
                        <span
                          className={`badge ${getRoleColor(user.role)} ms-2`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No users available.</li>
                )}
              </ul>

              {/* Pagination */}
              {/* Pagination */}

              <div className="d-flex justify-content-between mt-3 sticky-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChangeUsers(currentPageUsers - 1)}
                  disabled={currentPageUsers === 1}
                >
                  Previous
                </button>
                <div className="d-flex align-items-center">
                  <span className="mx-2">
                    Page {currentPageUsers} of {totalPagesUsers}
                  </span>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChangeUsers(currentPageUsers + 1)}
                  disabled={currentPageUsers === totalPagesUsers}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Overview Section */}
        {/* Course Overview Section */}

        <div className="col-md-6 d-flex align-items-stretch mb-4 mb-md-0">
          <div className="card shadow-sm flex-fill">
            <div className="card-header bg-success text-white d-flex justify-content-between">
              <h5 className="card-title">Course Overview</h5>
              <button className="btn btn-light" onClick={handleManageCourses}>
                Manage Courses
              </button>
            </div>
            <div className="card-body">
              {/* Course Statistics */}
              {/* Course Statistics */}
              <div className="mb-4">
                <h6>Course Statistics</h6>
                <br />
                <p>Total Courses: {courseCounts.totalCourses}</p>
              </div>
              <br /> <br /> <br /> <br />
              {/* Search Bar for Courses */}
              {/* Search Bar for Courses */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search Courses"
                value={searchCourse}
                onChange={(e) => setSearchCourse(e.target.value)}
              />
              {/* Course List */}
              {/* Course List */}
              <h6>Courses List</h6>
              <ul className="list-group">
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course) => (
                    <li
                      key={course.id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div>
                        <strong>{course.name}</strong> ({course.category})
                      </div>
                      <div>
                        <span className="badge bg-info ms-2">
                          {getTeacherCount(course)} Teachers
                        </span>
                        <span className="badge bg-success ms-2">
                          {getStudentCount(course)} Students
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No courses available.</li>
                )}
              </ul>
              {/* Pagination */}
              {/* Pagination */}
              <div className="d-flex justify-content-between mt-3 sticky-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    handlePageChangeCourses(currentPageCourses - 1)
                  }
                  disabled={currentPageCourses === 1}
                >
                  Previous
                </button>
                <div className="d-flex align-items-center">
                  <span className="mx-2">
                    Page {currentPageCourses} of {totalPagesCourses}
                  </span>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    handlePageChangeCourses(currentPageCourses + 1)
                  }
                  disabled={currentPageCourses === totalPagesCourses}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
