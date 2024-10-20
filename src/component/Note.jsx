import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCardDescriptionById, getlabel, getCardLabels, getCardById, getAllCover,  } from '../services/Api';
import { IoIosSend } from "react-icons/io";
import { HiOutlineCreditCard,HiMenuAlt2,HiOutlineUserAdd,HiOutlinePaperClip,HiOutlineArrowRight,HiOutlineDuplicate, HiOutlineArchive, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaUserAstronaut, FaCcDiscover } from "react-icons/fa";
import '../style/CardDetail.css'
import { Data_Cover } from '../data/DataCover.js'


 
const CardDetail = () => {
    const {workspaceId, boardId, listId, cardId} = useParams();
    const [cardDetail,setCardDetail] = useState(null);
    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([])
    const navigate = useNavigate();
    const [card, setCard] = useState(null)
    const [cover, setCover] = useState([]);
    const [cardCover, setCardCover] = useState([]);
    const [showOption, setShowOption] = useState(false);
    const [showCover, setShowCover] = useState(false);
    const [selectCover, setSelectCover] = useState(null);

    const hexToRgba = (hex, opacity) => {
      // Pastikan hex dimulai dengan '#' dan panjangnya 7 karakter
      if (!hex || hex[0] !== '#' || hex.length !== 7) {
        console.error('Invalid hex color:', hex);
        return 'rgba(0, 0, 0, 0)'; // Warna default bila hex tidak valid
      }
    
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
    
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    
    //dropdown option
    const toggleOptionVisibility = () => {
      setShowOption(prevState => !prevState);
    }
    const closeDropdown = () => {
      setShowOption(false);
    };


    //cover
    const toggleCoverVisibility = () =>{
      setShowCover(!showCover);
    }

    const handleCoverSelect = (cover)=>{
      setSelectCover(cover);
      setShowCover(false);
    }

    useEffect(() => {
      const fetchCard = async () => {
        try {
            const response = await getCardById(cardId); // Panggil API untuk mendapatkan detail kartu dan label
            setCard(response.data); // Simpan data kartu ke state
        } catch (error) {
            console.error("Failed to fetch card: ", error);
        }
      };
      const fetchCardDetail = async () => {
          try {
              const response = await getCardDescriptionById(cardId);
              setCardDetail(response.data[0]);
          } catch (error) {
              console.error('Error fetching card detail:', error);
          }
      };
  
      const fetchLabels = async () => {
          try {
              const response = await getlabel();
              setLabels(response.data);
          } catch (error) {
              console.error('Error fetching labels:', error);
          }
      };
      
      const fetchCover = async () => {
        try{
          const response = await getAllCover();
          setCover(response.data);
          console.log('Cover Data:', response.data)
        }catch(error){
          console.error('Error fetching cover image:', error);
        }
      }
  
      // const fetchCardLabels = async () => {
      //     try {
      //         const response = await getCardLabels(cardId);
      //         const labelIds = response.data.map(label => label.id);
      //         setSelectedLabels(labels.filter(label => labelIds.includes(label.id)));
      //     } catch (error) {
      //         console.error('Error fetching card labels:', error);
      //     }
      // };
  
      fetchCardDetail();
      fetchLabels();
      fetchCard();
      fetchCover();
      //fetchCardLabels();
  }, [cardId]);

  useEffect(()=> {
    const fetchCovers = async () => {
      try {
          const response = await getAllCover();
          setCardCover(response.data); // Simpan data cover ke state
          console.log(cover);
      } catch (error) {
          console.error('Error fetching covers:', error);
      }
  }
  fetchCovers();
  }, []);
  
    
      if (!cardDetail) {
        return <p>Loading...</p>;
      }

      const handleLabelSelect = (e) =>{
        const labelId = e.target.value;
        if(!selectedLabels.includes(labelId)){
          setSelectedLabels([...selectedLabels, labelId])
        }
      };

      const handleLabelSelection = (label) => {
          if(selectedLabels.includes(label)){
            setSelectedLabels(selectedLabels.filter((l)=> l !== label))
          }else{
            setSelectedLabels([...selectedLabels, label])
          }
      }

      const handleBackToBoardView = () => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
      };

    const handleLabelChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedIds = selectedOptions.map(option => parseInt(option.value, 10));
      const selected = labels.filter(label => selectedIds.includes(label.id));
      setSelectedLabels(selected);
      console.log(selectedLabels);
  };
  
  const handleLabelRemove = (labelId) => {
      setSelectedLabels(selectedLabels.filter((label) => label.id !== labelId));
  };
      return (
        <div className='card-detail-container'>
          <div className="description-container">
            <div className='cover'>
              {selectCover &&(
                <div className='imgCover'>
                  <img src={selectCover.cover_image_url} alt={selectCover.name} />
                </div>
              )}
            </div>
            <div className="container">
              <div className="description" style={{}}>
                <h5 style={{textAlign:'left'}}> <HiOutlineCreditCard size={25}/>New Project-1track-alexxpiinksz-SWQUENCE-1D343 EXTRA FAST</h5>
                <div className='select-option'>
                  {/* <strong style={{marginRight:'1vw'}}>Select Label Here</strong> */}
                  <div style={{display:'flex', flexDirection:'column', marginBottom:'2vh'}}>
                    <div
                      style={{
                        position:'relative',
                        padding:'5px',
                        border:'1px solid grey',
                        borderRadius:'5px',
                        boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.2)',
                        width:'95%',
                        cursor:'pointer',
                        backgroundColor:'#f9f9f9',
                        fontSize:'10px'
                      }}
                      onClick={toggleOptionVisibility}
                    >
                      {selectedLabels.length > 0 ? 'Select Another Label' : 'Select Label'}
                    </div>
                      {/* DROPWDOWN  */}
                    {showOption && (
                      <div
                        className='dropdown-options'
                        style={{
                          position:'absolute',
                          top: '100%',
                          left: '0',
                          border: '1px solid grey',
                          backgroundColor: '#fff',
                          zIndex: 1000,
                          width: '50%',
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                          borderRadius:'5px',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          marginLeft:''
                        }}
                      >
                        {labels.map((label)=>(
                          <div
                            key={label.id}
                            style={{
                              backgroundColor: hexToRgba(label.color, 0.4),
                              border:`1px solid ${label.text_color}`,
                              padding: '10px',
                              cursor:'pointer',
                              color: label.text_color,
                              fontWeight:'bold'
                            }}
                            onClick={()=> {
                              handleLabelSelection(label);
                              closeDropdown();
                            }}
                          >
                            {selectedLabels.includes(label)? 'Unselect ' : 'Select '}{label.name}
                          </div>
                        ))}

                      </div>
                    )}
                  </div>
                </div>

                {/* Display Selected Labels */}
               <div className='selected-labels-container'>
                    <strong>Selected Labels:</strong>
                    <div className='selected-labels'>
                      <div style={{ margin:'0', height:'auto', width:'100%', display:'flex',flexWrap:'wrap'}}>
                        {selectedLabels.map((label)=> (
                          <span key={label.id} style={{ 
                            backgroundColor: hexToRgba(label.color, 0.5), 
                            color: label.text_color,
                            fontSize:'12px',
                            fontWeight:'bold',
                            border: `2px solid ${label.text_color}`,
                            display:'flex',
                            borderRadius:'5px',
                            padding:'4px',
                            marginTop:'2px'
                            }}>   
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div> 
                </div>

                <div className='description-attribute'>
                  <h5><HiMenuAlt2 style={{marginRight:'0.5vw'}}/>DESCRIPTION</h5>
                  <button className='btn-edit'>Edit</button>
                </div>
                <div className='container-desc'>
                  <p><strong>Nomer Active Order: </strong>{cardDetail.nomer_active_order}</p><hr />

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>INPUT BY</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.input_by}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>BUYER NAME</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.buyer_name}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>CODE ORDER</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.code_order}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>JUMLAH TRACK</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.jumlah_track}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>ORDER NUMBER</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.order_number}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>ACCOUNT</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.account}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>DEADLINE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.deadline}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>JUMLAH REVISI</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.jumlah_revisi}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>ORDER TYPE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.order_type}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>OFFER TYPE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.offer_type}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>JENIS TRACK</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.jenis_track}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>GENRE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.genre}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>PRICE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.price}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>PROJECT TYPE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.project_type}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>REQUIRED FILE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.required_file}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>DURATION</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.duration}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>REFERENCE</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.reference}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>FILE AND CHAT</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.file_and_chat}
                  </div>

                  <div className='detail-input'>
                    <div className='detail-input1'>
                      <p><strong>DETAIL PROJECT</strong></p>
                      <p>:</p>
                    </div>
                    {cardDetail.detail_project}
                  </div>
                </div>

                <div className='attachment'>
                    <h5><HiOutlinePaperClip/>Attachment</h5>
                    <button>Add</button>
                </div>
 
                {/* FORM KOMENTAR */}
                <div className='commentar'>
                  <FaUserAstronaut size={25}/> {/*profil pengguna */}
                  <input type="text" className='input-komentar' placeholder='Write a comment...'/>
                  <IoIosSend size={25}/>
                </div>

              </div>
              <div className="action">
                <h4>ACTIONS</h4>
                <button className='btn'><HiOutlineUserAdd className='action-icon'/>Add Member</button>
                <button className='btn'><HiOutlinePaperClip className='action-icon'/>Attachment</button>
                <button className='btn'><HiOutlineArrowRight className='action-icon'/>Move</button>
                <button className='btn'><HiOutlineDuplicate className='action-icon'/>Copy</button>
                <button className='btn'><HiOutlineArchive className='action-icon'/>Archive</button>
                <button className='btn' onClick={toggleCoverVisibility}>
                  {showCover ?
                 (<><FaCcDiscover className='action-icon'/>Pilih Cover</>):(<><FaCcDiscover className='action-icon'/>Cover</>)   
                }
                </button>
                {showCover && (
                  <div style={{
                      border:'0.1px solid grey',
                      borderRadius:'5px',
                      boxShadow:'0 4px 8px rgba(0,0,0,0.1)',
                      padding:'5px',
                      width:'100px',
                      height:'130px',
                      overflowY:'auto'
                  }}>
                    {Data_Cover.map((cover)=>(
                      <div 
                        className='coverImg' 
                        key={cover.id}
                        onClick={()=> handleCoverSelect(cover)}
                        style={{marginBottom:'5px', cursor:'pointer'}}
                      >
                        <img 
                          src={cover.cover_image_url} 
                          alt={cover.name} />
                      </div>
                    ))}
                  </div>
                )}

                {/* {menampilkan hasil cover} */}
              </div>
            </div>
          </div>


        </div>
      );
}

export default CardDetail


import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCardDescriptionById, getCardLabels, getlabel, updateCardDescription, updateCardLabels } from '../services/Api'
import '../style/ModalStyle.css'

const CardModal=()=> {
    const navigate = useNavigate()
    const {cardId, workspaceId,boardId,listsId} = useParams();
    const [cardDetail, setCardDetail] = useState(null);
    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [formData, setFormData] = useState({
        nomer_active_order: '',
        input_by: '',
        buyer_name: '',
        code_order: '',
        jumlah_track: '',
        order_number: '',
        account: '',
        deadline: '',
        jumlah_revisi: '',
        order_type: '',
        offer_type: '',
        jenis_track: '',
        genre: '',
        price: '',
        required_file: '',
        project_type: '',
        duration: '',
        reference: '',
        file_and_chat: '',
        detail_project: '',
    })


    useEffect(() =>{
        const fetchData = async () =>{
            try{
                const cardResponse = await getCardDescriptionById(cardId);
                setCardDetail(cardResponse.data[0]);
                setFormData(cardResponse.data[0]);

                const labelsResponse = await getlabel();
                setLabels(labelsResponse.data);

                const cardLabelsResponse = await getCardLabels(cardId);
                setSelectedLabels(cardLabelsResponse.data.map(label => label.id));
            }catch(error){
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [cardId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleLabelChange = (e) => {
        const {value, checked} = e.target;
        setSelectedLabels((prev) =>
            checked ? [...prev, value] : prev.filter((id) =>id !== value)
        )
    }

    const handleSave = async () => {
        try {
          await updateCardDescription(cardId, formData);
          // Save labels for the card
          await updateCardLabels(cardId, selectedLabels); // Add this function to update labels for the specific card
          navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };




      return (
        <div className='modal-overlay'>
          <form className='form-modal'>
          <h2>Edit Card Details</h2>
          <div className='input-modal'>
            {Object.keys(cardDetail).map((key) => (
                key !== 'id' && key !== 'cdesc_id' && (
                <div key={key} className='form-input'>
                    <label>{key.replace(/_/g, ' ')}</label>
                    <input
                    type='text'
                    name={key}
                    value={cardDetail[key]}
                    onChange={handleChange}
                    />
                </div>
                )
            ))}
            <button onClick={handleSave}>Save</button>
            </div>
          </form>
        </div>
      );
}

// export default CardModal

import React, { useState } from 'react';
import { createMarketingData } from './apiService'; // import your API service

const MarketingForm = () => {
  const [formData, setFormData] = useState({
    nomer_active_order: '',
    input_by: '',
    buyer_name: '',
    code_order: '',
    jumlah_track: '',
    order_number: '',
    account: '',
    deadline: '',
    jumlah_revisi: '',
    order_type: '',
    offer_type: '',
    jenis_track: '',
    genre: '',
    price: '',
    required_file: '',
    project_type: '',
    duration: '',
    reference: '',
    file_and_chat: '',
    detail_project: '',
    progress: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createMarketingData(formData);
      console.log('Data successfully saved:', response.data);
      // Optionally, clear the form or show success message
    } catch (error) {
      console.error('Error creating marketing data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nomer_active_order"
        value={formData.nomer_active_order}
        onChange={handleChange}
        placeholder="Nomer Active Order"
      />
      <input
        type="text"
        name="input_by"
        value={formData.input_by}
        onChange={handleChange}
        placeholder="Input By"
      />
      <input
        type="text"
        name="buyer_name"
        value={formData.buyer_name}
        onChange={handleChange}
        placeholder="Buyer Name"
      />
      {/* Add the rest of the input fields for the other formData properties */}
      
      <button type="submit">Submit</button>
    </form>
  );
};

// export default MarketingForm;

// .add-data-content {
//   background-color: #f9f9f9;
//   border-radius: 10px;
//   padding: 20px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   max-width: 600px;
//   margin: 20px auto;
//   font-family: Arial, sans-serif;
// }

// .add-data-content form {
//   display: flex;
//   flex-direction: column;
//   gap: 15px;
// }

// .add-data-content input[type="text"], 
// .add-data-content input[type="date"], 
// .add-data-content input[type="file"], 
// .add-data-content textarea {
//   width: 100%;
//   padding: 10px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   font-size: 16px;
//   box-sizing: border-box;
// }

// .add-data-content textarea {
//   resize: none;
//   height: 100px;
// }

// .add-data-content button {
//   padding: 10px 15px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   font-size: 16px;
// }

// .add-data-content button:hover {
//   background-color: #0056b3;
// }

// .add-data-content button[type="submit"] {
//   margin-right: 10px;
// }

// .add-data-content button[type="button"] {
//   background-color: #6c757d;
// }

// .add-data-content button[type="button"]:hover {
//   background-color: #5a6268;
// }

// .add-data-content h2 {
//   font-size: 24px;
//   color: #333;
//   text-align: center;
//   margin-bottom: 20px;
// }
