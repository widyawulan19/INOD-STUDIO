import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/MarketingStyle.css'
import { getAllDataMarketing ,createDataMarketing,deleteDataMarketing, archiveMarketing} from '../services/Api';
import moment from 'moment';
import { CiEdit } from 'react-icons/ci';
import { IoSearch, IoArchiveOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import MarketingForm from './MarketingForm';

const Marketing = ({marketing_id}) => {
  const currentDate = new Date();
  const [marketingData, setMarketingData] = useState([]);
  const [category, setCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [filteredMember, setFilteredMember] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [createFormVisible, setCreateFormVisible] = useState(false);
  //delete
  const [marketingDelete, setMarketingDelete] = useState(null);
  //archive
  const [marketingArchive, setMarketingArchive] = useState(false);
  const [selectedMarketingId, setSelectedMarketingId] = useState(null);

  const handleConfirmArchive = async () => {
    if (!selectedMarketingId) {
      console.warn("Tidak ada marketing_id yang dipilih untuk diarsipkan.");
      return;
    }
    try {
      await archiveMarketing(selectedMarketingId);
      console.log("Data marketing berhasil diarsipkan.");
      fetchDataMarketing(); // Refresh data
      setMarketingArchive(false); // Tutup modal
      setSelectedMarketingId(null); // Reset state
    } catch (error) {
      console.error("Failed to archive marketing data:", error);
    }
  };

  const handleArchive = (marketing_id) => {
    if (!marketingData.some((item) => item.marketing_id === marketing_id)) {
      console.warn("Marketing ID tidak ditemukan dalam data.");
      return;
    }
    console.log('Marketing id yang diarsipkan:', marketing_id);
    setSelectedMarketingId(marketing_id);
    setMarketingArchive(true);
  };

  const handleCancelArchive = () => {
    setMarketingArchive(false);
    setSelectedMarketingId(null);
  }
  useEffect(()=>{
    fetchDataMarketing();
  },[]);

  // Get current date and month
  const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = daysOfWeek[currentDate.getDay()];
  const monthOfYears = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthName = monthOfYears[currentDate.getMonth()];
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Fetch marketing data
  const fetchDataMarketing = useCallback(async () => {
    try {
      const response = await getAllDataMarketing();
      console.log('Received marketing data', response.data);
      setMarketingData(response.data);
      setFilteredMember(response.data);
    } catch (error) {
      console.error('Error fetching marketing data', error);
    }
  }, []);

  useEffect(() => {
    fetchDataMarketing();
  }, [fetchDataMarketing]);

  // Handle category change
  const handleCategoryChange = (value) => {
    setCategory(value);
    setIsOpen(false);
    setFilterValue('');
  }

  // Handle filter input change
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  }

  // Filter data based on category and filter value
  const filterMember = () => {
    if (category === 'all') {
      setFilteredMember(marketingData);
    } else {
      const filtered = marketingData.filter((m) =>
        m[category]?.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredMember(filtered);
    }
  };

  // Trigger filter function when category or filter value changes
  useEffect(() => {
    filterMember();
  }, [category, filterValue]);

  // Prevent propagation of click event to avoid dropdown closing on click inside
  const handlePropagation = (e) => {
    e.stopPropagation();
  }

  //delete
  const handleDeleteClick = (marketing_id)=>{
    setMarketingDelete(marketing_id);
  }

  const handleConfirmDelete = async()=>{
    if(marketingDelete){
      try{
        await deleteDataMarketing(marketingDelete);
        setMarketingDelete(null);
        fetchDataMarketing();
        alert('Data berhasil dihapus.');
      }catch(error){
        console.error('Error deleting marketing data:', error);
        alert('Gagal mengapus data. silahkan coba lagi.')
      }
    }
  }

  const handleCancleDelete = () => {
    setMarketingDelete(null);
  }
  //end delete


  const handleFormMarketing = () =>{
    navigate('/marketingForm');
  }
  const handleToMarketingPopup = (marketing_id) => {
    navigate(`/popup-detail-marketing/${marketing_id}`);
  }

  const handleCancleCreateForm = () => {
    setCreateFormVisible(false);
  }

  return (
    <div>
      <div className="container-marketing">
        <div className="filter-form">
          <h3>DATA MARKETING</h3>
        </div>
        <div className="dropdown-create"> 
          <div className="date">
            <h4 style={{ margin: 0 }}>{monthName}</h4>
            <p style={{ margin: '0', fontSize: '13px' }}>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
          </div>
          <div className='search'>
            <label htmlFor="category" className='filter-label'>Search by:</label>
            <div className="filter-dropdown" onClick={() => setIsOpen(!isOpen)}>
              <button className='dropdown-search'>
                {category === 'all' ? 'All Data' : category}
              </button>
              {isOpen && (
                <ul className='filter-dropdown-menu'>
                  <li onClick={() => handleCategoryChange('all')} className="dropdown-item">All</li>
                  <li onClick={() => handleCategoryChange('code_order')} className='dropdown-item'>Code Order</li>
                  <li onClick={() => handleCategoryChange('nomer_active_order')} className='dropdown-item'>Active Order</li>
                  <li onClick={() => handleCategoryChange('input_by')} className='dropdown-item'>Input By</li>
                  <li onClick={() => handleCategoryChange('buyer_name')} className='dropdown-item'>Buyer Name</li>
                </ul>
              )}
              {category !== 'all' && (
                <input
                  type="text"
                  placeholder={`Enter ${category}`}
                  value={filterValue}
                  onChange={handleFilterChange}
                  className='custom-input'
                  onClick={handlePropagation}
                />
              )}
              <div onClick={handlePropagation}>
                <button
                  onClick={filterMember}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'fit-content',
                    marginRight: '0',
                    marginLeft: '5px',
                    color: '#491519',
                    backgroundColor: 'white'
                  }}
                >
                  <IoSearch size={15} />
                </button>
              </div>
            </div>

              {/* <div className='createData'>
                  <button onClick={handleFormMarketing}>
                      CREATE DATA MARKETING
                  </button>
              </div> */}
              <div className='createData'>
                  <button onClick={()=> setCreateFormVisible(!createFormVisible)}>
                      CREATE DATA MARKETING
                  </button>
                  {createFormVisible && (
                    <div>
                      <MarketingForm  handleCancle={handleCancleCreateForm}/>
                    </div>
                  )}
              </div>
          </div>
        </div>
        <div className="tabel-container">
          {marketingDelete && (
              <div className="delete-confirmation-modal">
                <p>Apakah Anda yakin ingin menghapus data ini?</p>
                <div className="modal-cations">
                  <button onClick={handleConfirmDelete} className='confirmDelete' >Ya, Hapus</button>
                  <button onClick={handleCancleDelete} className='cancleDelete'>Batal</button>
                </div>
              </div>
            )}
          {marketingArchive && (
            <div className="delete-confirmation-modal">
              <p>Apakah Anda yakin ingin mengarsipkan data ini?</p>
              <div className="modal-cations">
                <button onClick={handleConfirmArchive} className='confirmDelete' >Ya, Archive</button>
                <button onClick={handleCancelArchive} className='cancleDelete'>Batal</button>
              </div>
            </div>
          )}
        <div className="tabel-data-marketing">
          {filteredMember.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>No.</th>
                  <th>Input By</th>
                  <th>Acc by</th>
                  <th>Buyer Name</th>
                  <th>Code Order</th>
                  <th>Jumlah <br />Track</th>
                  <th>Order <br /> Number</th>
                  <th>Account</th>
                  <th>Deadline</th>
                  <th>Jumlah <br /> Revisi</th>
                  <th>Order Type</th>
                  <th>Offer Type</th>
                  <th>Jenis Track</th>
                  <th>Genre</th>
                  <th>Price Normal</th>
                  <th>Price Discount</th>
                  <th>Discount</th>
                  <th>Basic Price</th>
                  <th>GIG Link</th>
                  <th>Required Files</th>
                  <th>Project Type</th>
                  {/* <th>Duration</th> */}
                  {/* <th>Reference</th> */}
                  {/* <th>File & Chat</th> */}
                  {/* <th>Detail Project</th> */}
                  <th style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMember.map((item) => (
                  <tr key={item.marketing_id}>
                    <td style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}}>{filteredMember.indexOf(item)+1}</td>
                    <td>{item.input_by}</td>
                    <td>{item.acc_by}</td>
                    <td>{item.buyer_name}</td>
                    <td>{item.code_order}</td>
                    <td>{item.jumlah_track}</td>
                    <td>
                      <div style={{
                        border: '1px solid #6b1c14',
                        borderRadius: '8px',
                        color: '#6b1c14',
                        fontWeight: 'bolder',
                        padding: '5px',
                        backgroundColor: '#ecd1cd',
                        width: 'fit-content'
                      }}>
                        {item.order_number}
                      </div>
                    </td>
                    <td>{item.account}</td>
                    <td>{item.deadline ? moment(item.deadline).format('D MMMM YYYY') : 'N/A'}</td>
                    <td style={{textAlign:'center'}}>{item.jumlah_revisi}</td>
                    <td>{item.order_type}</td>
                    <td>{item.offer_type}</td>
                    <td>{item.jenis_track}</td>
                    <td>{item.genre}</td>
                    <td>{item.price_normal}</td>
                    <td>{item.price_discount}</td>
                    <td>{item.discount}</td>
                    <td>{item.basic_price}</td>
                    <td>{item.gig_link}</td>
                    <td>{item.required_files}</td>
                    <td>{item.project_type}</td>
                    {/* <td>{item.duration}</td> */}
                    {/* <td>{item.reference_link}</td> */}
                    {/* <td>{item.file_and_chat_link}</td> */}
                    {/* <td>{item.detail_project}</td> */}
                    <td style={{ textAlign: 'center' ,borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>
                      {/* <button className='btn-action'><CiEdit size={15} /> </button> */}
                      <button className='btn-action' style={{width:'fit-content', color:'white', fontWeight:'bolder', backgroundColor:'#491519'}} onClick={()=> handleToMarketingPopup(item.marketing_id)}>View </button>
                      <button className='btn-action' onClick={()=> handleArchive(item.marketing_id)}><IoArchiveOutline size={15} /> </button>
                      <button className='btn-action' onClick={()=> handleDeleteClick(item.marketing_id)}><AiOutlineDelete size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data found</p>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Marketing;
