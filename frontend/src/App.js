import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './layouts/auth/Register.jsx';
import Login from './layouts/auth/Login.jsx';
import Dashboard from './layouts/dashboard/Dashboard.jsx';
import Employees from './layouts/employees/Employees.jsx'
import Projects from './layouts/projects/Projects.jsx'
import Tasks from './layouts/tasks/Tasks.jsx'
import Timesheets from './layouts/timesheets/Timesheets.jsx'
import Attendance from './layouts/attendance/Attendance.jsx'
import { useState } from 'react';
import CameraCapture from './layouts/cameraCapture/CameraCapture.jsx';
import RegisterEmployee from './layouts/register/Register.jsx';
import Logout from './layouts/logout/Logot.jsx';

function App() {
  const [user, setUser] = useState([]);
  const [lastDate, setlastDate] = useState()

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/logout/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Logout successful:", data);

        // Clear local storage
        localStorage.removeItem("tm_token");
        localStorage.removeItem("email");
        setUser(null);
        // Redirect to login page

      } else {
        console.error("❌ Logout failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };
  return (
    <>

      <Router>
        <Routes>
          <Route path='/' element={<CameraCapture user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/register' element={<RegisterEmployee user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/admin/dashboard' element={<Dashboard user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/admin/employees' element={<Employees user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/admin/projects' element={<Projects user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/admin/tasks' element={<Tasks user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/admin/timesheets' element={<Timesheets user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path='/admin/attendance' element={<Attendance user={user} setUser={setUser} lastDate={lastDate} setlastDate={setlastDate} handleLogout={handleLogout} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;