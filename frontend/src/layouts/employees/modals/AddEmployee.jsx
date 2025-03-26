/* import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Tag,
} from '@chakra-ui/react';
import axios from 'axios';
import { useToast, Spinner } from '@chakra-ui/react';

function AddEmployeeModal({ isOpen, onClose }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '1',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        residentialAddress: '',
        cnic: '',
        role: '',
        dateOfBirth: '',
        startDate: '',
        status: 'Active',
        gender: 'Male'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStatusClick = (status) => {
        setFormData({ ...formData, status });
    };

    const handleGenderClick = (gender) => {
        setFormData({ ...formData, gender });
    };
    const token = localStorage.getItem("tm_token");
    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/api/employee', formData);
            setFormData({
                employee_id: '1',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                residentialAddress: '',
                cnic: '',
                role: '',
                dateOfBirth: '',
                startDate: '',
                status: 'Active',
                gender: 'Male'
            });
            let Message = response.data.message
            toast({
                title: Message,
                status: 'success',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            onClose();
        } catch (error) {
            let Error = error.response.data.message
            toast({
                title: Error,
                status: 'error',
                position: 'top',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent >
                <form onSubmit={handleSubmit}>
                    <ModalHeader>Add Employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input mt={3} mb={3} type='hidden' name='employee_id' value={formData.employee_id} />
                        <Input mt={3} mb={3} type='text' required placeholder='First Name' name='firstName' value={formData.firstName} onChange={handleChange} />
                        <Input mt={3} mb={3} type='text' required placeholder='Last Name' name='lastName' value={formData.lastName} onChange={handleChange} />
                        <Input mt={3} mb={3} type='email' required placeholder='Email' name='email' value={formData.email} onChange={handleChange} />
                        <Input mt={3} mb={3} type='number' required placeholder='Phone' name='phone' value={formData.phone} onChange={handleChange} />
                        <Input mt={3} mb={3} type='text' required placeholder='Residential Address' name='residentialAddress' value={formData.residentialAddress} onChange={handleChange} />
                        <Input mt={3} mb={3} type='text' required placeholder='CNIC' name='cnic' value={formData.cnic} onChange={handleChange} />
                        <Input mt={3} mb={3} type='text' required placeholder='Role' name='role' value={formData.role} onChange={handleChange} />
                        <Input mt={3} mb={3} required placeholder="Date Of Birth" type="date" name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} />
                        <Input mt={3} mb={3} required placeholder="Start Date" type="date" name='startDate' value={formData.startDate} onChange={handleChange} />
                        <div className='priority-container'>
                            <p>Status: </p>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.status === 'Active' ? 'green' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleStatusClick('Active')}
                            >
                                <p className='tag-text'>Active</p>
                            </Tag>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.status === 'In Active' ? 'yellow' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleStatusClick('In Active')}
                            >
                                <p className='tag-text'>In Active</p>
                            </Tag>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.status === 'Terminated' ? 'red' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleStatusClick('Terminated')}
                            >
                                <p className='tag-text'>Terminated</p>
                            </Tag>
                        </div>
                        <div className='priority-container'>
                            <p>Gender: </p>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.gender === 'Male' ? 'green' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleGenderClick('Male')}
                            >
                                <p className='tag-text'>Male</p>
                            </Tag>
                            <Tag
                                size='lg'
                                cursor={'pointer'}
                                colorScheme={formData.gender === 'Female' ? 'yellow' : 'gray'}
                                borderRadius='full'
                                onClick={() => handleGenderClick('Female')}
                            >
                                <p className='tag-text'>Female</p>
                            </Tag>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' color="white" bg='darkcyan' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='outline' type="submit">{loading ? <Spinner color='green' /> : 'Add Employee'}</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default AddEmployeeModal; */
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Tag,
    useToast,
    Spinner
} from '@chakra-ui/react';

const AddEmployeeModal = ({ isOpen, onClose }) => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        residentialAddress: '',
        cnic: '',
        role: '',
        dateOfBirth: '',
        startDate: '',
        status: 'Active',
        gender: 'Male'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStatusClick = (status) => {
        setFormData({ ...formData, status });
    };

    const handleGenderClick = (gender) => {
        setFormData({ ...formData, gender });
    };

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return toast({ title: 'Failed to capture image.', status: 'error' });
        setCapturedImage(imageSrc);
    };

    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('tm_token');
        const axiosInstance = axios.create({
            headers: { Authorization: `Bearer ${token}` }
        });

        try {
            const formDataToSend = new FormData();
            if (capturedImage) {
                const blob = dataURLtoBlob(capturedImage);
                formDataToSend.append('faceImage', blob, 'face.jpg');
            }
            Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
            const response = await axiosInstance.post('/api/register', formDataToSend);

            toast({ title: response.data.message, status: 'success' });
            setLoading(false);
            onClose();

        } catch (error) {
            toast({ title: error.response?.data?.message || 'Registration failed.', status: 'error' });
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleRegister}>
                    <ModalHeader>Register Employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input mt={3} type='text' required placeholder='First Name' name='firstName' value={formData.firstName} onChange={handleChange} />
                        <Input mt={3} type='text' required placeholder='Last Name' name='lastName' value={formData.lastName} onChange={handleChange} />
                        <Input mt={3} type='email' required placeholder='Email' name='email' value={formData.email} onChange={handleChange} />
                        <Input mt={3} type='number' required placeholder='Phone' name='phone' value={formData.phone} onChange={handleChange} />
                        <Input mt={3} type='text' required placeholder='Residential Address' name='residentialAddress' value={formData.residentialAddress} onChange={handleChange} />
                        <Input mt={3} type='text' required placeholder='CNIC' name='cnic' value={formData.cnic} onChange={handleChange} />
                        <Input mt={3} type='text' required placeholder='Role' name='role' value={formData.role} onChange={handleChange} />
                        <Input mt={3} type='date' required placeholder='Date Of Birth' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} />
                        <Input mt={3} type='date' required placeholder='Start Date' name='startDate' value={formData.startDate} onChange={handleChange} />
                        <div className='priority-container'>
                            <p>Status:</p>
                            {['Active', 'In Active', 'Terminated'].map((status) => (
                                <Tag key={status} size='lg' cursor='pointer' colorScheme={formData.status === status ? 'green' : 'gray'} borderRadius='full' onClick={() => handleStatusClick(status)}>
                                    {status}
                                </Tag>
                            ))}
                        </div>
                        <div className='priority-container'>
                            <p>Gender:</p>
                            {['Male', 'Female'].map((gender) => (
                                <Tag key={gender} size='lg' cursor='pointer' colorScheme={formData.gender === gender ? 'green' : 'gray'} borderRadius='full' onClick={() => handleGenderClick(gender)}>
                                    {gender}
                                </Tag>
                            ))}
                        </div>
                        <div className='cam flex flex-col items-center my-6'>
                            <Webcam ref={webcamRef} screenshotFormat='image/jpeg' className='webcamm rounded-lg shadow-md w-64 h-48' />
                            <Button mt={3} onClick={captureImage}>Capture Image</Button>
                            {capturedImage && <img src={capturedImage} alt='Captured' className='webcamm rounded-lg shadow-md w-32 h-32' />}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='solid' color='white' bg='darkcyan' mr={3} onClick={onClose}>Close</Button>
                        <Button variant='outline' type='submit'>{loading ? <Spinner color='green' /> : 'Register'}</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AddEmployeeModal;
