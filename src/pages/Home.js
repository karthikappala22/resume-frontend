import { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/users/resumes`)
      .then(res => setResumes(res.data))
      .catch(err => console.log(err));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= PDF DOWNLOAD ================= */
  const downloadPdf = async (resumeId) => {
    try {
      const res = await api.get(`/resumes/${resumeId}/pdf`, {
        responseType: "blob"
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  /* ================= DELETE RESUME ================= */
  const deleteResume = async (id) => {
    try {
      await api.delete(`/users/resumes/${id}`);

      // 🔥 IMPORTANT: update UI immediately
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <div className="home-header">
        <h2>My Resumes</h2>

        <div className="header-actions">
          <Link to="/create" className="create-btn">Create Resume</Link>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* RESUME LIST */}
      {resumes.length === 0 ? (
        <p className="empty-text">No resumes created yet.</p>
      ) : (
        <div className="resume-list">
          {resumes.map(r => (
            <div className="resume-card" key={r.id}>
              <h3>{r.title}</h3>

              <div className="resume-actions">
                <Link to={`/edit/${r.id}`} className="edit-btn">
                  Edit
                </Link>

                <button
                  className="delete-btn"
                  onClick={() => deleteResume(r.id)}
                >
                  Delete
                </button>

                <button
                  className="download-btn"
                  onClick={() => downloadPdf(r.id)}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
