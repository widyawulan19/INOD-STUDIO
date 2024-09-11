import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCardDescriptionById } from '../services/Api';
import { IoIosSend } from "react-icons/io";
import { HiOutlineCreditCard,HiMenuAlt2,HiOutlineUserAdd,HiOutlinePaperClip,HiOutlineArrowRight,HiOutlineDuplicate, HiOutlineArchive } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import '../style/CardDetail.css'

 
const CardDetail = () => {
    const {workspaceId, boardId, listId, cardId} = useParams();
    const [cardDetail,setCardDetail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCardDetail = async () => {
          try {
            const response = await getCardDescriptionById(cardId);
            setCardDetail(response.data[0]);
          } catch (error) {
            console.error('Error fetching card detail:', error);
          }
        };
    
        fetchCardDetail();
      }, [cardId]);
    
      if (!cardDetail) {
        return <p>Loading...</p>;
      }
      const handleBackToBoardView = () => {
        navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
      };

      return (
        <div className='card-detail-container'>
          <div className="description-container">
            <div className='cover'></div>
            <div className="container">
              <div className="description">
                
                <h5 style={{textAlign:'left'}}> <HiOutlineCreditCard size={25}/>New Project-1track-alexxpiinksz-SWQUENCE-1D343 EXTRA FAST</h5>
                <h5 >Labels</h5>
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
          {/* <div className='title'>
              <h3>title</h3>
          </div>
          <div className='description'>
            <h2>Card Details</h2>
            <p><strong>Order Number:</strong> {cardDetail.order_number}</p>
            <p><strong>Buyer Name:</strong> {cardDetail.buyer_name}</p>
            <p><strong>Order Type:</strong> {cardDetail.order_type}</p>
            <p><strong>Price:</strong> {cardDetail.price}</p>
            <p><strong>Account:</strong> {cardDetail.account}</p>
            {/* Tambahkan field lainnya sesuai kebutuhan 
            <button onClick={handleBackToBoardView}>back to card</button>
          </div> */}


        </div>
      );
}

export default CardDetail

