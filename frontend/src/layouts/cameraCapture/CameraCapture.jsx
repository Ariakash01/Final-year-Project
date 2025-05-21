import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CameraCapture.css";

const Login = ({ lastDate, setlastDate }) => {
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lastAttemptFailed, setLastAttemptFailed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            captureImage();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const captureImage = () => {

        if (webcamRef.current) {
            const capturedImage = webcamRef.current.getScreenshot();
            if (capturedImage) {
                console.log("📸 Image captured:", capturedImage);
                setImageSrc(capturedImage);
                setLoading(true);
                sendLoginRequest(capturedImage);
            } else {
                console.error("❌ Failed to capture image. Webcam might not be ready.");
            }
        } else {
            console.error("❌ Webcam reference is not available.");
        }
    };

    const sendLoginRequest = async (capturedImage) => {
        if (!capturedImage || loading) return;

        console.log("📤 Sending image to backend for authentication...");
        setLoading(true); // Start spinner

        const blob = dataURLtoBlob(capturedImage);
        const formData = new FormData();
        formData.append("faceImage", blob, "face.jpg");

        try {
            const res = await axios.post("http://localhost:8000/api/login", formData);
            if (res.status === 200) {
                setLoading(false); // Stop spinner on success
                localStorage.setItem("tm_token", res.data);
                localStorage.setItem("email", res.data.matchedUser);
                console.log("during login--------->", res.data.user._id);
                setIsAuthenticated(true);
                navigate("/admin/dashboard");
                setLastAttemptFailed(false);
            }
        } catch (err) {
            console.error("❌ Authentication failed:", err.response?.data || err.message);
            setLoading(false); // Stop spinner before waiting

            alert("❌ Authentication failed. Trying again...");

            // Wait 2500ms before retrying
            setTimeout(() => {
                setLoading(true); // Start spinner again before capturing image
                captureImage();
            }, 2500);
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
        <div className="login-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <div className={`login-box ${loading ? "blur-sm" : ""}`}>
                <h2 className="text-3xl font-bold mb-6 text-center">Face Recognition Login</h2>

                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                    videoConstraints={{ facingMode: "user" }}
                />

                {imageSrc && <img src={imageSrc} alt="Captured Face" className="captured-img" />}
            </div>
        </div>
    );
};

export default Login;
