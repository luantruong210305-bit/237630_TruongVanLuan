require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra trạng thái hệ thống
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

// Kết nối Routes
app.use('/api/employees', employeeRoutes);

// Kết nối MongoDB và chạy server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Đã kết nối tới MongoDB Atlas thành công!');
    app.listen(PORT, () => {
      console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB: ', err);
  });