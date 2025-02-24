import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tab, Tabs, Badge } from "react-bootstrap";

const CourseStudent = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("No access token found. Please login.");
          return;
        }

        //Get Course
        //Get Course

        const courseResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Course Data:", courseResponse.data);

        // Get Assignment
        // Get Assignment

        const assignmentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/assignments/course/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Assignments Data:", assignmentsResponse.data);

        // Get Student
        // Get Student

        const studentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Students Data:", studentsResponse.data);

        const instructor = courseResponse.data.teacher
          ? [
              {
                id: "teacher",
                name: courseResponse.data.teacher.name,
                email: courseResponse.data.teacher.email,
                role: "teacher",
              },
            ]
          : [];

        setCourse(courseResponse.data);
        setAssignments(
          Array.isArray(assignmentsResponse.data)
            ? assignmentsResponse.data
            : []
        );
        setContacts([
          ...instructor,
          ...(Array.isArray(studentsResponse.data)
            ? studentsResponse.data
            : []),
        ]);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setAssignments([]);
        setContacts([]);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  const handleFileChange = (event, assignmentId) => {
    setSelectedFiles({
      ...selectedFiles,
      [assignmentId]: event.target.files[0],
    });
  };
  // handle Submit
  // handle Submit

  const handleSubmit = async (assignmentId) => {
    if (!selectedFiles[assignmentId]) return;

    const formData = new FormData();
    formData.append("file", selectedFiles[assignmentId]);

    try {
      const token = localStorage.getItem("access");
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/assignments/${assignmentId}/submit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Assignment submitted successfully!");
    } catch (err) {
      console.error("Error submitting assignment:", err);
    }
  };

  if (!course) {
    return <p className="text-center">Loading course details...</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{course.name}</h2>

      <Tabs defaultActiveKey="details" className="mb-3">
        <Tab eventKey="details" title="Course Details">
          <div className="card p-3">
            <h4>Course Details</h4>
            <p>
              <strong>Category:</strong> {course.category}
            </p>
            <p>
              <strong>Instructor:</strong> {course.teacher?.name}
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
              <strong>Description:</strong> {course.description}
            </p>
          </div>
        </Tab>

        <Tab eventKey="assignments" title="Assignments">
          <div className="card p-3">
            <h4>Assignments</h4>
            {assignments.length === 0 ? (
              <p>No assignments available.</p>
            ) : (
              <div className="row">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="col-md-6 mb-4">
                    <div className="card shadow-sm p-3">
                      <h5 className="text-primary">{assignment.title}</h5>
                      <p>
                        <strong>Due Date:</strong>{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {assignment.description || "No description available."}
                      </p>
                      <a
                        href={assignment.fileUrl}
                        className="btn btn-outline-primary mb-2"
                        download
                      >
                        Download Assignment
                      </a>
                      <input
                        type="file"
                        className="form-control mb-2"
                        onChange={(e) => handleFileChange(e, assignment.id)}
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => handleSubmit(assignment.id)}
                      >
                        Submit Assignment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tab>

        <Tab eventKey="contacts" title="Contacts">
          <div className="card p-3">
            <h4>Contacts</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No contacts available.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>
                        <Badge
                          bg={
                            contact.role === "teacher" ? "success" : "primary"
                          }
                        >
                          {contact.role?.charAt(0).toUpperCase() +
                            contact.role?.slice(1) || "Unknown"}
                        </Badge>
                      </td>
                      <td>
                        <a
                          href={`mailto:${contact.email}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Send Message
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default CourseStudent;
