import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import "./EditResume.css";

export default function EditResume() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  const [skills, setSkills] = useState("");
  const [bullets, setBullets] = useState("");

  const [cert, setCert] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: ""
  });

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/resumes/${resumeId}/full`);
      setResume(res.data);
      setSkills(res.data.skills?.join(", ") || "");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You are not authorized to access this resume");
      } else if (err.response?.status === 404) {
        setError("Resume not found");
      } else {
        setError("Something went wrong");
      }
    }
  };

  /* ================= SKILLS ================= */

  const updateSkills = async () => {
    await api.post(`/resumes/${resumeId}/skills`, {
      skills: skills.split(",").map(s => s.trim())
    });
    load();
  };

  /* ================= EDUCATION ================= */

  const addEducation = async (e) => {
    e.preventDefault();
    const f = e.target;

    await api.post(`/resumes/${resumeId}/educations`, {
      degree: f.degree.value,
      institution: f.institution.value,
      startYear: f.startYear.value,
      endYear: f.endYear.value
    });

    f.reset();
    load();
  };

  /* ================= EXPERIENCE ================= */

  const addExperience = async (e) => {
    e.preventDefault();
    const f = e.target;

    await api.post(`/resumes/${resumeId}/experiences`, {
      companyName: f.company.value,
      role: f.role.value,
      startDate: f.startDate.value,
      endDate: f.endDate.value,
      bullets: bullets.split("\n").filter(b => b.trim() !== "")
    });

    setBullets("");
    f.reset();
    load();
  };

  /* ================= CERTIFICATIONS ================= */

  const addCertification = async (e) => {
    e.preventDefault();

    await api.post(`/resumes/${resumeId}/certifications`, cert);

    setCert({
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: ""
    });

    load();
  };

  /* ================= PDF DOWNLOAD ================= */

  const downloadPdf = async () => {
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
  };

  /* ================= ERROR STATE ================= */

  if (error) {
    return (
      <div style={{ padding: 30 }}>
        <Navbar />
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  if (!resume) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <Navbar />

      <h2>{resume.title}</h2>

      {/* ================= SKILLS ================= */}
      <h3>Skills</h3>
      <textarea
        value={skills}
        onChange={e => setSkills(e.target.value)}
        placeholder="Java, Spring Boot, React"
      />
      <br />
      <button onClick={updateSkills}>Update Skills</button>

      {/* ================= EDUCATION ================= */}
      <h3>Education</h3>
      {resume.educations.map(e => (
        <div key={e.id}>
          {e.degree} - {e.institution} ({e.startYear} - {e.endYear})
        </div>
      ))}

      <form onSubmit={addEducation}>
        <input name="degree" placeholder="Degree" required />
        <input name="institution" placeholder="Institution" required />
        <input name="startYear" placeholder="Start Year" required />
        <input name="endYear" placeholder="End Year" required />
        <button>Add Education</button>
      </form>

      {/* ================= EXPERIENCE ================= */}
      <h3>Experience</h3>
      {resume.experiences.map(e => (
        <div key={e.id}>
          <b>{e.companyName}</b> - {e.role}
          <ul>
            {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      ))}

      <form onSubmit={addExperience}>
        <input name="company" placeholder="Company" required />
        <input name="role" placeholder="Role" required />
        <input type="date" name="startDate" required />
        <input type="date" name="endDate" />
        <textarea
          value={bullets}
          onChange={e => setBullets(e.target.value)}
          placeholder="One bullet per line"
        />
        <button>Add Experience</button>
      </form>

      {/* ================= CERTIFICATIONS ================= */}
      <h3>Certifications</h3>
      {resume.certifications?.map(c => (
        <div key={c.id}>
          {c.name} - {c.issuer} ({c.issueDate})
        </div>
      ))}

      <form onSubmit={addCertification}>
        <input
          placeholder="Certification Name"
          value={cert.name}
          onChange={e => setCert({ ...cert, name: e.target.value })}
          required
        />
        <input
          placeholder="Issuer"
          value={cert.issuer}
          onChange={e => setCert({ ...cert, issuer: e.target.value })}
          required
        />
        <input
          type="date"
          value={cert.issueDate}
          onChange={e => setCert({ ...cert, issueDate: e.target.value })}
          required
        />
        <input
          type="date"
          value={cert.expiryDate}
          onChange={e => setCert({ ...cert, expiryDate: e.target.value })}
        />
        <button>Add Certification</button>
      </form>

      <br />

      {/* ================= PDF ================= */}
      <button onClick={downloadPdf}>Download PDF</button>
    </div>
  );
}
