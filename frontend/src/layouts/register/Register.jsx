import { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    // State for user data
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        cnic: "",
        role: "",
        status: "",
        gender: "",
    });

    // Function to capture image
    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return alert("❌ Failed to capture image.");
        setCapturedImage(imageSrc);
    };

    // Function to handle registration
    const handleRegister = async () => {
        if (!capturedImage) return alert("⚠️ Please capture an image first.");

        // Basic validation for required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone || !userData.cnic || !userData.role || !userData.status || !userData.gender) {
            return alert("⚠️ All fields are required.");
        }

        setLoading(true);
        const blob = dataURLtoBlob(capturedImage);
        const formData = new FormData();
        formData.append("faceImage", blob, "face.jpg");

        // Append user data to form
        Object.keys(userData).forEach((key) => formData.append(key, userData[key]));

        try {
            const res = await axios.post("http://localhost:8000/api/register", formData);
            alert(`✅ ${res.data.message}`);
            navigate("/");
        } catch (err) {
            alert("❌ Registration failed. Try again.");
            console.error("❌ Error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Convert Data URL to Blob
    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(",")[1]);
        const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    return (
        <div className="mainn flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <div className={`main bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition ${loading ? "blur-sm" : ""}`}>
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>

                {/* Input Fields */}
                <div className="space-y-4">
                    <input type="text" placeholder="First Name" className="input-box" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} />
                    <input type="text" placeholder="Last Name" className="input-box" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} />
                    <input type="email" placeholder="Email" className="input-box" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                    <input type="text" placeholder="Phone" className="input-box" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
                    <input type="text" placeholder="CNIC" className="input-box" value={userData.cnic} onChange={(e) => setUserData({ ...userData, cnic: e.target.value })} />
                    <input type="text" placeholder="Role" className="input-box" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })} />
                    <input type="text" placeholder="Status" className="input-box" value={userData.status} onChange={(e) => setUserData({ ...userData, status: e.target.value })} />

                    {/* Gender Selection */}
                    <select className="input-box" value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Webcam Section */}
                <div className="cam flex flex-col items-center my-6">
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcamm rounded-lg shadow-md w-64 h-48" />
                </div>

                {/* Captured Image Preview */}
                {capturedImage && (
                    <div className="cam camm flex flex-col items-center my-4">
                        <img src={capturedImage} alt="Captured" className="webcamm rounded-lg shadow-md w-32 h-32" />
                    </div>
                )}

                {/* Buttons */}
                <button onClick={captureImage} className="btn-primary mt-4">Capture Image</button>
                <br />
                <button onClick={handleRegister} disabled={loading} className="btn-primary w-full">
                    Register
                </button>

                {/* Login Redirect */}
                <p className="text-center mt-6 text-gray-700">
                    Already have an account? <Link to={"/"}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

/* import { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [capturedImage, setCapturedImage] = useState(null);

    // Capture image from webcam
    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            alert("❌ Failed to capture image.");
            return;
        }
        setCapturedImage(imageSrc);
    };

    // Handle user registration
    const handleRegister = async () => {
        if (!capturedImage) {
            alert("⚠️ Please capture an image first.");
            return;
        }

        setLoading(true);
        const blob = dataURLtoBlob(capturedImage);
        const formData = new FormData();
        formData.append("faceImage", blob, "face.jpg");
        Object.keys(userData).forEach((key) => formData.append(key, userData[key]));

        try {
            const res = await axios.post("http://localhost:8000/api/register", formData);
            alert(`✅ ${res.data.message}`);
            navigate("/");
        } catch (err) {
            alert("❌ Registration failed. Try again.");
            console.error("❌ Error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };


    const dataURLtoBlob = (dataURL) => {
        const byteString = atob(dataURL.split(",")[1]);
        const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                <input
                    type="text" placeholder="First Name"
                    className="input" value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                />
                <input
                    type="text" placeholder="Last Name"
                    className="input" value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                />
                <input
                    type="email" placeholder="Email"
                    className="input" value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
                <input
                    type="text" placeholder="Phone"
                    className="input" value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />


                <div className="flex flex-col items-center my-4">
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-md shadow-md" />
                    <button
                        onClick={captureImage}
                        className="btn mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Capture Image
                    </button>
                </div>


                {capturedImage && (
                    <div className="flex flex-col items-center my-4">
                        <img src={capturedImage} alt="Captured" className="rounded-md shadow-md w-32 h-32" />
                    </div>
                )}

                <button
                    onClick={handleRegister} disabled={loading}
                    className={`btn w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account? <a href="/" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
 */