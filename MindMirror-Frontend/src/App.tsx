import { DashBoard } from "./pages/dashboard";
import { SharePage } from "./pages/SharePage";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/share/:shareHash" element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  </div>

}
export default App;