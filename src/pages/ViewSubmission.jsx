import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const ViewSubmission = () => {
  const { courseId, assignmentId } = useParams();
  const token = localStorage.getItem("access");

  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [course, setCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(courseResponse.data);

        // Get Student
        // Get Student

        const studentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(studentsResponse.data);

        // Get Assignment
        // Get Assignment

        const submissionsResponse = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/assignments/${assignmentId}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(submissionsResponse.data);
      } catch (err) {
        setError("Failed to load course or submissions.");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [courseId, assignmentId, token]);

  //Handle Show or not
  //Handle Show or not

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFeedback("");
    setGrade("");
    setFile(null);
  };

  // Submit Feedback
  // Submit Feedback

  const handleSubmitFeedback = async () => {
    const formData = new FormData();
    formData.append("feedback", feedback);
    formData.append("grade", grade);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/assignments/${assignmentId}/submissions/${selectedStudent.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.studentId === selectedStudent.id
            ? { ...sub, feedback, grade, file: formData.get("file") }
            : sub
        )
      );

      setShowModal(false);
      setFeedback("");
      setGrade("");
      setFile(null);
      alert("Feedback and grade submitted successfully");
    } catch (err) {
      console.error("Error submitting feedback and grade", err);
      setError("Failed to submit feedback or grade.");
    }
  };

  //Handle Download
  //Handle Download

  const handleDownloadSubmission = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("No submission file available.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Course: {course.name} - Submissions</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h4>Assignment Information</h4>
        </div>
        <div className="card-body">
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(course.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(course.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h4>Enrolled Students and Their Submissions</h4>
        </div>
        <div className="card-body">
          <div className="list-group">
            {students.length > 0 ? (
              students.map((student) => {
                const submission = submissions.find(
                  (sub) => sub.studentId === student.id
                );

                return (
                  <div
                    key={student.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span>{student.name}</span>
                      <div className="text-muted small">
                        {submission ? (
                          <>
                            Submitted on{" "}
                            {new Date(submission.submittedAt).toLocaleString()}
                          </>
                        ) : (
                          "Not Submitted"
                        )}
                      </div>
                    </div>
                    <div>
                      {submission ? (
                        <>
                          <button
                            className="btn btn-success btn-sm mx-1"
                            onClick={() => handleShowModal(student)}
                          >
                            Grade & Feedback
                          </button>
                          <button
                            className="btn btn-primary btn-sm mx-1"
                            onClick={() =>
                              handleDownloadSubmission(submission.fileUrl)
                            }
                          >
                            Download Submission
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-muted">No Submission</span>
                          <button
                            className="btn btn-warning btn-sm mx-1"
                            onClick={() => handleShowModal(student)}
                          >
                            Provide Feedback
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <li className="list-group-item">No students enrolled</li>
            )}
          </div>
        </div>
      </div>

      {/* Feedback*/}
      {/* Feedback*/}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Provide Feedback for {selectedStudent?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Grade</label>
            <input
              type="text"
              className="form-control"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter grade"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Feedback</label>
            <textarea
              className="form-control"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              placeholder="Enter feedback"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Graded File</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitFeedback}>
            Submit Feedback & Grade
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewSubmission;
