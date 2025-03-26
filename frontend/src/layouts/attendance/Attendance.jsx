import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import Sidenav from '../../components/sidenav/Sidenav'
import "./attendance.css"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { IoMdAdd } from "react-icons/io";

import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { FcStatistics } from "react-icons/fc";
import AddAttendanceModal from './modals/AddAttendance';

function Attendance({ user, lastDate, handleLogout }) {
  const [isAddAttendanceModalOpen, setIsAddAttendanceModalOpen] = useState(false);
  const openAddAttendanceModal = () => {
    setIsAddAttendanceModalOpen(true);
  };

  const closeAddAttendanceModal = () => {
    setIsAddAttendanceModalOpen(false);
  };
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/attendance/${user._id}`);
        const data = await response.json();
        if (response.ok) {
          setAttendanceData(data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };


    fetchAttendance();

  }, []);


  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(); // Example: "3/21/2025"
    const formattedTime = date.toLocaleTimeString(); // Example: "12:34:56 PM"
    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <>
      <AddAttendanceModal isOpen={isAddAttendanceModalOpen} onClose={closeAddAttendanceModal} />
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav user={user} handleLogout={handleLogout} /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='task-status-card-container'>
            <div className='add-task-inner-div'>
              <FcStatistics className='task-stats' />
              <p className='todo-text'>Attendance Statistics</p>
            </div>
            <div className='stat-first-row'>
              <div className='stats-container container-bg1'>
                <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                <div>
                  <p className='stats-num'>28</p>
                  <p className='stats-text'>Total Working Days</p>
                </div>
              </div>
              <div className='stats-container container-bg4'>
                <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                <div>
                  <p className='stats-num'>26</p>
                  <p className='stats-text'>Present</p>
                </div>
              </div>
            </div>
            <div className='stat-second-row'>
              <div className='stats-container container-bg2'>
                <img className='stats-icon' src={totalpending} alt="totalpending" />
                <div>
                  <p className='stats-num'>1</p>
                  <p className='stats-text'>Absent</p>
                </div>
              </div>
              <div className='stats-container container-bg3'>
                <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                <div>
                  <p className='stats-num'>1</p>
                  <p className='stats-text'>On Duty</p>
                </div>
              </div>
            </div>
          </div>
          <div className='table-main-header'>
            <p className='table-header-text'>Attendance</p>
            {/*             <button className='table-btn' onClick={openAddAttendanceModal}><IoMdAdd />Add Attendance</button> */}
          </div>
          <TableContainer className="table-main-container">
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Day</Th>
                  <Th>Time In</Th>
                  <Th>Time Out</Th>
                  <Th>Working Hours</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((record) => (
                    <Tr key={record._id}>
                      <Td>{record.day}</Td>
                      <Td>{record.timeIn || "Not marked"}</Td>
                      <Td>{record.timeOut || "Not marked"}</Td>
                      <Td>{record.workingHours || "N/A"}</Td>
                      <Td>{record.timeOut ? "Completed" : "Pending"}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="5" style={{ textAlign: "center" }}>No attendance records found</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>


    </>
  )
}

export default Attendance