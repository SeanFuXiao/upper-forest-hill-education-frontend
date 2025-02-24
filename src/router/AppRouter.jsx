import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ManageUsers from "../pages/ManageUsers";
import ManageCourses from "../pages/ManageCourses";
import CourseDetails from "../pages/CourseDetails";
import EditCourse from "../pages/EditCourse";
import ViewSubmission from "../pages/ViewSubmission";
import CourseStudent from "../pages/CourseStudent";

// ALL Path
// ALL Path

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<h2>Welcome to UFH Education</h2>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-dashboard/users" element={<ManageUsers />} />
      <Route path="/admin-dashboard/courses" element={<ManageCourses />} />
      <Route
        path="/teacher-dashboard/course/:courseId"
        element={<CourseDetails />}
      />

      <Route
        path="/admin-dashboard/courses/edit/:courseId"
        element={<EditCourse />}
      />
      <Route
        path="/teacher-dashboard/course/:courseId"
        element={<CourseDetails />}
      />
      <Route
        path="/course/:courseId/assignment/:assignmentId/submissions"
        element={<ViewSubmission />}
      />

      <Route
        path="/course-detail/:studentId/:courseId"
        element={<CourseStudent />}
      />
      <Route />
    </Routes>
  );
};

export default AppRouter;
