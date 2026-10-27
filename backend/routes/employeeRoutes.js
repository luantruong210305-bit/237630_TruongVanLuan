const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 1. GET /api/employees (Lấy danh sách & Tìm kiếm)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/employees/:id (Lấy thông tin 1 nhân viên)
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /api/employees (Thêm nhân viên mới)
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    // Kiểm tra dữ liệu bắt buộc
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: "Vui lòng nhập đủ các trường bắt buộc (employeeId, fullName, email)" });
    }
    // Kiểm tra trùng mã nhân viên
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: "Mã nhân viên đã tồn tại" });
    }

    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT /api/employees/:id (Cập nhật nhân viên)
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE /api/employees/:id (Xóa nhân viên)
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.status(200).json({ message: "Xóa nhân viên thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;