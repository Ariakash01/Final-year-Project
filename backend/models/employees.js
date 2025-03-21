const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    employee_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    phone: { type: Number },
    residentialAddress: { type: String },
    cnic: { type: String },
    role: { type: String },
    dateOfBirth: { type: Date },
    startDate: { type: Date },
    status: { type: String },
    gender: { type: String },
    current: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    faceData: {
        type: [Number],  // ✅ Store as an array of 128 numbers
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length === 128,
            message: "Face descriptor must be an array of 128 numbers.",
        },
        required: true,
    },
    officeLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
});

module.exports = mongoose.model("Employee", employeeSchema);
