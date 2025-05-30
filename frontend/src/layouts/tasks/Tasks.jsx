/* import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./tasks.css"
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
import AddTaskModal from './modals/AddTask';
import ReadTaskModal from './modals/ReadTask';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';

function Tasks({ user, handleLogout }) {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isReadTaskModalOpen, setIsReadTaskModalOpen] = useState(false);

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };
    const openReadTaskModal = () => {
        setIsReadTaskModalOpen(true);
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };
    const closeReadTaskModal = () => {
        setIsReadTaskModalOpen(false);
    };
    return (
        <>
            <AddTaskModal isOpen={isAddTaskModalOpen} onClose={closeAddTaskModal} />
            <ReadTaskModal isOpen={isReadTaskModalOpen} onClose={closeReadTaskModal} />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav user={user} handleLogout={handleLogout} /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='dashboard-main-left-container'>
                            <div className='task-status-card-container'>
                                <div className='add-task-inner-div'>
                                    <FcStatistics className='task-stats' />
                                    <p className='todo-text'>Tasks Statistics</p>
                                </div>
                                <div className='stat-first-row'>
                                    <div className='stats-container container-bg1'>
                                        <img className='stats-icon' src={totaltasks} alt="totaltasks" />
                                        <div>
                                            <p className='stats-num'>1200</p>
                                            <p className='stats-text'>Total Task</p>
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
                                        <p className='todo-text'>To-Do Tasks</p>
                                    </div>
                                    <button className='table-btn-task' onClick={openAddTaskModal}><IoMdAdd />Add Task</button>
                                </div>
                                <div className='task-card-container'>
                                    <p className='task-title'>Create Timesheet API
                                        Party</p>
                                    <div className='task-desc-container'>
                                        <p className='task-desc'>Develop RESTful APIs for timesheet CRUD operations. Implement data validation and authentication for secure access. The API should allow employees to submit and update entries. Managers must have access to approve or reject requests.</p>
                                    </div>
                                    <div className='task-card-footer-container'>
                                        <div>
                                            <Tag size='lg' colorScheme='red' borderRadius='full'>
                                                <p className='tag-text'>Most Important</p>
                                            </Tag>
                                        </div>
                                        <div>
                                            <div className='task-read' onClick={openReadTaskModal}>
                                                <IoReaderOutline className='read-icon' />
                                            </div>
                                        </div>
                                    </div>
                                    <p className='created'>Created on: 20/06/2023</p>
                                </div>
                                <div className='task-card-container'>
                                    <p className='task-title'>Implement Role-Based Access
                                        Party</p>
                                    <div className='task-desc-container'>
                                        <p className='task-desc'>Restrict features based on employee, manager, and admin roles. Employees can submit and view their own timesheets. Managers can approve, reject, or request changes. Admins have full control over timesheet records and settings. </p>
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
                                    <p className='created'>Created on: 20/06/2023</p>
                                </div>
                            </div>
                        </div>

                        <div className='dashboard-main-right-container'>
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
                                        <CircularProgress value={60} color='#0225FF' size={'100px'}>
                                            <CircularProgressLabel>60%</CircularProgressLabel>
                                        </CircularProgress>
                                        <p className='progress'>In Progress</p>
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
                                        <p className='todo-text'>In Progress Tasks</p>
                                    </div>
                                </div>
                                <div className='task-card-container'>
                                    <p className='task-title'>Generate Payroll Reports
                                        Party</p>
                                    <div className='task-desc-container'>
                                        <p className='task-desc'>Develop functionality to generate salary reports from timesheets. Automate calculations based on working hours and rates. Ensure reports include deductions, bonuses, and overtime. Provide PDF export and download options.</p>
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
                                        <p className='todo-text'>Completed Tasks</p>
                                    </div>
                                </div>
                                <div className='task-card-container'>
                                    <p className='task-title'>Integrate Resume Parser
                                        Party</p>
                                    <div className='task-desc-container'>
                                        <p className='task-desc'>Develop functionality to extract key details from resumes. Parse name, skills, experience, and education automatically. Store parsed data in a structured format for HR review. Improve candidate shortlisting efficiency.</p>
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

export default Tasks

 */


import React, { useState, useEffect } from 'react'
import Sidenav from '../../components/sidenav/Sidenav'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import "./tasks.css"
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
import AddTaskModal from './modals/AddTask';
import ReadTaskModal from './modals/ReadTask';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';

function Tasks({ user, handleLogout }) {


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
        axios.get('/api/tasks')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error fetching projects:', error));
    }, []);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isReadTaskModalOpen, setIsReadTaskModalOpen] = useState(false);

    const openAddTaskModal = () => {
        setIsAddTaskModalOpen(true);
    };
    const openReadTaskModal = () => {
        setIsReadTaskModalOpen(true);
    };

    const closeAddTaskModal = () => {
        setIsAddTaskModalOpen(false);
    };
    const closeReadTaskModal = () => {
        setIsReadTaskModalOpen(false);
    };
    return (
        <>
            <AddTaskModal isOpen={isAddTaskModalOpen} onClose={closeAddTaskModal} />
            <ReadTaskModal isOpen={isReadTaskModalOpen} onClose={closeReadTaskModal} project={selectedProject} />
            <div className='app-main-container'>
                <div className='app-main-left-container'><Sidenav user={user} handleLogout={handleLogout} /></div>
                <div className='app-main-right-container'>
                    <Navbar />
                    <div className='dashboard-main-container'>
                        <div className='dashboard-main-left-container'>
                            <div className='task-status-card-container'>
                                <div className='add-task-inner-div'>
                                    <img src={totaltasks} alt='Total Tasks' />
                                    <p className='todo-text'>Task Statistics</p>
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
                                    <p className='todo-text'>Task Status</p>
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
                                <p className='todo-text'>To-Do Tasks</p>
                            </div>
                            <button className='table-btn-task' onClick={openAddTaskModal}><IoMdAdd /> Add Task</button>
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
                                            <div className='task-read' onClick={() => openReadTaskModal(project)}>
                                                <IoReaderOutline className='read-icon' />
                                            </div>
                                        </div>
                                        <p className='created'>Created on: {new Date(project.startDate).toLocaleDateString()}</p>
                                    </div>

                                ))
                            ) : (
                                <p>No Task found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tasks