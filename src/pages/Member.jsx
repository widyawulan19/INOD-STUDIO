import React, { useCallback, useEffect, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { getAllDataEmployee, updateDataEmployee, deleteDataEmployee} from '../services/Api';
import '../style/MemberStyle.css'

function Member() {
  const [member, setMember] = useState([]);
  const [filteredMember, setFilteredMember] = useState([]);
  const [category, setCategory] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const currentDate = new Date();
  //membatasi jumlah tampilan -> 10
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  //action
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name:'',
    userName:'',
    email:'',
    nomor_wa:'',
    shift:'',
    jabatan:''
  });

  const loadMemberData = useCallback(async ()=> {
    try{
      const response = await getAllDataEmployee();
      console.log('Receive data from database:', response.data);
      setMember(response.data)//simpan data yang di terima dari API kedalam state
      setFilteredMember(response.data);// set data yang di filter 
    }catch(err){
      console.error('Failed to load data employee', err)
    }
  }, [])//tambahan array kosong agar hasil render data tidak berubah

  useEffect(()=>{
    loadMemberData()
  }, [loadMemberData])

  const handleEditEmployee = (member) => {
    console.log('tombol edit berhasi diklik')
    setEditingMember(member);
    setFormData({...member});
  }

  const handleUpdateEmployee = async (id) => {
    try{
      await updateDataEmployee(id, formData);
      loadMemberData();
      setEditingMember(null);
    }catch(error){
      console.error('Failed to update employee', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if(window.confirm(`Apakah anda yakin ingin menghapus data dengan ID ${id}?`)){
      try{
        await deleteDataEmployee(id);
        loadMemberData();
      }catch(error){
        console.error('Failed to delete employee data', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData)=> ({...prevData, [name]: value}))
  }

  //fungsi untuk mengubah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setFilterValue('');
    setCurrentPage(1); //mereset halaman ke 1 saat filter berubah
  }

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filterMember = () => {
    setCurrentPage(1);
    if(category === 'all'){
      setFilteredMember(member);
    }else{
      const filtered = member.filter((m)=> m[category]?.toLowerCase() === filterValue.toLocaleLowerCase());
      setFilteredMember(filtered)
    }
  };

  //menentukan data yang ditampilkan untuk halaman saat ini
  const indexOfLastMember = currentPage * dataPerPage;
  const indexOfFirstMember = indexOfLastMember - dataPerPage;
  const currentMembers = member.slice(indexOfFirstMember, indexOfLastMember);
  //hitung jumlah halaman total
  const totalPages = Math.ceil(member.length / dataPerPage);
 


  //date
    //mendapatkan nama, hari, tanggal saat ini
    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const dayName = daysOfWeek[currentDate.getDay()];

    //mendaptkan bulan dalam satu tahun 
    const monthOfYears = ['Januari', 'Februari', 'Maret','April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthOfYears[currentDate.getMonth()];

    //mendapatkan tanggal, bulan, tahun
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
  

  return (
    <div className="member-container">
      <div className='member-navbar'>
          {/* Form for date  */}
        <div className='form-container' style={{marginTop:'0'}}>
            <div className='date'>
                <h4 style={{margin:'0'}}>{monthName}</h4>
                <p style={{margin:'0', fontSize:'13px'}}>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
            </div>
        </div> 
        {/* Filter Form  */}
        <div className='filter-form'>
          <label htmlFor="category" className='filter-label'>Filter by:</label>
          <select 
            id="category" 
            value={category} 
            onChange={handleCategoryChange} 
            className='filter-select'
          >
            <option value="all">All</option>
            <option value="divisi">Divisi</option>
            <option value="shift">Shift</option>
            <option value="jabatan">Jabatan</option>
          </select>

          {/* Input untuk memasukkan nilai filter */}
          {category !== 'all' && (
            <input 
              type="text" 
              placeholder={`Enter ${category}`}
              value={filterValue}
              onChange={handleFilterChange}
              className='custom-input'
            />
          )}
          <button 
            onClick={filterMember}
            style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'center'
            }}
          ><FaFilter style={{marginRight:'0.5vw'}}/>Filter</button>
        </div>
      </div>
      
      {/* TABEL FORM  */}
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
            {filteredMember.map((m, index)=>(
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

        {/* Pagination Control  */}
        <div className="pagination">
          {Array.from({length: totalPages}, (_, index)=>(
            <button
              key={index + 1}
              onClick={()=> handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {editingMember && (
        <div className="modal">
          <h2>Edit Data Employee</h2>
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
          <div className='btn-member'>
            <button onClick={() => handleUpdateEmployee(editingMember.id)}>Update</button>
            <button onClick={() => setEditingMember(null)}>Cancel</button>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default Member
