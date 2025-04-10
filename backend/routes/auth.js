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
const storage = multer.memoryStorage();
const upload = multer({ storage });
let isModelsLoaded = false;
const modelPath = path.join(__dirname, "../models");
const loadModels = async () => {
    if (isModelsLoaded) return;
    try {
        console.log("⏳ Loading Face Recognition Models...");
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath),
            isModelsLoaded = true;
        console.log("✅ Face Recognition Models Loaded");
    } catch (error) {
        console.error("❌ Error loading models:", error);
    }
};
loadModels();
const optimizeImage = async (imageBuffer) => {
    const img = await loadImage(imageBuffer);
    const canvas = createCanvas(img.width / 2, img.height / 2);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
};
let userDescriptorsCache = [];
const preloadUserDescriptors = async () => {
    const users = await Employee.find({}, "email faceData");
    userDescriptorsCache = users.map(user => ({
        email: user.email,
        faceData: new Float32Array(user.faceData),
    }));
};
preloadUserDescriptors();
router.post("/register", upload.single("faceImage"), async (req, res) => {
    try {
        console.log("🟢 Register API called");
        const { firstName, lastName, email, phone, role, gender, status, cnic } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        const faceBuffer = req.file.buffer;
        const canvasImage = await optimizeImage(faceBuffer);

        const detection = await faceapi.detectSingleFace(canvasImage, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        if (!detection) {
            console.log("❌ No face detected during registration.");
            return res.status(400).json({ message: "No face detected. Try again." });
        }
        console.log("✅ Face detected, storing in database...");
        const faceDescriptorArray = Array.from(detection.descriptor);
        if (faceDescriptorArray.length !== 128) {
            return res.status(400).json({ message: "Invalid face descriptor." });
        }
        const employee = new Employee({
            firstName,
            lastName,
            email,
            phone,
            cnic,
            role,
            status,
            gender,
            faceData: faceDescriptorArray,
        });
        const user = new User({ firstName, lastName, email });
        await employee.save();
        await user.save();
        preloadUserDescriptors();
        console.log("🟢 User registered successfully!");
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
});
const matchFace = async (imageBuffer) => {
    console.log("inside");

    const img = await loadImage(`data:image/jpeg;base64,${imageBuffer.toString("base64")}`);
    console.log(img);

    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) {
        console.log("❌ No face detected in login attempt.");
        throw new Error("No face detected. Try again.");
    }

    console.log("🔍 Face detected, comparing with stored users...");
    const queryDescriptor = new Float32Array(detection.descriptor);

    const threshold = 0.3;
    let bestMatch = null;
    let bestDistance = 1.0;

    for (const user of userDescriptorsCache) {
        if (!user.faceData || user.faceData.length !== 128) continue;

        const distance = faceapi.euclideanDistance(queryDescriptor, user.faceData);

        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = user.email;
        }
    }

    if (bestDistance < threshold) {
        console.log(`✅ Best match: ${bestMatch || "None"} (Distance: ${bestDistance.toFixed(4)})`);
    }
    else {
        console.log(`No Best match Found In Database`);
        console.log(`✅ Best match: ${bestDistance || "None"}` );
    }

    return bestDistance < threshold ? bestMatch : null;
};

const generateToken = (email) => {
    return jwt.sign({ email }, "your-secret-key", { expiresIn: "1h" });
};

router.post("/login", upload.single("faceImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("🔵 Processing login request...");
        const imageBuffer = req.file.buffer;

        console.log("MatchedUser--------->");
        const matchedUser = await matchFace(imageBuffer);
        console.log("After--------->");
        console.log(matchedUser);

        if (matchedUser) {
            const token = generateToken(matchedUser);
            const user = await Employee.findOne({ email: matchedUser });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            console.log("🟢 User ID:", user._id);
            const currentDate = new Date();
            const day = currentDate.toISOString().split("T")[0];
            const timeIn = currentDate.toLocaleTimeString("en-GB", { hour12: false });

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

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await Employee.findOne({ email });

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



/* 

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
const storage = multer.memoryStorage();
const upload = multer({ storage });
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

loadModels();
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
const bufferToCanvas = async (buffer) => {
    const canvasImage = await optimizeImage(buffer);  // Resize before processing
    return canvasImage;
};
let userDescriptorsCache = [];
const preloadUserDescriptors = async () => {
    const users = await Employee.find({}, "email faceData");
    userDescriptorsCache = users.map(user => ({
        email: user.email,
        faceData: new Float32Array(user.faceData),
    }));
};
preloadUserDescriptors();
router.post("/register", upload.single("faceImage"), async (req, res) => {
    try {
        console.log("🟢 Register API called");
        const { firstName, lastName, email, phone, role, gender, status, cnic } = req.body;

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
            cnic,
            role,
            status,
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



 const matchFace = async (imageBuffer) => {
    console.log("inside");
    const img = await loadImage(`data:image/jpeg;base64,${imageBuffer.toString("base64")}`);
    console.log(img);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    console.log("inside2");
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
const generateToken = (email) => {
    return jwt.sign({ email }, "your-secret-key", { expiresIn: "1h" });
};
router.post("/login", upload.single("faceImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        console.log("🔵 Processing login request...");
        const imageBuffer = req.file.buffer;
        console.log("MatchedUser--------->");
        const matchedUser = await matchFace(imageBuffer);
        console.log("After--------->");
        console.log(matchedUser);
        if (matchedUser) {
            console.log(matchedUser);
            const token = generateToken(matchedUser);
            const user = await Employee.findOne({ email: matchedUser });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            console.log("🟢 User ID:", user._id);
            const currentDate = new Date();
            const day = currentDate.toISOString().split("T")[0];
            const timeIn = currentDate.toLocaleTimeString("en-GB", { hour12: false });
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
module.exports = router;    */