const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendances');

/* function convertTo24Hour(time12h) {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function calculateDuration(timeIn, timeOut) {
    const timeInDate = new Date(`2000-01-01T${convertTo24Hour(timeIn)}`);
    const timeOutDate = new Date(`2000-01-01T${convertTo24Hour(timeOut)}`);

    const timeDiff = timeOutDate - timeInDate;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
} */
/* router.get('get-attendances', async (req, res) => {
    try {
        let existingAttendance = await Attendance.findOne()
    }
}) */
const convertTimeFormat = (time, format12Hour = false) => {
    const [hours, minutes] = time.split(":").map(Number);

    if (format12Hour) {
        // Convert to 12-hour format
        const period = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12
        return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } else {
        // Keep it in 24-hour format
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
};

const calculateWorkingHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) return "0h 0m"; // Handle missing values

    // Convert time strings to Date objects with 24-hour format
    const [inHours, inMinutes, inSeconds] = timeIn.split(":").map(Number);
    const [outHours, outMinutes, outSeconds] = timeOut.split(":").map(Number);

    let start = new Date(1970, 0, 1, inHours, inMinutes, inSeconds);
    let end = new Date(1970, 0, 1, outHours, outMinutes, outSeconds);

    // Handle overnight scenario (if timeOut is earlier than timeIn)
    if (end < start) {
        end.setDate(end.getDate() + 1);
    }

    // Calculate the difference in milliseconds
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};

// 🛠 Logout Route - Updates Attendance with Correct Time Format
router.post("/logout/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the current date and time in 24-hour format
        const now = new Date();
        const day = now.toISOString().split("T")[0]; // YYYY-MM-DD format
        const timeOut = now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        // Find today's attendance record (Include 'day' in the query)
        const attendance = await Attendance.findOne({ employee: userId, day, timeOut: null });

        if (attendance) {
            console.log("Updating attendance record...");

            // Calculate working hours
            const workingHours = calculateWorkingHours(attendance.timeIn, timeOut);

            // Update timeOut and workingHours
            attendance.timeOut = timeOut;
            attendance.workingHours = workingHours;
            await attendance.save();

            return res.status(200).json({ message: "Logout successful", workingHours, timeOut });
        } else {
            return res.status(404).json({ message: "No active attendance record found for today." });
        }
    } catch (error) {
        console.error("❌ Logout error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});




router.get("/attendance/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch attendance records for the user
        const attendanceRecords = await Attendance.find({ employee: userId });

        if (!attendanceRecords.length) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        return res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("❌ Error fetching attendance:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/attendance', async (req, res) => {
    try {
        const { employeeId, day, timeIn, timeOut } = req.body;

        let existingAttendance = await Attendance.findOne({ employee: employeeId, day: day });

        if (existingAttendance && timeOut && existingAttendance.timeIn) {

            const { hours, minutes } = calculateDuration(existingAttendance.timeIn, timeOut);
            // Update existing attendance record
            existingAttendance.timeOut = timeOut;
            existingAttendance.workingHours = `${hours} hour:${minutes} minutes`;
            await existingAttendance.save();
            res.status(200).json({ message: 'Time Out Marked Successfully' });
        } else if (timeIn) {
            if (!existingAttendance) {
                const newAttendance = new Attendance({
                    employee: employeeId,
                    day: day,
                    timeIn: timeIn,
                    timeOut: null,
                    workingHours: null,
                });
                await newAttendance.save();
                res.status(201).json({ message: 'Time In Marked Successfully' });
            } else {
                res.status(400).json({ message: 'TimeIn Is Already Exist In Attendance Sheet' });
            }
        } else {
            res.status(400).json({ message: 'TimeIn Is Missing' });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;