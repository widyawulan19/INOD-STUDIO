import React, { useCallback, useEffect, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import { getAllDataEmployee, updateDataEmployee, deleteDataEmployee, createDataEmployee} from '../services/Api';
import '../style/MemberStyle.css'
import { HiOutlineX, HiPlus } from 'react-icons/hi';
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete,AiOutlineUserAdd, AiOutlineClose } from 'react-icons/ai';
import { GrSchedules } from "react-icons/gr";
import { Link } from 'react-router-dom';

function Member() {
  const [member, setMember] = useState([]);
  const [filteredMember, setFilteredMember] = useState([]);
  //caterory
  const [category, setCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
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
  //create member
  const [showForm, setShowForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name:'',
    username:'',
    email:'',
    nomor_wa:'',
    divisi:'',
    shift:'',
    jabatan:''
  })

  //show form for create new member
  const toggleFormCreateMemberVisibility = () => {
    setShowForm(!showForm)
  }

  const handleAddNewMember = async () =>{
    if(!newMember.name || !newMember.username || !newMember.email){
      alert('Please fill out all required fields');
      return;
    }
    try{
      await createDataEmployee(newMember);
      loadMemberData();
      setShowForm(false);
    }catch(error){
      console.error('Failed to add new member', error)
    }
  }

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

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
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

  //close form create data member
  const closeForm = () => {
    setShowForm(!showForm);
  }

  //menentukan data yang ditampilkan untuk halaman saat ini
  const indexOfLastMember = currentPage * dataPerPage;
  const indexOfFirstMember = indexOfLastMember - dataPerPage;
  const currentMembers = member.slice(indexOfFirstMember, indexOfLastMember);
  //hitung jumlah halaman total
  const totalPages = Math.ceil(member.length / dataPerPage);
 


  //date
    //mendapatkan nama, hari, tanggal saat ini
    const daysOfWeek = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const dayName = daysOfWeek[currentDate.getDay()];

    //mendaptkan bulan dalam satu tahun 
    const monthOfYears = ['Januari', 'Februari', 'Maret','April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthOfYears[currentDate.getMonth()];

    //mendapatkan tanggal, bulan, tahun
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    //pagination
    const handlePagination = (e) => {
      e.stopPropagation();
    }
  

  return(
    <div className='member-container'>
      <div className="member-header">
        {/* date  */}
        <div className="member-date">
            <h4>{monthName}</h4>
            <p>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
        </div>

        {/* filter  */}
        <div className="member-filter-container">
          <h4>Filter by :</h4>
          <div className="filter-dropdown" onClick={() => setIsOpen(!isOpen)}>
            <button className='btn-category'>
              {category === 'All' ? 'All Data' : category}
            </button>
            {isOpen && (
              <ul className='filter-dropdown-menu-container'>
                <li onClick={()=> handleCategoryChange('all')} className='dropdown-item'>All</li>
                <li onClick={()=> handleCategoryChange('divisi')} className='dropdown-item'>Divisi</li>
                <li onClick={()=> handleCategoryChange('shift')} className='dropdown-item'>Shift</li>
                <li onClick={()=> handleCategoryChange('jabatan')} className='dropdown-item'>Jabatan</li>
              </ul>
            )}
            {category !== 'all' && (
              <input 
                type="text" 
                placeholder={`Enter ${category}`}
                value={filterValue}
                onChange={handleFilterChange}
                className='custom-input'
                onClick={handlePagination}
              />
            )}
          </div>
              {/* Button filter  */}
          <button 
            onClick={filterMember}
            className='btn-filter'
          >
            <FaFilter style={{marginRight:'0.5vw'}}/>Filter
          </button>
          {/* End button filter  */}

          {/* create member form  */}
          <div className="create-new-member">
            <div style={{marginRight:'0.5vw'}}>
              <button className='add-member'><GrSchedules style={{marginRight:'10px'}}/><Link to='/schedule'>View Jadwal</Link></button>
            </div>
            <div>
              <button className='add-member' onClick={toggleFormCreateMemberVisibility}>
                  {showForm ?
                  (<><HiPlus style={{marginRight:'0.5vw'}}/> Add member</>):(<><HiPlus style={{marginRight:'0.5vw'}}/> Add member</>)
                }
              </button>
            </div>
          </div>
          {/* end create member form  */}
        </div>
      </div>
      
      {/* FORM ADD NEW MEMBER  */}
        {showForm && (
          <div className='modal'>
            <div className="modal-header">
              <AiOutlineUserAdd className='header-ikon'/>
              <h2>Add New Member</h2>
              <AiOutlineClose onClick={closeForm} className='header-ikon' />
            </div>
            <div className="personal">
              <h5>Informasi Personal</h5>
              <div className='body'>
                <input 
                  type="text"
                  name='name'
                  value={newMember.name}
                  onChange={(e)=>setNewMember({...newMember, name:e.target.value})}
                  placeholder='name'
                />
                <input 
                  type="text"
                  name='username'
                  value={newMember.username}
                  onChange={(e)=>setNewMember({...newMember, username:e.target.value})}
                  placeholder='Username'
                />
              </div>
            </div>
            <div className="kontak">
              <h5>Informasi Kontak</h5>
              <div className="body">
                <input 
                  type="text"
                  name='Email'
                  value={newMember.email}
                  onChange={(e)=>setNewMember({...newMember, email:e.target.value})}
                  placeholder='email'
                />
                <input 
                  type="text"
                  name='Nomor'
                  value={newMember.nomor_wa}
                  onChange={(e)=>setNewMember({...newMember, nomor_wa:e.target.value})}
                  placeholder='nomor'
                />
              </div>
            </div>
            <div className="kepegawaian">
              <h5>Informasi Kepegawaian</h5>
              <div className="body">
                <input 
                  type="text"
                  name='Divisi'
                  value={newMember.divisi}
                  onChange={(e)=>setNewMember({...newMember, divisi:e.target.value})}
                  placeholder='Divisi'
                />
                <input 
                  type="text"
                  name='Shift'
                  value={newMember.shift}
                  onChange={(e)=>setNewMember({...newMember, shift:e.target.value})}
                  placeholder='Shift'
                />
                <input 
                  type="text"
                  name='Jabatan'
                  value={newMember.jabatan}
                  onChange={(e)=>setNewMember({...newMember, jabatan:e.target.value})}
                  placeholder='Jabatan'
                />
              </div>
            </div>
              
            <div className="button-add-member">
              <button onClick={handleAddNewMember}>Add Member</button>
              <button className='cancle-btn'onClick={closeForm}>Cancle</button>
            </div>
          </div>
        )}
      {/* FORM ADD NEW MEMBER  */}
      
      {/* Data member  */}
      <div className="tabel-data-container">
        <div className='tabel-data'>
          <table>
            <thead>
              <tr>
                <th style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}}>Name</th>
                <th>nickname</th>
                <th>Email</th>
                <th>Nomor Telpn</th>
                <th>Divisi</th>
                <th>Shift</th>
                <th>Jabatan</th>
                <th style={{borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMember.map((m, index)=>(
                <tr key={index}>
                    <td style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}}>{m.name}</td>
                    <td>{m.username}</td>
                    <td>{m.email}</td>
                    <td>{m.nomor_wa}</td>
                    <td>{m.divisi}</td>
                    <td>{m.shift}</td>
                    <td>{m.jabatan}</td>
                    <td style={{borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>
                      <div className="button">
                        <button className='edit-btn' onClick={() => handleEditEmployee(m)}><CiEdit className='icon-td'/>Edit</button> |
                        <button className='hapus-btn' onClick={() => handleDeleteEmployee(m.id)}><AiOutlineDelete className='icon-td'/>Hapus</button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>   
        </div>
      </div>
      {/* End Data member  */}

      {/* Edit data member  */}
      {editingMember && (
        <div className="modal">
          <div className="modal-header">
              <AiOutlineUserAdd className='header-ikon'/>
              <h2>Edit Data Member</h2>
              <AiOutlineClose onClick={() => setEditingMember(null)} className='header-ikon' />
          </div>
          <div className="personal">
            <h5>Informasi Personal</h5>
            <div className="body">
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
            </div>
            <div className="kontak" style={{width:'100%'}}>
              <h5>Informasi Kontak</h5>
              <div className="body">
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
              </div>
            </div>
            <div className="kepegawaian" style={{width:'100%'}}>
              <h5>Informasi Kepegawaian</h5>
              <div className="body">
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
              </div>
            </div>

            <div className='button-add-member'>
              <button onClick={() => handleUpdateEmployee(editingMember.id)}>Update</button>
              <button className='cancle-btn' onClick={() => setEditingMember(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* end edit data member  */}
      
    </div>
  )
}

export default Member
