import React, { useCallback, useEffect, useState } from 'react';
import { getAllDataEmployee, updateDataEmployee, deleteDataEmployee } from '../services/Api';
import { LuUsers } from "react-icons/lu";
import '../style/MemberStyle.css';

function Member() {
  const [member, setMember] = useState([]);
  const [filteredMember, setFilteredMember] = useState([]);
  const [category, setCategory] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [editingMember, setEditingMember] = useState(null); // untuk menyimpan data yang sedang di edit
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    nomor_wa: '',
    divisi: '',
    shift: '',
    jabatan: ''
  });

  const loadMemberData = useCallback(async () => {
    try {
      const response = await getAllDataEmployee();
      setMember(response.data);
      setFilteredMember(response.data);
    } catch (err) {
      console.error('Failed to load data employee', err);
    }
  }, []);

  useEffect(() => {
    loadMemberData();
  }, [loadMemberData]);

  const handleEditEmployee = (member) => {
    setEditingMember(member);
    setFormData({ ...member });
  };

  const handleUpdateEmployee = async (id) => {
    try {
      await updateDataEmployee(id, formData);
      loadMemberData(); // Reload data setelah update
      setEditingMember(null); // Tutup modal edit
    } catch (error) {
      console.error('Failed to update employee', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data dengan ID ${id}?`)) {
      try {
        await deleteDataEmployee(id);
        loadMemberData(); // Reload data setelah delete
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setFilterValue('');
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filterMember = () => {
    if (category === 'all') {
      setFilteredMember(member);
    } else {
      const filtered = member.filter((m) => m[category]?.toLowerCase() === filterValue.toLocaleLowerCase());
      setFilteredMember(filtered);
    }
  };

  const indexOfLastMember = currentPage * dataPerPage;
  const indexOfFirstMember = indexOfLastMember - dataPerPage;
  const currentMembers = filteredMember.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMember.length / dataPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="member-container">
      <div className='filter-form'>
        <label htmlFor="category" style={{ fontSize: 'bold' }}>Filter by:</label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="all">All</option>
          <option value="divisi">Divisi</option>
          <option value="shift">Shift</option>
          <option value="jabatan">Jabatan</option>
        </select>
      </div>

      <div className='tabel-data'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Nomor Telpn</th>
              <th>Divisi</th>
              <th>Shift</th>
              <th>Jabatan</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((m, index) => (
              <tr key={index}>
                <td>{m.name}</td>
                <td>{m.username}</td>
                <td>{m.email}</td>
                <td>{m.nomor_wa}</td>
                <td>{m.divisi}</td>
                <td>{m.shift}</td>
                <td>{m.jabatan}</td>
                <td>
                  <button onClick={() => handleEditEmployee(m)}>Edit</button> |
                  <button onClick={() => handleDeleteEmployee(m.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {editingMember && (
        <div className="modal">
          <h2>Edit Employee</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="nomor_wa"
            value={formData.nomor_wa}
            onChange={handleInputChange}
            placeholder="Nomor WA"
          />
          <input
            type="text"
            name="divisi"
            value={formData.divisi}
            onChange={handleInputChange}
            placeholder="Divisi"
          />
          <input
            type="text"
            name="shift"
            value={formData.shift}
            onChange={handleInputChange}
            placeholder="Shift"
          />
          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleInputChange}
            placeholder="Jabatan"
          />
          <button onClick={() => handleUpdateEmployee(editingMember.id)}>Update</button>
          <button onClick={() => setEditingMember(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Member;

/*
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.modal input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}

.modal button {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
}

*/