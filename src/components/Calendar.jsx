import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CustomCalendar = ({ user }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error(
            "❌ No token found. Redirecting to login in 3 seconds..."
          );
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        console.log("✅ Using token:", token);
        console.log("✅ Sending headers:", headers);

        let response;

        if (user?.role === "teacher") {
          const coursesRes = await axios.get(`${API_BASE_URL}/courses`, {
            headers,
          });
          const courses = coursesRes.data.filter(
            (course) => course.teacherId === user.id
          );

          let allAssignments = [];
          for (const course of courses) {
            const assignmentsRes = await axios.get(
              `${API_BASE_URL}/assignments/course/${course.id}`,
              { headers }
            );
            allAssignments = [...allAssignments, ...assignmentsRes.data];
          }
          response = { data: allAssignments };
        } else if (user?.role === "student") {
          response = await axios.get(`${API_BASE_URL}/assignments/my-courses`, {
            headers,
          });
        } else {
          setAssignments([]);
          return;
        }

        console.log("✅ Fetched assignments:", response.data);

        if (Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error("❌ Error fetching assignments:", error);

        if (error.response?.status === 401) {
          console.error("❌ Unauthorized! Logging out...");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 3000);
        }

        setAssignments([]);
      }
    };

    if (user) {
      fetchAssignments();
    }
  }, [user, navigate]);

  const dueDates = assignments
    .map((assignment) => {
      if (!assignment.dueDate) return null;
      const dateObj = new Date(assignment.dueDate);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    })
    .filter(Boolean);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      return dueDates.some(
        (dueDate) => dueDate.toDateString() === date.toDateString()
      )
        ? "highlight"
        : "";
    }
  };

  return (
    <div style={styles.fullPageContainer}>
      <h2 style={styles.title}>📅 Course Assignments Calendar</h2>
      <div style={styles.calendarWrapper}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
          formatDay={(locale, date) => date.getDate()}
          locale="en-US"
        />
      </div>
      {assignments.length === 0 && (
        <p style={styles.noDataText}>No assignments available</p>
      )}
    </div>
  );
};

const styles = {
  fullPageContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    color: "#333",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
    fontWeight: "bold",
  },
  calendarWrapper: {
    width: "80%",
    maxWidth: "900px",
    padding: "20px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
  },
  noDataText: {
    marginTop: "20px",
    fontSize: "1.2rem",
    color: "#666",
  },
};

CustomCalendar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }),
};

export default CustomCalendar;
