import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/create")}>Create Resume</button>
      <button onClick={logout}>Logout</button>
      <hr />
    </div>
  );
}
