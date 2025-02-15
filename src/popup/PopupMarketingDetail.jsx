import React, { useEffect, useState } from 'react';
import { getMarketingDataById, createCardFromMarketing, getAllLists } from '../services/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { BsDatabaseGear } from "react-icons/bs";
import { IoIosCloseCircleOutline, IoIosAdd } from "react-icons/io";
import '../style/PopupMarketingDetail.css';

const PopupMarketingDetail = () => {
  const { marketing_id,workspaceId,boardId } = useParams();
  console.log('workspace id:',workspaceId , 'boardId:', boardId, );
  const [marketing, setMarketing] = useState(null); // Initialize as null instead of array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [listId, setListId] = useState('');
  const [lists,setLists] = useState([]);
  //loading
  const [isCreating, setIsCreating] = useState(false);
  const [isCardCreated, setIsCardCreated] = useState(false)
  const [cardId,setCardId] = useState(null);
  const [openFormCreate, setOpenFormCreate] = useState(false)
  //mencari list berdasarkan keywoard
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //fungsi daftar list filter 
  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //mengambil nama list yang dipilih


  const handleOpenFormCreate = () => {
    setOpenFormCreate(!openFormCreate);
  }


  useEffect(()=>{
    const fetchData = async() => {
        try{
            //mengambil data marketing
            const marketingResponse = await getMarketingDataById(marketing_id);
            // const marketingData = marketingResponse.da
            setMarketing(marketingResponse.data);

            //fungsi untuk cek apakah card sudah ada
            if(marketingResponse.data.cardId){
                setIsCardCreated(true);
                setCardId(marketingResponse.data.cardId);
            }

            //ambil data list
            const listResponse = await getAllLists();
            console.log('Lists:', listResponse.data)//debuging
            setLists(listResponse.data || []);
        }catch(err){
            console.error('Error:', err);
            setError('Failed to fetch data');
        }finally{
            setLoading(false);
        }
    };
    fetchData();
  },[marketing_id]);

  const handleCreateCard = async () => {
    if (!listId || !marketing_id) {
      alert('Please select a list and marketing id!');
      return;
    }
    setIsCreating(true);
    try {
      const response = await createCardFromMarketing(marketing_id, listId);
      alert(`Card created successfully with ID: ${response.cardId}`);
      setIsCardCreated(true);
      setCardId(response.cardId);
      navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${response.cardId}`)
    } catch (error) {
        console.error('Failed to create card:', error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.error || 'Failed to create card'}`);
    } finally {
        setIsCreating(false);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!marketing) {
    return <div>No data found</div>;
  }

  const handleViewCard = () =>{
    if(cardId){
        navigate(`/workpsaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
    }
  }

  const handleCancle = ()=>{
    navigate('/new-marketing')
  }

const handleEdit = () => {
    navigate(`/popup-detail-marketing/${marketing_id}/edit-data-marketing`);
  };

//   const [gigLink, setGigLink] = useState(marketing.gigLink || "");
    //parse link
    const parseLinks = (text) =>{
        if(!text) return "";
    
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    };


  return (
    <div className='detail-popup-overlay'>
        <div className="detail-popup">
            {marketing.length > 0 ?(
                marketing.map((marketing)=>(
                    <div key={marketing.id}>
                        <div className="title">
                            <BsDatabaseGear size={20}/>
                            <h3>Data Marketing for <br />{marketing.buyer_name}|{marketing.code_order}|{marketing.order_number} </h3>
                            <IoIosCloseCircleOutline  onClick={handleCancle} className='ikon-title'/>
                        </div>
                        <div className="mp-form">
                            <form>
                                <div>
                                    <label>Input By:</label>
                                    <input
                                    type="text"
                                    name="input_by"
                                    value={marketing.input_by}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Acc By:</label>
                                    <input
                                    type="text"
                                    name="acc_by"
                                    value={marketing.acc_by}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Buyer Name:</label>
                                    <input
                                    type="text"
                                    name="buyer_name"
                                    value={marketing.buyer_name}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Code Order:</label>
                                    <input
                                    type="text"
                                    name="code_order"
                                    value={marketing.code_order}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Jumlah Track:</label>
                                    <input
                                    type="number"
                                    name="jumlah_track"
                                    value={marketing.jumlah_track}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Order Number:</label>
                                    <input
                                    type="text"
                                    name="order_number"
                                    value={marketing.order_number}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Account:</label>
                                    <input
                                    type="text"
                                    name="account"
                                    value={marketing.account}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Deadline:</label>
                                    <input
                                    type="datetime-local"
                                    name="deadline"
                                    value={marketing.deadline}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Jumlah Revisi:</label>
                                    <input
                                    type="number"
                                    name="jumlah_revisi"
                                    value={marketing.jumlah_revisi}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Order Type:</label>
                                    <input
                                    type="text"
                                    name="order_type"
                                    value={marketing.order_type}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Offer Type:</label>
                                    <input
                                    type="text"
                                    name="offer_type"
                                    value={marketing.offer_type}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Jenis Track:</label>
                                    <input
                                    type="text"
                                    name="jenis_track"
                                    value={marketing.jenis_track}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Genre:</label>
                                    <input
                                    type="text"
                                    name="genre"
                                    value={marketing.genre}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Price Normal:</label>
                                    <input
                                    type="number"
                                    name="price_normal"
                                    value={marketing.price_normal}
                                    // onChange={handleChange}
                                    step="0.01"
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Price Discount:</label>
                                    <input
                                    type="number"
                                    name="price_discount"
                                    value={marketing.price_discount}
                                    // onChange={handleChange}
                                    step="0.01"
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Discount:</label>
                                    <input
                                    type="text"
                                    name="discount"
                                    value={marketing.discount}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Basic Price:</label>
                                    <input
                                    type="number"
                                    name="basic_price"
                                    value={marketing.basic_price}
                                    // onChange={handleChange}
                                    step="0.01"
                                    required
                                    />
                                </div>
                                {/* <div>
                                    <label>Gig Link:</label>
                                    <input
                                    type="url"
                                    name="gig_link"
                                    value={marketing.gig_link}
                                    required
                                    />
                                </div> */}
                                <div>
                                    <label>Gig Link:</label>
                                    <div
                                        className='link'
                                        dangerouslySetInnerHTML={{ __html: parseLinks(marketing.gig_link) }}
                                    />
                                </div>
                                <div>
                                    <label>Required Files:</label>
                                    <input
                                    type="text"
                                    name="required_files"
                                    value={marketing.required_files}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Project Type:</label>
                                    <input
                                    type="text"
                                    name="project_type"
                                    value={marketing.project_type}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Duration:</label>
                                    <input
                                    type="text"
                                    name="duration"
                                    value={marketing.duration}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div>
                                    <label>Reference Link:</label>
                                    <div
                                        className='link'
                                        dangerouslySetInnerHTML={{ __html: parseLinks(marketing.reference_link) }}
                                    />
                                </div>
                                {/* <div>
                                    <label>Reference Link:</label>
                                    <input
                                    type="url"
                                    name="reference_link"
                                    value={marketing.reference_link}
                                    // onChange={handleChange}
                                    required
                                    />
                                </div> */}
                                <div>
                                    <label>File & Chat Link:</label>
                                    <div
                                        className='link'
                                        dangerouslySetInnerHTML={{ __html: parseLinks(marketing.file_and_chat_link) }}
                                    />
                                </div>
                                {/* <div>
                                    <label>File & Chat Link:</label>
                                    <input
                                    type="url"
                                    name="file_and_chat_link"
                                    value={marketing.file_and_chat_link}
                                    // onChange={handleChange}
                                    required
                                    /> 
                                </div> */}
                            </form>

                            <div className='detail-project'>
                                <label>Detail Project:</label>
                                <textarea
                                    name="detail_project"
                                    value={marketing.detail_project}
                                    // onChange={handleChange}
                                    //  dangerouslySetInnerHTML={{ __html: parseLinks(marketing.file_and_chat_link) }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Render form create card  */}
                        {/* <div className="form-create-card">
                            {
                                openFormCreate && (
                                    <div className="create-card-fiture">
                                        <select onChange={(e) => setListId(e.target.value)} value={listId}>
                                            <option value='' disabled>
                                                {lists.length === 0 ? 'Loading lists...':'Select a lists'}
                                            </option>
                                            {lists.map((list)=>(
                                                <option key={list.id} value={list.id}>
                                                    {list.name}
                                                </option>
                                            ))}
                                        </select>
                                        {isCardCreated ? (
                                            <button onClick={handleViewCard}>View Card</button>
                                        ):(
                                            <button onClick={handleCreateCard} disabled={isCreating} >
                                                {isCreating ? 'Creating...' : <> <IoIosAdd/> Create Card</>}
                                            </button>
                                        )}
                                    </div>
                                )
                            }
                        </div> */}
                        <div className="form-create-card">
                            {openFormCreate && (
                                <div className="create-card-fiture">
                                    <input 
                                        type="text" 
                                        placeholder='Search List here...'
                                        value={searchTerm}
                                        onChange={(e)=> setSearchTerm(e.target.value)}
                                        className='search-input'
                                        onClick={()=> setIsDropdownOpen(!isDropdownOpen)}
                                    />
                                    <div className="button">
                                        {isCardCreated ? (
                                          <button onClick={handleViewCard}>View Card</button>
                                        ):(
                                          <button onClick={handleCreateCard} disabled={isCreating}>
                                            {isCreating ? 'Creating' : <><IoIosAdd/> Create Card</>}
                                          </button>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="custom-dropdown">
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                <div 
                                    className="dropdown-item disabled"
                                    onClick={()=> setIsDropdownOpen(false)}
                                >
                                    {lists.length === 0 ? 'Loading lists...':'Select a list'}
                                </div>
                                {filteredLists.map((list)=>(
                                    <div
                                    className='dropdown-item'
                                    key={list.id}
                                    onClick={()=>{
                                        setListId(list.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    >
                                    {list.name}
                                    </div>
                                ))}
                                </div>
                            )}
                            </div>
                        </div>
                        {/* End form creare card  */}
                        <div className='popup-button'>           
                            <button onClick={handleOpenFormCreate}>
                                {openFormCreate ? 'Close':'Create a card'}
                            </button>
                        
                            <button onClick={handleEdit}>Edit Data</button>
                            <button onClick={handleCancle}>Cancle</button>
                        </div>
                        
                    </div>
                 ))
            ):(
                <div>No data found</div>
             )} 
        </div>
    </div>
  );
}

export default PopupMarketingDetail;
