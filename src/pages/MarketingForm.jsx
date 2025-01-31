import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsDatabaseAdd } from "react-icons/bs";
import { updateDataMarketing, createDataMarketing } from '../services/Api'; // Pastikan pathnya sesuai
import '../style/MarketingForm.css'
import '../style/PopupMarketingDetail.css'

const MarketingForm = ({ existingData, handleCancle }) => {
  const [formData, setFormData] = useState({
    // marketing_id: '',
    // card_id: '',
    // title: '',
    // description: '',
    input_by: '',
    acc_by: '',
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
    price_normal: '',
    price_discount: '',
    discount: '',
    basic_price: '',
    gig_link: '',
    required_files: '',
    project_type: '',
    duration: '',
    reference_link: '',
    file_and_chat_link: '',
    detail_project: ''
  });

  const { marketing_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    } else if (marketing_id) {
      setFormData({ ...formData, marketing_id });
    }
  }, [existingData, marketing_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Pastikan deadline tidak kosong atau null
    const updatedFormData = {
      ...formData,
      deadline: formData.deadline ? formData.deadline : null, // Set null jika deadline kosong
    };
  
    try {
      let response;
      if (marketing_id) {
        response = await updateDataMarketing(marketing_id, updatedFormData);
      } else {
        response = await createDataMarketing(updatedFormData);
      }
  
      alert('Data berhasil disimpan');
      navigate('/new-marketing'); 
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };
  

  return (
    <div className="form-popup-overlay">
        <div className="form-popup">
            <div className="title">
                <BsDatabaseAdd/>
                <h2>{marketing_id ? 'Edit Marketing Data' : 'Create Marketing Data'}</h2>
                <IoIosCloseCircleOutline size={20} onClick={handleCancle}/>
            </div>
            <div className="body">
                <form onSubmit={handleSubmit}>
                {/* <div>
                <label>Card ID:</label>
                <input
                    type="number"
                    name="card_id"
                    value={formData.card_id}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                </div> */}
                <div>
                <label>Input By:</label>
                <input
                    type="text"
                    name="input_by"
                    value={formData.input_by}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Acc By:</label>
                <input
                    type="text"
                    name="acc_by"
                    value={formData.acc_by}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Buyer Name:</label>
                <input
                    type="text"
                    name="buyer_name"
                    value={formData.buyer_name}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Code Order:</label>
                <input
                    type="text"
                    name="code_order"
                    value={formData.code_order}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Jumlah Track:</label>
                <input
                    type="number"
                    name="jumlah_track"
                    value={formData.jumlah_track}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Order Number:</label>
                <input
                    type="text"
                    name="order_number"
                    value={formData.order_number}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Account:</label>
                <input
                    type="text"
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Deadline:</label>
                <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Jumlah Revisi:</label>
                <input
                    type="number"
                    name="jumlah_revisi"
                    value={formData.jumlah_revisi}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Order Type:</label>
                <input
                    type="text"
                    name="order_type"
                    value={formData.order_type}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Offer Type:</label>
                <input
                    type="text"
                    name="offer_type"
                    value={formData.offer_type}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Jenis Track:</label>
                <input
                    type="text"
                    name="jenis_track"
                    value={formData.jenis_track}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Genre:</label>
                <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Price Normal:</label>
                <input
                    type="number"
                    name="price_normal"
                    value={formData.price_normal}
                    onChange={handleChange}
                    step="0.01"
                    required
                />
                </div>
                <div>
                <label>Price Discount:</label>
                <input
                    type="number"
                    name="price_discount"
                    value={formData.price_discount}
                    onChange={handleChange}
                    step="0.01"
                    required
                />
                </div>
                <div>
                <label>Discount:</label>
                <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Basic Price:</label>
                <input
                    type="number"
                    name="basic_price"
                    value={formData.basic_price}
                    onChange={handleChange}
                    step="0.01"
                    required
                />
                </div>
                <div>
                <label>Gig Link:</label>
                <input
                    type="url"
                    name="gig_link"
                    value={formData.gig_link}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Required Files:</label>
                <input
                    type="text"
                    name="required_files"
                    value={formData.required_files}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Project Type:</label>
                <input
                    type="text"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Duration:</label>
                <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Reference Link:</label>
                <input
                    type="url"
                    name="reference_link"
                    value={formData.reference_link}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>File & Chat Link:</label>
                <input
                    type="url"
                    name="file_and_chat_link"
                    value={formData.file_and_chat_link}
                    onChange={handleChange}
                    required
                />
                </div>
                </form>
            <div className='detail-project'>
                <label>Detail Project:</label>
                <textarea
                    name="detail_project"
                    value={formData.detail_project}
                    onChange={handleChange}
                    required
                />
            </div>
            </div>
        <div className='popup-button-form'>
            <button 
                type="submit" 
                onClick={handleSubmit}
                >Save</button>
            <button onClick={handleCancle}>Cancle</button>
        </div>
        </div>
    </div>
  );
};

export default MarketingForm;