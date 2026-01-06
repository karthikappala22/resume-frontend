import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateResume from "./pages/CreateResume";
import EditResume from "./pages/EditResume";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateResume/></ProtectedRoute>} />
        <Route path="/edit/:resumeId" element={<ProtectedRoute><EditResume/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}


