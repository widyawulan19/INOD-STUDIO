import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCardDescriptionById, getlabel, getCardLabels, getCardById, getAllCover,  } from '../services/Api';
import { IoIosSend } from "react-icons/io";
import { HiOutlineCreditCard,HiMenuAlt2,HiOutlineUserAdd,HiOutlinePaperClip,HiOutlineArrowRight,HiOutlineDuplicate, HiOutlineArchive, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import '../style/CardDetail.css'
import DataCover, { Data_Cover, Data_Label } from '../data/DataCover'


 
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
    
    //dropdown option
    const toggleOptionVisibility = () => {
      setShowOption(!showOption);
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
            <div className='cover'></div>
            <div className="container">
              <div className="description" style={{}}>
                
                <h5 style={{textAlign:'left'}}> <HiOutlineCreditCard size={25}/>New Project-1track-alexxpiinksz-SWQUENCE-1D343 EXTRA FAST</h5>
                <div className='select-option' style={{}}>
                    <strong style={{marginRight:'10px'}}>Select Label here</strong>
                    <select multiple={true} style={{height:'20px', padding:'2px 5px', width:'200px'}} onChange={(e)=> handleLabelSelection(e.target.value)}>
                      <option value="">Select Label</option>
                      {labels.map((label)=>(
                        <option key={label.id} style={{backgroundColor:label.color, height:'100%'}} onClick={()=> handleLabelSelection(label)}>
                          {/* {selectedLabels.includes(label) ? 'Unselect' : 'Select'} {label.name} */}
                          {label.name}
                        </option>
                      ))}
                    </select>
                </div>

                {/* EXAMPLE */}
                {/* <div className='select-option' style={{border:'1px solid red' }} onClick={toggleOptionVisibility}>
                    <strong style={{marginRight:'10px'}}>Select Label here</strong>
                    <select multiple={true} style={{height:'20px', padding:'2px 5px', width:'200px'}} onChange={(e)=> handleLabelSelection(e.target.value)}>
                      {showOption ? 
                      (<><HiChevronDown/>Select</>):()}
                    </select>
                </div> */}

                {/* Display Selected Labels */}
                <div className='selected-labels-container' style={{ marginTop: '10px', padding:'5px',wordWrap:'break-word',overflowWrap:'break-word',whiteSpace:'normal',height:'auto' }}>
                    {/* <strong>Selected Labels:</strong> */}
                    <div className='selected-labels'>
                      <div>
                        {selectedLabels.map((label)=> (
                          <span key={label.id} style={{ backgroundColor: label.color, padding: '5px', margin: '2px' }}>
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div>
                </div>

                        {/* <div className="cover">
                          {cardCover.map((cover)=>(
                            <img 
                            key={cover.id}
                            src={cover.cover_image_url} 
                            alt={cover.name}
                            style={{ width: '100%', height: 'auto' }}
                          />
                          ))}
                        </div> */}
                        {/* <div className="cover">
                          {Data_Cover.map(cover => (
                            <div key={cover.id}>
                              <img 
                                src={cover.cover_image_url} 
                                alt={cover.name} 
                              />
                            </div>
                          ))}
                        </div> */}

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
              </div>
            </div>
          </div>


        </div>
      );
}

export default CardDetail

/*
{/* <div className='label-container'>
                  {labels.map((label)=>(
                    <div key={label.id} className='label' style={{backgroundColor: label.color, padding:'5px 10px', borderRadius:'4px', marginBottom:'5px'}}>
                      {label.name}
                    </div>
                  ))}
                </div> 
                {/* LABEL SELECTED 
                {/* <div>
                  <select onChange={handleLabelSelect} className='label-select'>
                    <option value="">Select Label</option> 
                    {/* {labels.map((label)=>(
                      <option key={label.id} value={label.id}>
                        {label.name}({label.color})
                      </option>
                    ))} 
                    {/* {labels.map((label)=>(
                      <option key={label.id} value={label.id}>
                        <div className='label' style={{backgroundColor: label.color, padding:'5px 10px', borderRadius:'4px', marginBottom:'5px'}}>
                          {label.name}
                        </div>
                      </option>
                    ))}
                  </select> 

                  {/* DISPLAY SELECTED LABELS 
                    {/* <div className='selected-labels'>
                      {selectedLabels.map((labelId)=>{
                        const label = labels.find((lbl)=> lbl.id === labelId);
                        return(
                          <div className='lable-item' key={labelId}>
                            <span>{label.name}</span>
                            <button onClick={()=> handleLabelRemove(labelId)}>Remove</button>
                          </div>
                        )
                      })}
                    </div> 

*/