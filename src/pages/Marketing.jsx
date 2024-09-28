import React, { useCallback, useEffect, useState } from 'react'
import { getAllCardDescriptions, getAllMarketingData } from '../services/Api'
import { FaFilter } from 'react-icons/fa';
import '../style/MarketingStyle.css'
import moment from 'moment';


function Marketing() {
  const [marketingData, setMarketingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [filteredMember, setFilteredMember] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [member, setMember] = useState([]);

  //category, handleCategoryChange, filterValue, handleFilterChange,filterMember
  const fetchingMaketingData = useCallback(async ()=>{
    try{
      const response = await getAllMarketingData();
      console.log('Receive data description from database:', response.data);
      setMarketingData(response.data);
    }catch(err){
      setError('Error fetching marketing data');
      console.error('Failed to load description data:', err)
    }finally{
      setLoading(false);
    }
  })
  
  useEffect(()=>{
    fetchingMaketingData()
  },[])

  if (loading) {
    return <div>Loading...</div>
  }
  if(error){
    return <div>{error}</div>
  }

  //function untuk filter fiture
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setFilterValue('');
  }
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  }

  const filterMember = () => {
    setCurrentPage(1);
    if(category === 'all'){
      setFilteredMember(marketingData);
    }else{
      const filtered = marketingData.filter((m) =>
        m[category]?.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredMember(filtered);
    }
  }

  //kode-order
  //nomer active order
  //input by
  //buyer name

  return (
    <div>
    <div className='container-marketing'>
      <div className='filter-form'>
        <label htmlFor='category' className='filter-label'>Filter by:</label>
        <select 
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className='filter-select'
        >
          <option value="all">All</option>
          <option value="code_order">Code Order</option>
          <option value="nomer_active_order">Active Order</option>
          <option value="input_by">Input By</option>
          <option value="buyer_name">Buyer Name</option>
        </select>

        {/* input untuk memasukkan nilai filter  */}
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
        >
          <FaFilter style={{marginRight:'0.5vw'}}/>Filter
        </button>

      </div>
      <div className='tabel-data-marketing'>
          {filteredMember.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nomer Active Order</th>
                  <th>Input By</th>
                  <th>Buyer Name</th>
                  <th>Code Order</th>
                  <th>Jumlah Track</th>
                  <th>Order Number</th>
                  <th>Account</th>
                  <th>Deadline</th>
                  <th>Jumlah Revisi</th>
                  <th>Order Type</th>
                  <th>Offer Type</th>
                  <th>Jenis Track</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Required File</th>
                  <th>Project Type</th>
                  <th>Duration</th>
                  <th>Reference</th>
                  <th>File and Chat</th>
                  <th>Detail Project</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredMember.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nomer_active_order}</td>
                    <td>{item.input_by}</td>
                    <td>{item.buyer_name}</td>
                    <td>{item.code_order}</td>
                    <td>{item.jumlah_track}</td>
                    <td>{item.order_number}</td>
                    <td>{item.account}</td>
                    <td>{moment(item.deadline).format('D MMMM YYYY')}</td>
                    <td>{item.jumlah_revisi}</td>
                    <td>{item.order_type}</td>
                    <td>{item.offer_type}</td>
                    <td>{item.jenis_track}</td>
                    <td>{item.genre}</td>
                    <td>{item.price}</td>
                    <td>{item.required_file}</td>
                    <td>{item.project_type}</td>
                    <td>{item.duration}</td>
                    <td>{item.reference}</td>
                    <td>{item.file_and_cha}</td>
                    <td>{item.detail_project}</td>
                    <td>{item.progress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Marketing

/*
<table>
          <thead>
            <tr>
              <th>Nomer Active Order</th>
              <th>Input By</th>
              <th>Buyer Name</th>
              <th>Code Order</th>
              <th>Jumlah Track</th>
              <th>Order Number</th>
              <th>Account</th>
              <th>Deadline</th>
              <th>Jumlah Revisi</th>
              <th>Order Type</th>
              <th>Offer Type</th>
              <th>Jenis Track</th>
              <th>Genre</th>
              <th>Price</th>
              <th>Required File</th>
              <th>Project Type</th>
              <th>Duration</th>
              <th>Reference</th>
              <th>File and Chat</th>
              <th>Detail Project</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {marketingData.map((item)=>(
              <tr key={item.id}>
                  <td>{item.nomer_active_order}</td>
                  <td>{item.input_by}</td>
                  <td>{item.buyer_name}</td>
                  <td>{item.code_order}</td>
                  <td>{item.jumlah_track}</td>
                  <td>{item.order_number}</td>
                  <td>{item.account}</td>
                  <td>{moment(item.deadline).format('D MMMM YYYY')}</td>
                  <td>{item.jumlah_revisi}</td>
                  <td>{item.order_type}</td>
                  <td>{item.offer_type}</td>
                  <td>{item.jenis_track}</td>
                  <td>{item.genre}</td>
                  <td>{item.price}</td>
                  <td>{item.required_file}</td>
                  <td>{item.project_type}</td>
                  <td>{item.duration}</td>
                  <td>{item.reference}</td>
                  <td>{item.file_and_cha}</td>
                  <td>{item.detail_project}</td>
                  <td>{item.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>

*/