import React, { useCallback, useEffect, useState } from 'react'
import '../style/NewMarketingStyle.css'
import { archiveMarketing, deleteDataMarketing, getAllDataMarketing } from '../services/Api';
import { IoSearch, IoArchiveOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import MarketingForm from './MarketingForm';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import PopupMarketingDetail from '../popup/PopupMarketingDetail';

const NewMarketing=()=> {
    //navigate 
    const navigate = useNavigate();
    //date
    const currentDate = new Date();

    //show component
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [filteredMember, setFilteredMember] = useState([]);
    const [marketingData, setMarketingData] = useState([]);
    const [createFormVisible, setCreateFormVisible] = useState(false);
    //delete
    const [marketingDelete, setMarketingDelete] = useState(false);
    //archive
    const [marketingArchive, setMarketingArchive] = useState(false);
    const [selectedMarketingId, setSelectedMarketingId] = useState(null);

    //get current date and month
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = daysOfWeek[currentDate.getDay()];
    const monthOfYears = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthOfYears[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    //fetch marketing data
    const fetchDataMarketing = useCallback(async () => {
        try{
            const response = await getAllDataMarketing();
            console.log('Received Marketing data', response.data);
            setMarketingData(response.data);
            setFilteredMember(response.data);
        }catch(error){
            console.error('Error fetching data', error);
        }
    },[]);

    useEffect(()=>{
        fetchDataMarketing();
    }, [fetchDataMarketing]);

    //show category change
    const handleCategoryChange = (value) => {
        setIsOpen(false);
        setFilterValue('');
        setCategory(value);
    }
    //handle filter input change
    const handleFilterChange = (e) =>{
        setFilterValue(e.target.value);
    }

    //handle database on category and filter value
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
    
      useEffect(()=>{
        filterMember();
      },[category, filterValue]);

    const handlePropagation = (e) => {
        e.stopPropagation();
    }

    const handleCancleCreateForm = () => {
        setCreateFormVisible(false);
    }

    //delete data marketing
    const handleDeleteClick = (marketing_id) => {
        console.log("Marketing ID untuk dihapus:", marketing_id);
        setMarketingDelete(marketing_id);
    }

    //confirm delete
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

    //cancle delete
    const handleCancleDelete = () =>{
        setMarketingDelete(null);
    }

    //archive
    //confirm archive
    const handleConfirmArchive = async () =>{
        if(!selectedMarketingId){
            console.warn('Tidak ada marketing id yang dipilih untuk diarsipkan.');
            return;
        }
        try{
            await archiveMarketing(selectedMarketingId);
            console.log("Data marketing berhasil diarsipkan");
            fetchDataMarketing();
            setMarketingArchive(false); // Tutup modal
            setSelectedMarketingId(null); // Reset state
        }catch(error){
            console.error('Failed to archive marketing data:', error);
        }
    }

    const handleArchive = (marketing_id) =>{
        if(!marketingData.some((item)=> item.marketing_id === marketing_id)){
            console.warn("Marketing ID tidak ditemukan dalam data.");
            return;
        }
        console.log('Marketing id yang diarsipakn:', marketing_id);
        setSelectedMarketingId(marketing_id);
        setMarketingArchive(true);
    }

    const handleCancelArchive = () => {
        setMarketingArchive(false);
        setSelectedMarketingId(null);
    }

    useEffect(()=>{
        fetchDataMarketing();
    },[])

    //navigate
    // const handleToMarketingPopup = (marketing_id) => {
    //     navigate(`/popup-detail-marketing/${marketing_id}`);
    //   }
    const handleToMarketingPopup = (marketing_id) => {
      navigate(`/popup-detail-marketing/${marketing_id}`);
    };
    
    
    //end navigate

  return (
    <div className='nmc'>
        <div className="marketing-header">
            <div className="title">
                <h4>DATA MARKETING</h4>
                <div className="date">
                    <p>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
                </div>
            </div>
            <div className="filter-container">
                <div className="filter-box">
                    <p>Search by:</p>
                    <div className="filter-category" onClick={() => setIsOpen(!isOpen)}>
                        <button className='dropdown-search'>
                            {category === 'all' ? 'All': category}
                        </button>
                        {isOpen && (
                            <ul className='filter-dropdown-menu'>
                            <li onClick={() => handleCategoryChange('all')} className="dropdown-item">All</li>
                            <li onClick={() => handleCategoryChange('code_order')} className='dropdown-item'>Code Order</li>
                            {/* <li onClick={() => handleCategoryChange('nomer_active_order')} className='dropdown-item'>Active Order</li> */}
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
                            color: '#491519',
                            backgroundColor: 'white',
                            padding:'2px',
                            border:'0.1px solid white'
                            }}
                        >
                            <IoSearch size={15} />
                        </button>
                        </div>
                    </div>
                    <div className="createData">
                        <button onClick={()=> setCreateFormVisible(!createFormVisible)}>
                            NEW DATA
                        </button>
                        {createFormVisible && (
                        <div>
                            <MarketingForm  handleCancle={handleCancleCreateForm}/>
                        </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
        <div className="marketing-body">
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
                        <th style={{ borderTopLeftRadius: '2px', borderBottomLeftRadius: '2px' }}>No.</th>
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
                        <th style={{ borderTopRightRadius: '2px', borderBottomRightRadius: '2px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMember.map((item) => (
                        <tr key={item.marketing_id}>
                          <td style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px', textAlign:'center'}}>{filteredMember.indexOf(item)+1}</td>
                          <td>{item.input_by}</td>
                          <td>{item.acc_by}</td>
                          <td>{item.buyer_name}</td>
                          <td>{item.code_order}</td>
                          <td style={{textAlign:'center'}}>{item.jumlah_track}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{
                              border: '1px solid rgba(107, 29, 20, 0.4)',
                              borderRadius: '4px',
                              color: '#6b1c14',
                              fontWeight: 'bolder',
                              padding: '5px',
                              backgroundColor: '#e7d9d7f7',
                              width: 'fit-content',
                              display:'flex',
                              alignItems:'center',
                              justifyContent:'center',
                              margin:'0 auto'
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
                            {/* <button className='btn-action' style={{width:'fit-content', color:'white', fontWeight:'bolder', backgroundColor:'#491519'}} onClick={()=> handleToMarketingPopup(item.marketing_id)}>View </button> */}
                            <button className='btn-action' style={{width:'fit-content', color:'white', fontWeight:'bolder', backgroundColor:'#491519'}} onClick={()=> handleToMarketingPopup(item.marketing_id)}>View </button>
                            <button className='btn-action' onClick={()=> handleArchive(item.marketing_id)}><IoArchiveOutline size={15} /> </button>
                            <button className='btn-action' onClick={()=> handleDeleteClick(item.marketing_id)}><AiOutlineDelete size={15} /></button>
                            {/* <button><PopupMarketingDetail marketing_id={marketing_id}/></button> */}
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
  )
}

export default NewMarketing