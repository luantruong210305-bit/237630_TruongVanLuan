const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: String,
  dateOfBirth: String,
  department: String,
  position: String,
  email: { type: String, required: true },
  phone: String,
  hireDate: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);