import React, { useState, useEffect } from 'react'
import { FaFilter } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi'
import { CiEdit } from 'react-icons/ci'
import { AiOutlineDelete,AiOutlineUserAdd, AiOutlineClose } from 'react-icons/ai'
import { GrSchedules } from "react-icons/gr";
import { IoCheckbox } from 'react-icons/io5';
import { RiCheckboxBlankLine } from 'react-icons/ri';
import { getAllEmployeeData } from '../services/Api'


const DataUser=()=> {
    const currentDate = new Date();
    const[dataEmployee, setDataEmployee] = useState([]);
    const [filteredMember, setFilteredMember] = useState([]);

    //FUNCTION
    //1. LOAD DATA EMPLOYEE
    useEffect(()=>{
        const fetchEmployeeData = async () =>{
            try{
                const response = await getAllEmployeeData();
                setDataEmployee(response.data);
                setFilteredMember(response.data);
            }catch(error){
                console.error('Failed to load data employee', error);
            }
        }
        fetchEmployeeData();
    },[]);

    //day function
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
    //END FUNCTION

  return (
    <div>
        <div className="member-header">
            {/* date  */}
            <div className="member-date">
                <h4></h4>
            </div>
        </div>
        <div className="tabel-data-container">
            <div className="tabel-data">
                <tabel>
                    <thead>
                        <tr>
                            <th style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}}>Name</th>
                            <th>username</th>
                            <th>Email</th>
                            <th>Nomor Telpn</th>
                            <th>Divisi</th>
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
                                <td>{m.jabatan}</td>
                                <td style={{borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>
                                  <div className="button">
                                    <button className='edit-btn' ><CiEdit className='icon-td'/>Edit</button> |
                                    <button className='hapus-btn' ><AiOutlineDelete className='icon-td'/>Hapus</button>
                                  </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </tabel>
            </div>
        </div>
        
    </div>
  )
}

export default DataUser