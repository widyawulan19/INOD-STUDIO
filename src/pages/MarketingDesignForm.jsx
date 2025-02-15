import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createMarketingDesign, updateMarketingDesign } from '../services/Api';
import '../style/MarketingForm.css'
import '../style/PopupMarketingDetail.css'
import { BsDatabase, BsDatabaseAdd } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";

const MarketingDesignForm=({existingData, handleCancle})=> {
    console.log('existing data valid', existingData);
    const [formData, setFormData] = useState({
        input_by:'',
        buyer_name:'',
        code_order:'',
        jumlah_design:'',
        order_number:'',
        account:'',
        deadline:'',
        jumlah_revisi:'',
        order_type:'',
        offer_type:'',
        style:'',
        resolution:'',
        price_normal:'',
        price_discount:'',
        discount_precentage:'',
        required_files:'',
        project_type:'', 
    });

    const {marketing_design_id} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        if(existingData){
            setFormData(existingData);
        }else if(marketing_design_id){
            setFormData({...formData,marketing_design_id});
        }
    },[existingData,marketing_design_id]);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
    

        const updatedFormData = {
            ...formData,
            deadline: formData.deadline ? formData.deadline : null, // Set null jika deadline kosong
        };

        try{
            let response;
            if(marketing_design_id){
                response = await updateMarketingDesign(marketing_design_id,updatedFormData);
            }else{
                response = await createMarketingDesign(updatedFormData);
            }
            alert('Data berhasil disimpan');
            navigate('/marketing-design');
        }catch(error){
            console.error(error);
            alert('Terjadi kesalahan saat menyimpan data');
        }
    };

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
    <div className='form-popup-overlay'>
        <div className="form-popup">
            <div className="title">
                <BsDatabase/>
                <h2>{marketing_design_id ? 'Edit data': 'Create new marketing data'}</h2>
                <IoIosCloseCircleOutline size={20} onClick={handleCancle}/>
            </div>
            <div className="body">
                <form>
                    <div>
                        <label>Input By:</label>
                        <input type="text" name="input_by" value={formData.input_by} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Buyer Name:</label>
                        <input type="text" name="buyer_name" value={formData.buyer_name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Code Order:</label>
                        <input type="text" name="code_order" value={formData.code_order} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Jumlah Design:</label>
                        <input type="number" name="jumlah_design" value={formData.jumlah_design} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Order Number:</label>
                        <input type="text" name="order_number" value={formData.order_number} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Account:</label>
                        <input type="text" name="account" value={formData.account} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Deadline:</label>
                        <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Jumlah Revisi:</label>
                        <input type="number" name="jumlah_revisi" value={formData.jumlah_revisi} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Order Type:</label>
                        <input type="text" name="order_type" value={formData.order_type} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Offer Type:</label>
                        <input type="text" name="offer_type" value={formData.offer_type} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Style:</label>
                        <input type="text" name="style" value={formData.style} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Resolution:</label>
                        <input type="text" name="resolution" value={formData.resolution} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Price Normal:</label>
                        <input type="number" step="0.01" name="price_normal" value={formData.price_normal} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Price Discount:</label>
                        <input type="number" step="0.01" name="price_discount" value={formData.price_discount} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Discount Percentage:</label>
                        <input type="number" step="0.01" name="discount_percentage" value={formData.discount_percentage} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Required Files:</label>
                        <input type="text" name="required_files" value={formData.required_files} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Project Type:</label>
                        <input type="text" name="project_type" value={formData.project_type} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Reference Link:</label>
                        <input type="url" name="reference" value={formData.reference} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>File & Chat Link:</label>
                        <input type="url" name="file_and_chat" value={formData.file_and_chat} onChange={handleChange} required />
                    </div>
                </form>
                <div className="detail-project">
                    <label>Detail Project:</label>
                    <textarea 
                        name="detail_project" 
                        value={formData.detail_project}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="popup-button-form">
                <button 
                    type="submit"
                    onClick={handleSubmit}
                >
                    Save
                </button>
                <button type="button" onClick={handleCancle}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default MarketingDesignForm