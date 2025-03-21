
/* const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const Employee = require("../models/employees");
const { createCanvas, loadImage } = canvas;
const path = require("path");
const router = express.Router();

faceapi.env.monkeyPatch(canvas);

// Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Load Face Recognition Models once
let isModelsLoaded = false;
const modelPath = path.join(__dirname, "../models");

const loadModels = async () => {
    if (isModelsLoaded) return;
    try {
        console.log("⏳ Loading Face Recognition Models...");
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        isModelsLoaded = true;
        console.log("✅ Face Recognition Models Loaded");
    } catch (error) {
        console.error("❌ Error loading models:", error);
    }
};

loadModels();  // Load once on server start

// Optimize image size for faster face detection
const optimizeImage = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        loadImage(imageBuffer)
            .then((img) => {
                const canvas = createCanvas(img.width / 4, img.height / 4); // Reduce size more aggressively
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas);
            })
            .catch(reject);
    });
};

// Convert Buffer to Canvas
const bufferToCanvas = async (buffer) => {
    const canvasImage = await optimizeImage(buffer);  // Resize before processing
    return canvasImage;
};

// Register API
router.post("/register", upload.single("faceImage"), async (req, res) => {
    try {
        console.log("🟢 Register API called");
        const { firstName, lastName, email, phone, role, gender } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const faceBuffer = req.file.buffer;
        const canvasImage = await bufferToCanvas(faceBuffer);
        const detections = await faceapi.detectSingleFace(canvasImage)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detections || !detections.descriptor) {
            console.log("❌ No face detected during registration.");
            return res.status(400).json({ message: "No face detected. Try again." });
        }

        console.log("✅ Face detected, storing in database...");
        const faceDescriptorArray = Array.from(detections.descriptor);

        // Ensure valid descriptor
        if (faceDescriptorArray.length !== 128) {
            return res.status(400).json({ message: "Invalid face descriptor." });
        }

        const employee = new Employee({
            firstName,
            lastName,
            email,
            phone,
            role,
            gender,
            faceData: faceDescriptorArray,
        });
        await employee.save();
        console.log("🟢 User registered successfully!");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
});

// Function to Compare Face Descriptors using Approximate Nearest Neighbor
const matchFace = async (imageBuffer, userDescriptors) => {
    const img = await loadImage(`data:image/jpeg;base64,${imageBuffer.toString("base64")}`);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detection || !detection.descriptor) {
        console.log("❌ No face detected in login attempt.");
        throw new Error("No face detected. Try again.");
    }

    console.log("🔍 Face detected, comparing with stored users...");
    const queryDescriptor = new Float32Array(detection.descriptor);

    // Use a threshold to compare face descriptors more efficiently
    let bestMatch = null;
    let bestDistance = 1.0;  // Maximum threshold for face recognition

    // This step performs comparison against all registered users
    let matchFound = false;
    const threshold = 0.6; // Threshold for a successful match
    for (let user of userDescriptors) {
        if (!user.faceData || user.faceData.length !== 128) continue;  // Skip invalid descriptors

        const storedDescriptor = new Float32Array(user.faceData);
        const distance = faceapi.euclideanDistance(queryDescriptor, storedDescriptor);

        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = user.email;
            if (distance < threshold) {  // Threshold to decide if a match is found
                matchFound = true;
                break;  // Exit early once a match is found
            }
        }
    }

    console.log(`✅ Best match: ${bestMatch || "None"} (Distance: ${bestDistance.toFixed(4)})`);
    return matchFound ? bestMatch : null;
};

// Generate JWT Token
const generateToken = (email) => {
    return jwt.sign({ email }, "your-secret-key", { expiresIn: "1h" });
};

// Login Route
router.post("/login", upload.single("faceImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("🔵 Processing login request...");
        const imageBuffer = req.file.buffer;

        // Fetch user descriptors in a more optimized way (this could also be cached in memory for faster access)
        const users = await Employee.find({}, "email faceData");

        if (!users || users.length === 0) {
            console.log("❌ No registered users found.");
            return res.status(400).json({ message: "No registered users found." });
        }

        const matchedUser = await matchFace(imageBuffer, users);

        if (matchedUser) {
            const token = generateToken(matchedUser);
            return res.status(200).json({ matchFound: true, token });
        } else {
            return res.status(401).json({ matchFound: false, message: "Face not recognized." });
        }
    } catch (error) {
        console.error("❌ Login error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
 */
const mongoose = require('mongoose');
const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const Employee = require("../models/employees");
const User = require("../models/users");
const Attendance = require("../models/attendances");
const { createCanvas, loadImage } = canvas;
const path = require("path");
const router = express.Router();

faceapi.env.monkeyPatch(canvas);

// Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Load Face Recognition Models once
let isModelsLoaded = false;
const modelPath = path.join(__dirname, "../models");

const loadModels = async () => {
    if (isModelsLoaded) return;
    try {
        console.log("⏳ Loading Face Recognition Models...");
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        isModelsLoaded = true;
        console.log("✅ Face Recognition Models Loaded");
    } catch (error) {
        console.error("❌ Error loading models:", error);

    }
};

loadModels();  // Load once on server start

// Optimize image size for faster face detection
const optimizeImage = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        loadImage(imageBuffer)
            .then((img) => {
                const canvas = createCanvas(img.width / 2, img.height / 2); // Reduce size moderately
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas);
            })
            .catch(reject);
    });
};

// Convert Buffer to Canvas
const bufferToCanvas = async (buffer) => {
    const canvasImage = await optimizeImage(buffer);  // Resize before processing
    return canvasImage;
};

// Cache user descriptors in-memory to speed up login (this can be persisted in Redis for production)
let userDescriptorsCache = [];

// Pre-load user descriptors in-memory (this should ideally be updated when a new user registers)
const preloadUserDescriptors = async () => {
    const users = await Employee.find({}, "email faceData");
    userDescriptorsCache = users.map(user => ({
        email: user.email,
        faceData: new Float32Array(user.faceData),
    }));
};

preloadUserDescriptors();  // Pre-load the descriptors once during server startup

// Register API
router.post("/register", upload.single("faceImage"), async (req, res) => {
    try {
        console.log("🟢 Register API called");
        const { firstName, lastName, email, phone, role, gender } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const faceBuffer = req.file.buffer;
        const canvasImage = await bufferToCanvas(faceBuffer);
        const detections = await faceapi.detectSingleFace(canvasImage)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detections || !detections.descriptor) {
            console.log("❌ No face detected during registration.");
            return res.status(400).json({ message: "No face detected. Try again." });
        }

        console.log("✅ Face detected, storing in database...");
        const faceDescriptorArray = Array.from(detections.descriptor);

        // Ensure valid descriptor
        if (faceDescriptorArray.length !== 128) {
            return res.status(400).json({ message: "Invalid face descriptor." });
        }

        const employee = new Employee({
            firstName,
            lastName,
            email,
            phone,
            role,
            gender,
            faceData: faceDescriptorArray,
        });
        const user = new User({
            firstName,
            lastName,
            email,
        })

        await employee.save();
        await user.save();
        preloadUserDescriptors();  // Reload descriptors cache after new registration
        console.log("🟢 User registered successfully!");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
});

// Function to Compare Face Descriptors using Approximate Nearest Neighbor
const matchFace = async (imageBuffer) => {
    const img = await loadImage(`data:image/jpeg;base64,${imageBuffer.toString("base64")}`);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!detection || !detection.descriptor) {
        console.log("❌ No face detected in login attempt.");
        throw new Error("No face detected. Try again.");
    }

    console.log("🔍 Face detected, comparing with stored users...");
    const queryDescriptor = new Float32Array(detection.descriptor);

    // Use a threshold to compare face descriptors more efficiently
    const threshold = 0.6; // Threshold for a successful match
    let matchFound = false;
    let bestMatch = null;
    let bestDistance = 1.0;  // Maximum threshold for face recognition

    // Perform comparisons concurrently using Promise.all
    await Promise.all(
        userDescriptorsCache.map(async (user) => {
            if (!user.faceData || user.faceData.length !== 128) return;

            const storedDescriptor = user.faceData;
            const distance = faceapi.euclideanDistance(queryDescriptor, storedDescriptor);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = user.email;
                if (distance < threshold) {
                    matchFound = true;
                }
            }
        })
    );

    console.log(`✅ Best match: ${bestMatch || "None"} (Distance: ${bestDistance.toFixed(4)})`);
    return matchFound ? bestMatch : null;
};

// Generate JWT Token
const generateToken = (email) => {
    return jwt.sign({ email }, "your-secret-key", { expiresIn: "1h" });
};

// Login Route
router.post("/login", upload.single("faceImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("🔵 Processing login request...");
        const imageBuffer = req.file.buffer;

        // Match face using pre-loaded descriptors
        const matchedUser = await matchFace(imageBuffer);

        if (matchedUser) {
            console.log(matchedUser);
            const token = generateToken(matchedUser);
            const user = await Employee.findOne({ email: matchedUser });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            console.log("🟢 User ID:", user._id);

            // Get current date & formatted timeIn (24-hour format)
            const currentDate = new Date();
            const day = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
            const timeIn = currentDate.toLocaleTimeString("en-GB", { hour12: false }); // HH:MM:SS

            // Check if attendance exists for today
            const existingAttendance = await Attendance.findOne({ employee: user._id, day });

            if (!existingAttendance) {
                const attendance = new Attendance({
                    employee: user._id,
                    day,
                    timeIn
                });
                await attendance.save();
                console.log("✅ Attendance marked:", attendance);
            } else {
                console.log("⚠️ Attendance already marked for today.");
            }

            return res.status(200).json({ matchFound: true, token, matchedUser, user });
        } else {
            return res.status(401).json({ matchFound: false, message: "Face not recognized." });
        }
    } catch (error) {
        console.error("❌ Login error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login-details', async (req, res) => {
    try {
        console.log("Request received:", req.body);

        const { email } = req.body; // Extract email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await Employee.findOne({ email }); // Find user by email

        if (!user) {
            return res.status(401).json({ message: 'Please Logout and Log in' });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;