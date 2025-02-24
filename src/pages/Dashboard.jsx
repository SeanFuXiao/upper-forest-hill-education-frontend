import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      //Different Role Different Dashboard
      //Different Role Different Dashboard

      switch (user.role) {
        case "student":
          navigate("/student-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/login");
      }
    }
  }, [navigate, user]);

  return <h2>Redirecting...</h2>;
};

export default Dashboard;
