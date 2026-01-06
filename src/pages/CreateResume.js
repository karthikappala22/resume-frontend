import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateResume() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const create = async () => {
    const res = await api.post("/users/resumes", { title });
    navigate(`/edit/${res.data.id}`);
  };

  return (
    <div style={{ padding: 30 }}>
      <Navbar />
      <h2>Create Resume</h2>
      <input placeholder="Resume Title" onChange={e => setTitle(e.target.value)} />
      <br/><br/>
      <button onClick={create}>Create</button>
    </div>
  );
}
