import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./dashboard.css"
import welcome from '../../assets/dashboard/welcome.png';
import complete from '../../assets/tasks/complete.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { FcStatistics } from "react-icons/fc";
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';

function Dashboard({ setUser, user, handleLogout }) {
  const [dashboardData, setDashboardData] = useState([]);

  const getDashboard = async () => {
    const response = await axios.get('api/dashboard')
    setDashboardData(response.data)

  }

  const handleSubmit = async () => {
    try {
      console.log("Start...................");
      const email = localStorage.getItem('email');  // Get email from localStorage
      console.log(email);

      if (!email) {
        console.error("Email not found in localStorage");
        return;
      }

      const response = await axios.post('http://localhost:8000/api/login-details', { email });
      console.log(response.data);
      setUser(response.data.user)
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    handleSubmit()

    getDashboard()

  }, [])


  return (
    <>
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav user={user} handleLogout={handleLogout} /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='welcome-main-container'>
            <div className='welcome-left-container'>
              <p className='mng-text'>Welcome To </p>
              <p className='mng-text'>Task Management Area</p>
              <p className='mng-para'>In this task management hub, the system seamlessly orchestrates task creation, assignment, and tracking, ensuring projects move forward smoothly and collaboratively.</p>
            </div>
            <div className='welcome-right-container'>
              <img className='welcome-img' src={welcome} alt="welcome" />
            </div>
          </div>
          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Employees Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>100</p>
                      <p className='stats-text'>Total Employees</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>80</p>
                      <p className='stats-text'>Active Employees</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>17</p>
                      <p className='stats-text'>In Active Employees</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>3</p>
                      <p className='stats-text'>Terminated Employees</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>1000</p>
                      <p className='stats-text'>Total Projects</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>800</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>150</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>50</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Tasks Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>1000</p>
                      <p className='stats-text'>Total Tasks</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>800</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>150</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>50</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Timesheets Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>500</p>
                      <p className='stats-text'>Total Timesheets</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>350</p>
                      <p className='stats-text'>Development Type</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>100</p>
                      <p className='stats-text'>Testing Type</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>50</p>
                      <p className='stats-text'>Other Type</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='dashboard-main-right-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Employees Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress value={80} color='#05A301' size={'100px'}>
                      <CircularProgressLabel>80%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Active</p>
                  </div>
                  <div>
                    <CircularProgress value={17} color='#0225FF' size={'100px'}>
                      <CircularProgressLabel>17%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Active</p>
                  </div>
                  <div>
                    <CircularProgress value={3} color='#F21E1E' size={'100px'}>
                      <CircularProgressLabel>3%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Termintaed</p>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Projects Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress value={80} color='#05A301' size={'100px'}>
                      <CircularProgressLabel>80%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Completed</p>
                  </div>
                  <div>
                    <CircularProgress value={15} color='#0225FF' size={'100px'}>
                      <CircularProgressLabel>15%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Progress</p>

                  </div>
               
                  <div>
                    <CircularProgress value={5} color='#F21E1E' size={'100px'}>
                      <CircularProgressLabel>5%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Pending</p>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Tasks Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress value={80} color='#05A301' size={'100px'}>
                      <CircularProgressLabel>80%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Completed</p>
                  </div>
                  <div>
                    <CircularProgress value={15} color='#0225FF' size={'100px'}>
                      <CircularProgressLabel>15%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Progress</p>
                  </div>
                  <div>
                    <CircularProgress value={5} color='#F21E1E' size={'100px'}>
                      <CircularProgressLabel>5%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Pending</p>
                  </div>
                </div>
              </div>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt="complete" />
                  <p className='todo-text'>Timesheets Status</p>
                </div>
                <div className='task-status-progress-main-container'>
                  <div>
                    <CircularProgress value={70} color='#05A301' size={'100px'}>
                      <CircularProgressLabel>70%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Development</p>
                  </div>
                  <div>
                    <CircularProgress value={20} color='orange' size={'100px'}>
                      <CircularProgressLabel>20%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='testing'>Testing</p>

                  </div>
                  <div>
                    <CircularProgress value={10} color='#F21E1E' size={'100px'}>
                      <CircularProgressLabel>10%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Other</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default Dashboard