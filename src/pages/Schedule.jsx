import React, { useCallback, useEffect, useState } from 'react'
import { getAllDataEmployee } from '../services/Api'
import '../style/ScheduleStyle.css'
import { FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Schedule() {
    const [member, setMember] = useState([]);
    const [category, setCategory] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [filteredMember, setFilteredMember] = useState([]);
    const currentDate = new Date();
    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);


    const loadEmployeeData = useCallback(async ()=>{
        try{
            const response = await getAllDataEmployee();
            console.log('Receive data employe from database:', response.data)
            setMember(response.data)
            setFilteredMember(response.data)
        }catch(error){
            console.error('Failed to load data employee:', error);
        }
    },[])

    useEffect(()=>{
        loadEmployeeData();
    },[loadEmployeeData])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setFilterValue('');
        setCurrentPage(1);
    }
    const handleFilterChange = (e) => {
        setFilterValue(e.target.value)
    }
    const filterMember = () => {
        setCurrentPage(1);
        if(category === 'all'){
          setFilteredMember(member);
        }else{
          const filtered = member.filter((m)=> m[category]?.toLowerCase() === filterValue.toLocaleLowerCase());
          setFilteredMember(filtered)
        }
      };

    //   const indexOfLastMember = currentPage * dataPerPage;
    //   const indexOfFirstMember = indexOfLastMember = dataPerPage;
    //   const currentMembers = member.slice(indexOfFirstMember, indexOfLastMember);
    //   const totalPages = Math.ceil(member.length/dataPerPage);

      //date
    //mendapatkan nama, hari, tanggal saat ini
    const daysOfWeek2 = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const dayName = daysOfWeek2[currentDate.getDay()];

    //mendaptkan bulan dalam satu tahun 
    const monthOfYears = ['Januari', 'Februari', 'Maret','April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthOfYears[currentDate.getMonth()];

    //mendapatkan tanggal, bulan, tahun
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();
  

  return (
    <div style={{backgroundColor:'white'}}>
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
        <div className='schedule-container' style={{backgroundColor:'white', padding:'20px'}}>
            <div className='btn-member'>
                <button><Link to='/member'>View All Member</Link></button>
            </div>
            <div className='schedule-table'>
                {filteredMember.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Divisi</th>
                                <th>Shift</th>
                                {daysOfWeek.map((day) => (
                                    <th key={day}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMember.map((user) => (
                                <tr key={user.id}>
                                    <td style={{textAlign:'left'}}>{user.name}</td>
                                    <td>{user.divisi}</td>
                                    <td>{user.shift}</td>
                                    {daysOfWeek.map((day, index) => {
                                        const isWorkDay = user.work_days.includes(day);
                                        return (
                                            <td 
                                                key={day}
                                                className='attent-status'
                                            >
                                                {isWorkDay ? <><p className='available'>Available</p></> : <><p className='notAvailable'>Not Available</p></>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No employee data available.</p>
                )}
            </div>
        </div>
    </div>
  )
}

export default Schedule
