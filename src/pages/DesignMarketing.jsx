import React, { useCallback, useEffect, useState } from 'react'
import { archiveMarketingDesign, getAllMarketingDesign,deleteMarketingDesign, getMarketingDesignById } from '../services/Api';
import '../style/MarketingDesain.css';
import { IoSearch,IoArchiveOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import { GiStarSkull } from "react-icons/gi";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import MarketingDesignForm from './MarketingDesignForm';

const DesignMarketing=()=> {
    const currentDate = new Date();
    const navigate = useNavigate();

    //get current date and month
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = daysOfWeek[currentDate.getDay()];
    const monthOfYears = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthOfYears[currentDate.getMonth()];
    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

    //show component
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState('all');
    const [filterValue, setFilterValue] = useState('');
    const [filteredMember, setFilteredMember] = useState([]);
    const [marketingDesignData, setMarketingDesignData] = useState([]);
    const [createFormVisible, setCreateFormVisible] = useState(false);

    //delete data marketing
    const [deleteMarketing, setDeleteMarketing] = useState(false);
    //archive
    const [marketingDesignArchive, setMarketingDesignArchive] = useState(false);
    const [selectedMarketingId,setSelectedMarketingId]= useState(null);

    //Card ID
    const [cardId, setCardId] = useState(null);
    //mengambil marketing design id
    const marketingDesignId = marketingDesignData?.marketing_design_id;


    //FUNCTION

    // 1. show category change
    const handleCategoryChange = (value)=>{
        setIsOpen(false);
        setFilterValue('');
        setCategory(value);
    } 

    //2. handle filter input change
    const handleFilterChange = (e) =>{
        setFilterValue(e.target.value);
    }

    const filterMember = () =>{
        if(category === 'all'){
            setFilteredMember(marketingDesignData);
        }else{
            const filtered = marketingDesignData.filter((m)=>
                m[category]?.toLowerCase().includes(filterValue.toLocaleLowerCase())
            );
            setFilteredMember(filtered);
        }
    };
    useEffect(()=>{
        filterMember();
    },[category, filterValue]);

    //3. fungsi stop propagation
    const handlePropagation = (e) =>{
        e.stopPropagation();
    }

    //4. get all marketing design data
    const fetchMarketingDesignData = useCallback(async()=>{
        try{
            const response = await getAllMarketingDesign();
            console.log('Receive marketing design data', response.data);
            setMarketingDesignData(response.data);
            setFilteredMember(response.data);

            // Cek apakah data benar-benar berubah sebelum mengupdate state
        // if (JSON.stringify(marketingDesignData) !== JSON.stringify(response.data)) {
        //     setMarketingDesignData(response.data);
        //     setFilteredMember(response.data);
        // }
        }catch(error){
            console.error('Error fetching data marketing design:', error);
        }
    },[marketingDesignData]);

    useEffect(()=>{
        fetchMarketingDesignData();
        console.log("Marketing Design Data:", marketingDesignData);
    },[])

    //5. cancle create form
    const handleCancleCreateForm = () =>{
        setCreateFormVisible(false);
    }

    //6. delete marketing design data
    const handleDeleteClick = (marketing_design_id) =>{
        console.log('Marketing ID untuk dihapus:', marketing_design_id);
        setDeleteMarketing(marketing_design_id);
    } 

    //7. confirm delete
    const handleConfirmDelete = async()=>{
        if(deleteMarketing){
            try{
                await deleteMarketingDesign(deleteMarketing);
                setDeleteMarketing(null);
                fetchMarketingDesignData();
                alert('Data Marketing Design berhasil dihapus.');
            }catch(error){
                console.error('Error deleting data marketing design:', error);
                alert('Gagal menghapus data. silahkan coba lagi.');
            }
        }
    }

    //8. cancle delete
    const handleCancleDelete = () =>{
        setDeleteMarketing(null);
    }

    //ARCHIVE
    //9. convirm archive
    const handleConfirmArchive = async () =>{
        if(!selectedMarketingId){
            console.warn('Tidak ada marketing id yang dipilih untuk diarsipkan');
            return;
        }
        try{
            await archiveMarketingDesign(selectedMarketingId);
            console.log("Data marketing design berhasil diarsipkan");
            fetchMarketingDesignData(false);
            setSelectedMarketingId(null);
        }catch(error){
            console.error('Failed to archive marketing data:', error);
        }
    }

    const handleArchive = (marketing_design_id) =>{
        if(!marketingDesignData.some((item)=> item.marketing_design_id === marketing_design_id)){
            console.warn('Marketing ID tidak ditemukan dalam data');
            return;
        }
        console.log('Marketing id yang diarsipkan:', marketing_design_id);
        setSelectedMarketingId(marketing_design_id);
        setMarketingDesignArchive(true);
    }

    const handleCancelArchive = () =>{
        setMarketingDesignArchive(false);
        setSelectedMarketingId(null);
    }
    //End archive

    const handleToMarketingPopup = (marketing_design_id) => {
        console.log("Navigating to ID:", marketing_design_id); // Debugging
        navigate(`/popup-detail-marketing-design/${marketing_design_id}`);
      };



    //End FUNCTION
  return (
    <div className='nmc'>
        <div className="marketing-header">
            <div className="title">
                <h4>DATA MARKETING DESIGN</h4>
                <div className="date">
                    <p>Hari ini adalah hari {dayName}, {date} {monthName} {year}</p>
                </div>
            </div>
            <div className="filter-container">
                <div className="filter-box">
                    <p>Search by:</p>
                    <div className="filter-category" onClick={()=> setIsOpen(!isOpen)}>
                        <button className='dropdown-search'>
                            {category === 'all'?'All': category}
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
                            onClick={filteredMember}
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
                            <IoSearch size={15}/>
                        </button>
                        </div>
                    </div>
                    <div className="createData">
                        <button onClick={()=> setCreateFormVisible(!createFormVisible)}>
                            NEW DATA
                        </button>
                        {createFormVisible && (
                            <div>
                                <MarketingDesignForm existingData={marketingDesignData} handleCancle={handleCancleCreateForm}/>
                                {/* create marketing form for new data marketing design  */}
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
        <div className="marketing-body">
            {deleteMarketing && (
                <div className='delete-confirmation-modal'>
                    <p>Apakah anda yakin ingin menghapus data ini?</p>
                    <div className="modal-cations">
                        <button onClick={handleConfirmDelete} className='confirmDelete'>Ya, Hapus</button>
                        <button onClick={handleCancleDelete} className='cancleDelete'>Batal</button>
                    </div>
                </div>
            )}
            {marketingDesignArchive && (
                <div className='delete-confirmation-modal'>
                    <p>Apakah anda yakin ingin mengarsipkan data ini?</p>
                    <div className="modal-cations">
                        <button onClick={handleConfirmArchive} className='confirmDelete'>Ya, Archive</button>
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
                          <th>Buyer Name</th>
                          <th>Code Order</th>
                          <th>Jumlah <br />Design</th>
                          <th style={{fontSize:'12px'}}>Order <br /> Number</th>
                          <th>Account</th>
                          <th>Deadline</th>
                          <th>Jumlah <br /> Revisi</th>
                          <th>Order Type</th>
                          <th>Offer Type</th>
                          <th>Style</th>
                          <th>Resolution</th>
                          <th >Price Normal</th>
                          <th >Price Discount</th>
                          <th style={{textAlign:'center'}}>Discount <br />Percentage</th>
                          <th>Required Files</th>
                          <th>Project Type</th>
                          <th style={{ borderTopRightRadius: '2px', borderBottomRightRadius: '2px', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMember.map((item) => (
                          <tr key={item.marketing_design_id} >
                            <td style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px', textAlign:'center'}}>{filteredMember.indexOf(item)+1}</td>
                            {/* <td>{item.input_by}<GiStarSkull style={{color:'red'}}/></td> */}
                            <td>
                                <div style={{padding:'3px', fontSize:'12px', fontWeight:'bold'}}>
                                    {item.card_id ? (
                                        <div>
                                            {item.input_by}
                                            <GiStarSkull style={{color:'red'}} size={15}/>
                                        </div>
                                    ):(
                                        <>
                                            {item.input_by}
                                            {/* <GiStarSkull size={10}/> */}
                                        </>
                                    )}
                                </div>
                                
                            </td>
                            <td>{item.buyer_name}</td>
                            <td>{item.code_order}</td>
                            <td style={{ textAlign: 'center'}}>{item.jumlah_design}</td>
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
                            <td>{item.style}</td>
                            <td>{item.resolution}</td>
                            <td style={{textAlign:'center'}} >{item.price_normal}</td>
                            <td style={{textAlign:'center'}} >{item.price_discount}</td>
                            <td style={{textAlign:'center'}} >{item.discount_percentage}</td>
                            <td>{item.required_files}</td>
                            <td>{item.project_type}</td>
                            <td style={{ textAlign: 'center' ,borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>
                              {/* <button className='btn-action'><CiEdit size={15} /> </button> */}
                              {/* <button className='btn-action' style={{width:'fit-content', color:'white', fontWeight:'bolder', backgroundColor:'#491519'}} onClick={()=> handleToMarketingPopup(item.marketing_id)}>View </button> */}
                              <button className='btn-action' style={{width:'fit-content', color:'white', fontWeight:'bolder', backgroundColor:'#491519'}} onClick={()=> handleToMarketingPopup(item.marketing_design_id)}>View </button>
                              <button className='btn-action' onClick={()=> handleArchive(item.marketing_design_id)}><IoArchiveOutline size={15} /> </button>
                              <button className='btn-action' onClick={()=> handleDeleteClick(item.marketing_design_id)}><AiOutlineDelete size={15} /></button>
                              {/* <div>
                                {item.card_id? (
                                    <a href={`/cards/${item.card_id}`} style={{ color: "blue", textDecoration: "underline" }}>
                                    View Card
                                  </a>
                                ):(
                                    <span style={{ color: "red" }}>Create Card</span>
                                )}
                              </div> */}
                              
                              {/* <button><PopupMarketingDetail marketing_id={marketing_id}/></button> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                ):(
                    <p>no data marketing design found</p>
                )}
            </div>
        </div>
        
    </div>
  )
}

export default DesignMarketing

// 1. buat endpoin untuk data design marketing
// 2. buat api servicenya
// 3. buat endpoin untuk membuat card berdasarkan marketing design (card_id, marketing_design_id)