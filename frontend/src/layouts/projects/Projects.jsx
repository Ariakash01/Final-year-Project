import React, { useState, useEffect } from 'react';
import Sidenav from '../../components/sidenav/Sidenav';
import Navbar from '../../components/navbar/Navbar';
import { CircularProgress, CircularProgressLabel, Tag } from '@chakra-ui/react';
import { IoReaderOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';
import AddProjectModal from './modals/AddProject';
import ReadProjectModal from './modals/ReadProject';
import axios from 'axios';
import './projects.css';
import pending from '../../assets/tasks/Pending.png';
import complete from '../../assets/tasks/complete.png';
import book from '../../assets/tasks/Book.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';

function Projects({ user, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isReadProjectModalOpen, setIsReadProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const pendingProjects = projects.filter(p => p.status === 'Pending').length;
  const testingProjects = projects.filter(p => p.status === 'Testing').length;
  const getProgressValue = (status) => {
    switch (status) {
      case 'Completed': return 100;
      case 'Testing': return 80;
      case 'In Progress': return 50;
      case 'Pending': return 20;
      default: return 0;
    }
  };
  useEffect(() => {
    axios.get('/api/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const openAddProjectModal = () => setIsAddProjectModalOpen(true);
  const closeAddProjectModal = () => setIsAddProjectModalOpen(false);
  const openReadProjectModal = (project) => {
    setSelectedProject(project);
    setIsReadProjectModalOpen(true);
  };
  const closeReadProjectModal = () => setIsReadProjectModalOpen(false);



  return (
    <>
      <AddProjectModal isOpen={isAddProjectModalOpen} onClose={closeAddProjectModal} />
      <ReadProjectModal isOpen={isReadProjectModalOpen} onClose={closeReadProjectModal} project={selectedProject} />
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav user={user} handleLogout={handleLogout} /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <img src={totaltasks} alt='Total Tasks' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <p className='stats-num'>{totalProjects}</p>
                    <p className='stats-text'>Total Projects</p>
                  </div>
                  <div className='stats-container container-bg4'>
                    <p className='stats-num'>{completedProjects}</p>
                    <p className='stats-text'>Completed</p>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <p className='stats-num'>{inProgressProjects}</p>
                    <p className='stats-text'>In Progress</p>
                  </div>
                  <div className='stats-container container-bg3'>
                    <p className='stats-num'>{pendingProjects}</p>
                    <p className='stats-text'>Pending</p>
                  </div>
                </div>
              </div>


            </div>

            <div className='dashboard-main-right-container'>

              <div className='task-status-card-container flex_col'>
                <div className='add-task-inner-div'>
                  <img src={complete} alt='Complete' />
                  <p className='todo-text'>Projects Status</p>
                </div>
                <div className='flex'>


                  <div className='task-status-progress-main-container'>
                    <CircularProgress value={completedProjects / totalProjects * 100} color='#05A301' size={'80px'}>
                      <CircularProgressLabel>{Math.round(completedProjects / totalProjects * 100)}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='completed'>Completed</p>
                  </div>
                  <div className='task-status-progress-main-container'>
                    <CircularProgress value={inProgressProjects / totalProjects * 100} color='#0225FF' size={'80px'}>
                      <CircularProgressLabel>{Math.round(inProgressProjects / totalProjects * 100)}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Progress</p>
                  </div>
                  <div className='task-status-progress-main-container'>
                    <CircularProgress value={testingProjects / totalProjects * 100} color='orange' size={'80px'}>
                      <CircularProgressLabel>{Math.round(testingProjects / totalProjects * 100)}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='testing'>Testing</p>
                  </div>
                  <div className='task-status-progress-main-container'>
                    <CircularProgress value={pendingProjects / totalProjects * 100} color='#F21E1E' size={'80px'}>
                      <CircularProgressLabel>{Math.round(pendingProjects / totalProjects * 100)}%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='task-status-card-container'>
            <div className='add-task-main-div'>
              <div className='add-task-inner-div'>
                <img src={pending} alt='pending' />
                <p className='todo-text'>To-Do Projects</p>
              </div>
              <button className='table-btn-task' onClick={openAddProjectModal}><IoMdAdd /> Add Project</button>
            </div>
            <div className="flex_pro">


              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <div className='task-card-container width' key={index}>
                    <p className='task-title'>{project.title}</p>
                    <div className='task-desc-container'>
                      <p className='task-desc'>{project.description}</p>
                    </div>
                    <div className='task-card-footer-container'>
                      <Tag size='lg' colorScheme='red' borderRadius='full'>
                        <p className='tag-text'>{project.priority}</p>
                      </Tag>

                      <div className='task-status-progress-container'>

                        <CircularProgress value={getProgressValue(project.status)} color='#05A301' size={'50px'}>
                          <CircularProgressLabel>{getProgressValue(project.status)}%</CircularProgressLabel>
                        </CircularProgress>
                        <p className='status-text'>{project.status}</p>
                      </div>
                      <div className='task-read' onClick={() => openReadProjectModal(project)}>
                        <IoReaderOutline className='read-icon' />
                      </div>
                    </div>
                    <p className='created'>Created on: {new Date(project.startDate).toLocaleDateString()}</p>
                  </div>

                ))
              ) : (
                <p>No projects found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;



/* 


import React, { useState } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./projects.css"
import pending from '../../assets/tasks/Pending.png';
import complete from '../../assets/tasks/complete.png';
import book from '../../assets/tasks/Book.png';
import totaltasks from '../../assets/tasks/totaltasks.png';
import totalprogress from '../../assets/tasks/totalprogress.png';
import totalpending from '../../assets/tasks/totalpending.png';
import totalcomplete from '../../assets/tasks/totalcomplete.png';
import { IoReaderOutline } from "react-icons/io5";
import { FcStatistics } from "react-icons/fc";
import Navbar from '../../components/navbar/Navbar'
import {
  Tag,
} from '@chakra-ui/react'
import AddProjectModal from './modals/AddProject';
import ReadProjectModal from './modals/ReadProject';
import { IoMdAdd } from "react-icons/io";


function Projects({ user, handleLogout }) {
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isReadProjectModalOpen, setIsReadProjectModalOpen] = useState(false);

  const openAddProjectModal = () => {
    setIsAddProjectModalOpen(true);
  };
  const openReadProjectModal = () => {
    setIsReadProjectModalOpen(true);
  };

  const closeAddProjectModal = () => {
    setIsAddProjectModalOpen(false);
  };
  const closeReadProjectModal = () => {
    setIsReadProjectModalOpen(false);
  };

  return (
    <>
      <AddProjectModal isOpen={isAddProjectModalOpen} onClose={closeAddProjectModal} />
      <ReadProjectModal isOpen={isReadProjectModalOpen} onClose={closeReadProjectModal} />
      <div className='app-main-container'>
        <div className='app-main-left-container'><Sidenav user={user} handleLogout={handleLogout} /></div>
        <div className='app-main-right-container'>
          <Navbar />
          <div className='dashboard-main-container'>
            <div className='dashboard-main-left-container'>
              <div className='task-status-card-container'>
                <div className='add-task-inner-div'>
                  <FcStatistics className='task-stats' />
                  <p className='todo-text'>Projects Statistics</p>
                </div>
                <div className='stat-first-row'>
                  <div className='stats-container container-bg1'>
                    <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Total Projects</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg4'>
                    <img className='stats-icon' src={totalcomplete} alt="totalcomplete" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Completed</p>
                    </div>
                  </div>
                </div>
                <div className='stat-second-row'>
                  <div className='stats-container container-bg2'>
                    <img className='stats-icon' src={totalprogress} alt="totalprogress" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>In Progress</p>
                    </div>
                  </div>
                  <div className='stats-container container-bg3'>
                    <img className='stats-icon' src={totalpending} alt="totalpending" />
                    <div>
                      <p className='stats-num'>1200</p>
                      <p className='stats-text'>Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={pending} alt="pending" />
                    <p className='todo-text'>To-Do Projects</p>
                  </div>
                  <button className='table-btn-task' onClick={openAddProjectModal}><IoMdAdd />Add Project</button>

                </div>
                <div className='task-card-container'>
                  <p className='task-title'> Employee Timesheet System
                    Party</p>
                  <div className='task-desc-container'>
                    <p className='task-desc'>A system for employees to log work hours and track approvals. It ensures accurate timesheet submission and manager approvals. Employees can generate reports for payroll processing. The system is integrated with authentication and access control. </p>
                  </div>
                  <div className='task-card-footer-container'>
                    <div>
                      <Tag size='lg' colorScheme='red' borderRadius='full'>
                        <p className='tag-text'>Most Important</p>
                      </Tag>
                    </div>
                    <div>
                      <div className='task-read' onClick={openReadProjectModal}>
                        <IoReaderOutline className='read-icon' />
                      </div>
                    </div>
                  </div>
                  <p className='created'>Created on: 20/06/2023</p>
                </div>
                <div className='task-card-container'>
                  <p className='task-title'>Payroll Management System</p>
                  <div className='task-desc-container'>
                    <p className='task-desc'>Automates salary calculations, deductions, and payslip generation. It manages tax deductions and direct salary deposits. Employees can view their salary history and payslips. Payroll reports are generated for HR and finance teams.</p>
                  </div>
                  <div className='task-card-footer-container'>
                    <div>
                      <Tag size='lg' colorScheme='red' borderRadius='full'>
                        <p className='tag-text'>Most Important</p>
                      </Tag>
                    </div>
                    <div>
                      <div className='task-read'>
                        <IoReaderOutline className='read-icon' />
                      </div>
                    </div>
                  </div>
                  <p className='created'>Created on: 10/03/2025</p>
                </div>
              </div>
            </div>

            <div className='dashboard-main-right-container'>
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
                    <CircularProgress value={60} color='#0225FF' size={'100px'}>
                      <CircularProgressLabel>60%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='progress'>In Progress</p>

                  </div>
                  <div>
                    <CircularProgress value={40} color='orange' size={'100px'}>
                      <CircularProgressLabel>40%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='testing'>Testing</p>

                  </div>
                  <div>
                    <CircularProgress value={20} color='#F21E1E' size={'100px'}>
                      <CircularProgressLabel>20%</CircularProgressLabel>
                    </CircularProgress>
                    <p className='pending'>Pending</p>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={book} alt="Book" />
                    <p className='todo-text'>In Progress Projects</p>
                  </div>
                </div>
                <div className='task-card-container'>
                  <p className='task-title'>Leave Management System
                    Party</p>
                  <div className='task-desc-container'>
                    <p className='task-desc'>Allows employees to apply for leaves and track approval status. Managers can approve or reject leave requests based on policies. A calendar view displays employee leave schedules. Leave reports help HR manage workforce availability. </p>
                  </div>
                  <div className='task-card-footer-container'>
                    <div>
                      <Tag size='lg' colorScheme='blue' borderRadius='full'>
                        <p className='tag-text'>In Progress</p>
                      </Tag>
                    </div>
                    <div>
                      <div className='task-read'>
                        <IoReaderOutline className='read-icon' />
                      </div>
                    </div>
                    <div>
                      <CircularProgress value={40} color='#0225FF'>
                        <CircularProgressLabel>40%</CircularProgressLabel>
                      </CircularProgress>
                    </div>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={book} alt="Book" />
                    <p className='todo-text'>Testing Projects</p>
                  </div>
                </div>
                <div className='task-card-container'>
                  <p className='task-title'>Performance Review System
                    Party</p>
                  <div className='task-desc-container'>
                    <p className='task-desc'>Enables managers to assess employee performance and provide feedback. Employees can view ratings and comments from managers. The system generates performance reports for promotions. It integrates KPIs and analytics for better evaluation.</p>
                  </div>
                  <div className='task-card-footer-container'>
                    <div>
                      <Tag size='lg' colorScheme='orange' borderRadius='full'>
                        <p className='tag-text'>Testing</p>
                      </Tag>
                    </div>
                    <div>
                      <div className='task-read'>
                        <IoReaderOutline className='read-icon' />
                      </div>
                    </div>
                    <div>
                      <CircularProgress value={40} color='orange'>
                        <CircularProgressLabel>40%</CircularProgressLabel>
                      </CircularProgress>
                    </div>
                  </div>
                </div>
              </div>
              <div className='add-task-main-container'>
                <div className='add-task-main-div'>
                  <div className='add-task-inner-div'>
                    <img src={book} alt="Book" />
                    <p className='todo-text'>Completed Projects</p>
                  </div>
                </div>
                <div className='task-card-container'>
                  <p className='task-title'>Attendance Tracking System
                    Party</p>
                  <div className='task-desc-container'>
                    <p className='task-desc'>Tracks employee check-in and check-out times for daily attendance. Uses biometric or online login methods for accuracy. Generates attendance reports for payroll processing. Flags late arrivals and absentees for HR review.</p>
                  </div>
                  <div className='task-card-footer-container'>
                    <div>
                      <Tag size='lg' colorScheme='green' borderRadius='full'>
                        <p className='tag-text'>Completed</p>
                      </Tag>
                    </div>
                    <div>
                      <div className='task-read'>
                        <IoReaderOutline className='read-icon' />
                      </div>
                    </div>
                  </div>
                  <p className='created'>Completed 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Projects  */