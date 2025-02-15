import React, { useEffect, useState } from 'react'
import '../style/PopupMarketingDetail.css';
import '../style/PopupMarketing.css';
import { useNavigate, useParams } from 'react-router-dom';
import { createCardFromMarketingDesign, getAllLists, getMarketingDesignById } from '../services/Api';
import { BsDatabaseGear } from 'react-icons/bs';
import { IoIosAdd, IoIosCloseCircleOutline } from 'react-icons/io';

const PopupMarketingDesign=()=> {
    const {marketing_design_id, boardId, workspaceId} = useParams();
    console.log('marketing desain id:',marketing_design_id);
    // console.log('boardId:', boardId)
    const [marketingDesign, setMarketingDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [listId, setListId] = useState('');
    const [lists, setLists] = useState([]);
    //loading
    const [isCreating, setIsCreating] = useState(false);
    const [isCardCreated, setIsCardCreated] = useState(false);
    const [cardId, setCardId] = useState(null);
    const [openFormCreate, setOpenFormCreate] = useState(false);
    //mencari list berdasarkan keyword
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    //fungsi filter daftar list berdasakan inputan pencarian
    const filteredLists = lists.filter(list =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //mengambil nama list yang dipilih
    const selectedListName = lists.find(list => list.id === listId)?.name || "Select a lists";

    const handleOpenFormCreate = () =>{
      setOpenFormCreate(!openFormCreate);
    }

    //1. fungsi memanggil data marketing design
    useEffect(()=>{
      const fetchMarketingDesign = async()=>{
        try{
          const marketingResponse = await getMarketingDesignById(marketing_design_id);
          setMarketingDesign(marketingResponse.data);
          console.log('Marketing design data:', marketingResponse.data);

          setCardId(marketingResponse.data.card_id)

          //fungsi untuk mengecek apakah card sudah ada
          if(marketingResponse.data.cardId){
            setIsCardCreated(true);
            setCardId(marketingResponse.data.cardId);
          }

          //mengambil data list
          const listResponse = await getAllLists();
          console.log('Lists :', listResponse.data);
          setLists(listResponse.data || []);
        }catch(error){
          console.error('Error fetch lists data');
        }finally{
          setLoading(false);
        }
      };
      fetchMarketingDesign();
    }, [marketing_design_id]);

    //2. fungsi membuat create card
    const handleCreateCard = async()=>{
      if(!listId || !marketing_design_id){
        alert('Please select list and marketing design');
        return;
      }
      setIsCreating(true);
      try{
        const response = await createCardFromMarketingDesign(marketing_design_id,listId);
        alert(`Card created successfully with ID ${response.data.cardId}`);
        setIsCardCreated(true);
        setCardId(response.data.cardId);
        navigate(`/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${response.cardId}`)
      }catch(error){
        console.error('Failed to create card:', error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.error || 'Failed to create card'}`);
      }finally{
        setIsCreating(false);
      }
    };

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    if (!marketingDesign) {
      return <div>No data found</div>;
    }

    const handleViewCard = () =>{
      if(cardId){
          navigate(`/workpsaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
      }
    }
  
    const handleCancle = ()=>{
      navigate('/marketing-design');
    }
  
    const handleEdit = () => {
        navigate(`/popup-detail-marketing-design/${marketing_design_id}/edit-data-design`);
      };

      //mengambil 5 karakter terakhir dari code order
     const codeOrder = marketingDesign.code_order;
     const lastFiveChars = codeOrder.slice(-5);

     //fungsi untuk memproses
    const renderDetailProject = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.split(urlRegex).map((part, index) =>
        urlRegex.test(part) ? (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ) : (
          part
        )
      );
    };

  return (
    <div className="detail-popup-overlay">
      <div className="detail-popup">
        {marketingDesign?(
         
            <div key={marketingDesign.marketing_design_id}>
              
              <div className="title">
                {cardId ? (
                  <BsDatabaseGear scale={20} style={{color:'red'}}/> 
                ):<BsDatabaseGear scale={20}/> }
                <h3>Data Marketing Design for <br />New Project | {marketingDesign.style} | {marketingDesign.buyer_name} | {marketingDesign.account} | {lastFiveChars}</h3>
                <IoIosCloseCircleOutline onClick={handleCancle} className='ikon-title'/>
              </div>
              <div className="mp-form">
                <form>
                    <div>
                        <label>Input By:</label>
                        <input type="text" name="input_by" value={marketingDesign.input_by} required />
                    </div>

                    <div>
                        <label>Buyer Name:</label>
                        <input type="text" name="buyer_name" value={marketingDesign.buyer_name} required />
                    </div>

                    <div>
                        <label>Code Order:</label>
                        <input type="text" name="code_order" value={marketingDesign.code_order}  required />
                    </div>

                    <div>
                        <label>Jumlah Design:</label>
                        <input type="number" name="jumlah_design" value={marketingDesign.jumlah_design}  required />
                    </div>

                    <div>
                        <label>Order Number:</label>
                        <input type="text" name="order_number" value={marketingDesign.order_number} required />
                    </div>

                    <div>
                        <label>Account:</label>
                        <input type="text" name="account" value={marketingDesign.account}  required />
                    </div>

                    <div>
                        <label>Deadline:</label>
                        <input type="datetime-local" name="deadline" value={marketingDesign.deadline}  required />
                    </div>

                    <div>
                        <label>Jumlah Revisi:</label>
                        <input type="number" name="jumlah_revisi" value={marketingDesign.jumlah_revisi}  required />
                    </div>

                    <div>
                        <label>Order Type:</label>
                        <input type="text" name="order_type" value={marketingDesign.order_type}  required />
                    </div>

                    <div>
                        <label>Offer Type:</label>
                        <input type="text" name="offer_type" value={marketingDesign.offer_type}  required />
                    </div>

                    <div>
                        <label>Style:</label>
                        <input type="text" name="style" value={marketingDesign.style}required />
                    </div>

                    <div>
                        <label>Resolution:</label>
                        <input type="text" name="resolution" value={marketingDesign.resolution}  required />
                    </div>

                    <div>
                        <label>Price Normal:</label>
                        <input type="number" step="0.01" name="price_normal" value={marketingDesign.price_normal}  required />
                    </div>

                    <div>
                        <label>Price Discount:</label>
                        <input type="number" step="0.01" name="price_discount" value={marketingDesign.price_discount}  required />
                    </div>

                    <div>
                        <label>Discount Percentage:</label>
                        <input type="number" step="0.01" name="discount_percentage" value={marketingDesign.discount_percentage}  required />
                    </div>

                    <div>
                        <label>Required Files:</label>
                        <input type="text" name="required_files" value={marketingDesign.required_files}  required />
                    </div>

                    <div>
                        <label>Project Type:</label>
                        <input type="text" name="project_type" value={marketingDesign.project_type}  required />
                    </div>

                    <div>
                        <label>Reference Link:</label>
                        <input type="url" name="reference" value={marketingDesign.reference} formTarget='_blank'  rel="noopener noreferrer" required/>
                    </div>

                    <div>
                        <label>File & Chat Link:</label>
                        <input type="url" name="file_and_chat" value={marketingDesign.file_and_chat}  required />
                        {/* {marketingDesign.file_and_chat && marketingDesign.file_and_chat.startsWith("http") && (
                          <div className="reference-link">
                             <a href={marketingDesign.file_and_chat} target="_blank" rel="noopener noreferrer">
                              {marketingDesign.file_and_chat}
                            </a>
                          </div>
                        )} */}
                    </div>
                </form>
                <div className='detail-project'>
                      <label>Detail Project:</label>
                      <textarea
                          name="detail_project"
                          value={marketingDesign.detail_project}
                          // onChange={handleChange}
                          required
                      />
                      {/* <div className="preview-detail-project">
                        {renderDetailProject(marketingDesign.detail_project)}
                      </div> */}
                  </div>
                  {/* Render for create card  */}
                  {/* <div className="form-create-card">
                    { 
                      openFormCreate && (
                        <div className="create-card-fiture">
                          <select 
                            onChange={(e)=> setListId(e.target.value)}
                            value={listId}
                          >
                            <option value="" disabled>
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
                            <button onClick={handleCreateCard} disabled={isCreating}>
                              {isCreating ? 'Creating': <><IoIosAdd/> Create Card</>}
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
                          placeholder='Search list here...'
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
                  
                  <div className="popup-button">
                    <button onClick={handleOpenFormCreate}>
                        {openFormCreate ? 'Close':'Create a card'}
                    </button>
                    <button onClick={handleEdit}>Edit Data</button>
                    <button onClick={handleCancle}>Cancle</button>
                  </div>
              </div>
            </div>
          
        ):(
          <div>No data found</div>
        )}
      </div>
    </div>
  )
}

export default PopupMarketingDesign