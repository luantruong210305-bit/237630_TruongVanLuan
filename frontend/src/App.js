import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL + '/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Khởi tạo form dữ liệu
  const [formData, setFormData] = useState({
    employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
    department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'
  });

  // Chạy lần đầu tiên khi mở web
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Hàm tải dữ liệu (có hỗ trợ tìm kiếm)
  const fetchEmployees = async (query = '') => {
    try {
      setMessage('Đang tải dữ liệu...');
      const res = await axios.get(`${API_URL}?search=${query}`);
      setEmployees(res.data);
      setMessage('');
    } catch (error) {
      setMessage('Lỗi khi kết nối đến API Backend!');
    }
  };

  // Các hàm xử lý sự kiện
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${editId}`, formData);
        setMessage('Cập nhật thông tin thành công!');
      } else {
        await axios.post(API_URL, formData);
        setMessage('Thêm nhân viên mới thành công!');
      }
      // Reset form
      setFormData({ employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '', department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc' });
      setIsEdit(false);
      setEditId(null);
      fetchEmployees(); // Tải lại danh sách
    } catch (error) {
      setMessage('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (emp) => {
    setIsEdit(true);
    setEditId(emp._id);
    setFormData(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Đã xóa nhân viên thành công!');
        fetchEmployees();
      } catch (error) {
        setMessage('Lỗi khi thực hiện xóa!');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Hệ Thống Quản Lý Nhân Sự</h1>
      
      {/* Hiển thị thông báo */}
      {message && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}

      {/* Form Thêm / Cập nhật */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{isEdit ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</h3>
        <form onSubmit={handleSubmit}>
          <input style={{margin: '5px', padding: '8px'}} type="text" name="employeeId" placeholder="Mã NV (Bắt buộc)" value={formData.employeeId} onChange={handleChange} required disabled={isEdit} />
          <input style={{margin: '5px', padding: '8px'}} type="text" name="fullName" placeholder="Họ Tên (Bắt buộc)" value={formData.fullName} onChange={handleChange} required />
          <input style={{margin: '5px', padding: '8px'}} type="email" name="email" placeholder="Email (Bắt buộc)" value={formData.email} onChange={handleChange} required />
          <input style={{margin: '5px', padding: '8px'}} type="text" name="department" placeholder="Phòng ban" value={formData.department} onChange={handleChange} />
          <input style={{margin: '5px', padding: '8px'}} type="text" name="position" placeholder="Chức vụ" value={formData.position} onChange={handleChange} />
          <input style={{margin: '5px', padding: '8px'}} type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
          <br/>
          <button style={{margin: '10px 5px', padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer'}} type="submit">
            {isEdit ? 'Lưu Cập Nhật' : 'Thêm Nhân Viên'}
          </button>
          {isEdit && (
            <button style={{padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer'}} type="button" onClick={() => { setIsEdit(false); setFormData({employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '', department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'})}}>
              Hủy
            </button>
          )}
        </form>
      </div>

      {/* Form Tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input style={{padding: '10px', width: '300px', marginRight: '10px'}} type="text" placeholder="Tìm theo mã hoặc tên nhân viên..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button style={{padding: '10px 20px', cursor: 'pointer'}} type="submit">Tìm kiếm</button>
        <button style={{padding: '10px 20px', cursor: 'pointer', marginLeft: '5px'}} type="button" onClick={() => { setSearch(''); fetchEmployees(''); }}>Hiển thị tất cả</button>
      </form>

      {/* Bảng danh sách */}
      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#007bff', color: 'white' }}>
          <tr>
            <th>Mã NV</th>
            <th>Họ Tên</th>
            <th>Phòng Ban</th>
            <th>Chức Vụ</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>{emp.email}</td>
              <td>
                <button style={{marginRight: '5px', padding: '5px 10px', cursor: 'pointer'}} onClick={() => handleEdit(emp)}>Sửa</button>
                <button style={{padding: '5px 10px', cursor: 'pointer', color: 'red'}} onClick={() => handleDelete(emp._id)}>Xóa</button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr><td colSpan="6" style={{textAlign: 'center'}}>Không có dữ liệu nhân viên.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;