// EditMarketingData.js
import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { getMarketingDataById, updateDataMarketing } from '../services/Api';
import { BsDatabaseGear } from 'react-icons/bs';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const EditMarketingData = () => {
  const { marketing_id } = useParams(); // Get the marketing ID from the URL params
  const navigate = useNavigate();

  const [marketingData, setMarketingData] = useState({
    card_id: '',
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

  const [loading, setLoading] = useState(true);

  // Fetch marketing data by ID on component mount
  useEffect(() => {
    const fetchMarketingData = async () => {
      try {
        const response = await getMarketingDataById(marketing_id);
        setMarketingData(response.data[0]); // Assuming response returns an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching marketing data:', error);
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, [marketing_id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarketingData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateDataMarketing(marketing_id, marketingData);
      console.log('Data updated successfully:', response.data);
      alert('Data Marketing berhasil di edit')
      navigate(`/popup-detail-marketing/${marketing_id}`);
    //   navigate(`/popup-detail-marketing/${marketing_id}`);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleToDetail = () => {
    navigate(`/popup-detail-marketing/${marketing_id}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='detail-popup-overlay'>
        <div className="detail-popup">
          <div className="title">
            <BsDatabaseGear size={20}/>
            <h3>Edit Data Marketing <br />{marketingData.buyer_name} |{marketingData.code_order}|{marketingData.order_number}</h3>
            <IoIosCloseCircleOutline onClick={handleToDetail} className='ikon-title'/>
          </div>
          <div className="mp-form">
            <form onSubmit={handleSubmit}>
              <div>
                  <label htmlFor='input_by'>Input By:</label>
                  <input
                  type="text"
                  name="input_by"
                  value={marketingData.input_by}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='acc_by'>Acc By:</label>
                  <input
                  type="text"
                  name="acc_by"
                  value={marketingData.acc_by}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor="buyer_name">Buyer Name:</label>
                  <input
                  type="text"
                  id="buyer_name"
                  name="buyer_name"
                  value={marketingData.buyer_name}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="code_order">Code Order:</label>
                  <input
                  type="text"
                  id="code_order"
                  name="code_order"
                  value={marketingData.code_order}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="jumlah_track">Jumlah Track:</label>
                  <input
                  type="number"
                  id="jumlah_track"
                  name="jumlah_track"
                  value={marketingData.jumlah_track}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="order_number">Order Number:</label>
                  <input
                  type="text"
                  id="order_number"
                  name="order_number"
                  value={marketingData.order_number}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="account">Account:</label>
                  <input
                  type="text"
                  id="account"
                  name="account"
                  value={marketingData.account}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="deadline">Deadline:</label>
                  <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={marketingData.deadline}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="jumlah_revisi">Jumlah Revisi:</label>
                  <input
                  type="number"
                  id="jumlah_revisi"
                  name="jumlah_revisi"
                  value={marketingData.jumlah_revisi}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="order_type">Order Type:</label>
                  <input
                  type="text"
                  id="order_type"
                  name="order_type"
                  value={marketingData.order_type}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="offer_type">Offer Type:</label>
                  <input
                  type="text"
                  id="offer_type"
                  name="offer_type"
                  value={marketingData.offer_type}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="jenis_track">Jenis Track:</label>
                  <input
                  type="text"
                  id="jenis_track"
                  name="jenis_track"
                  value={marketingData.jenis_track}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="genre">Genre:</label>
                  <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={marketingData.genre}
                  onChange={handleChange}
                  required
                  />
              </div>

              <div>
                  <label htmlFor="price_normal">Price Normal:</label>
                  <input
                  type="number"
                  id="price_normal"
                  name="price_normal"
                  value={marketingData.price_normal}
                  onChange={handleChange}
                  step="0.01"
                  required
                  />
              </div>

              <div>
                  <label htmlFor="price_discount">Price Discount:</label>
                  <input
                  type="number"
                  id="price_discount"
                  name="price_discount"
                  value={marketingData.price_discount}
                  onChange={handleChange}
                  step="0.01"
                  />
              </div>
              <div>
                  <label htmlFor="discount">Discount :</label>
                  <input
                  type="text"
                  name="discount"
                  value={marketingData.discount}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='basic_price'>Basic Price:</label>
                  <input
                  type="number"
                  name="basic_price"
                  value={marketingData.basic_price}
                  onChange={handleChange}
                  step="0.01"
                  required
                  />
              </div>
              <div>
                  <label htmlFor='gig_link'>Gig Link:</label>
                  <input
                  type="url"
                  name="gig_link"
                  value={marketingData.gig_link}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='required_files'>Required Files:</label>
                  <input
                  type="text"
                  name="required_files"
                  value={marketingData.required_files}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='project_type'>Project Type:</label>
                  <input
                  type="text"
                  name="project_type"
                  value={marketingData.project_type}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='duration'>Duration:</label>
                  <input
                  type="text"
                  name="duration"
                  value={marketingData.duration}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='reference_link'>Reference Link:</label>
                  <input
                  type="url"
                  name="reference_link"
                  value={marketingData.reference_link}
                  onChange={handleChange}
                  required
                  />
              </div>
              <div>
                  <label htmlFor='ile_and_chat_lin'>File & Chat Link:</label>
                  <input
                  type="url"
                  name="file_and_chat_link"
                  value={marketingData.file_and_chat_link}
                  onChange={handleChange}
                  required
                  />
              </div>
              {/* Add more fields as needed, based on your data structure */}
            </form>
            <div className='detail-project'>
                <label htmlFor="detail_project">Detail Project:</label>
                <textarea
                id="detail_project"
                name="detail_project"
                value={marketingData.detail_project}
                onChange={handleChange}
                required
                />
            </div>
          </div>

        <div className="popup-button">
            <button type="submit" onClick={handleSubmit}>Save Changes</button>
            <button onClick={handleToDetail}>Back To Detail</button>
        </div>
      </div>
    </div>
  );
};

export default EditMarketingData;
