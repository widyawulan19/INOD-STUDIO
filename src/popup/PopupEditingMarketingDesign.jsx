import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMarketingDesignById, updateMarketingDesign } from '../services/Api';
import { BsDatabaseGear } from 'react-icons/bs';
import { IoIosCloseCircleOutline } from 'react-icons/io';



const PopupEditingMarketingDesign=()=> {
    const {marketing_design_id} = useParams();
    console.log("marketing design id dari params:", marketing_design_id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    //menampilkan data marketing by id
    const [marketingDesignData, setMarketingDesignData] = useState({
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
        detail_project:''
    });

    //FUNGSI
    //1. fetch marketing data by ID on component
    useEffect(()=>{
        const fetchMarketingDesignData = async()=>{
            try{
                const response = await getMarketingDesignById(marketing_design_id);
                console.log("cek response data:", response.data);
                setMarketingDesignData(response.data)

                setLoading(false);
            }catch(error){
                console.error('Error fetching marketing design data:', error);
                setLoading(false);
            }
        };
        fetchMarketingDesignData();
    },[marketing_design_id]);

    useEffect(() => {
        console.log("Updated marketingDesignData:", marketingDesignData);
    }, [marketingDesignData]);
    

    //2. handle form input changes
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setMarketingDesignData((prevData) =>({
            ...prevData,
            [name]: value
        }));
    }
    //3. handle form submit
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const response = await updateMarketingDesign(marketing_design_id, marketingDesignData);
            console.log('Data updated successfully: ',response.data);
            navigate(`/popup-detail-marketing-design/${marketing_design_id}`);
        }catch(error){
            console.error('Error updating marketing data:', error);
        }
    };

    const handleToDetail = () =>{
        navigate(`/popup-detail-marketing-design/${marketing_design_id}`);
    }

    if (loading) {
        return <div>Loading...</div>;
      }

     const lastFiveChars = marketingDesignData?.code_order?.slice(-5)||" ";
     console.log('marketing design data:', marketingDesignData);

  return (
    <div className='detail-popup-overlay'>
        <div className="detail-popup">
            <div className="title">
                <BsDatabaseGear size={20}/>
                <h3>Data Marketing Design for <br />New Project | {marketingDesignData?.style || " "} | {marketingDesignData.buyer_name} | {marketingDesignData.account} | {lastFiveChars}</h3>
                <IoIosCloseCircleOutline onClick={handleToDetail} className='ikon-title'/>
            </div>
            <div className="mp-form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Input By:</label>
                        <input type="text" name="input_by" value={marketingDesignData.input_by} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Buyer Name:</label>
                        <input type="text" name="buyer_name" value={marketingDesignData.buyer_name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Code Order:</label>
                        <input type="text" name="code_order" value={marketingDesignData.code_order} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Jumlah Design:</label>
                        <input type="number" name="jumlah_design" value={marketingDesignData.jumlah_design} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Order Number:</label>
                        <input type="text" name="order_number" value={marketingDesignData.order_number} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Account:</label>
                        <input type="text" name="account" value={marketingDesignData.account} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Deadline:</label>
                        <input type="datetime-local" name="deadline" value={marketingDesignData.deadline} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Jumlah Revisi:</label>
                        <input type="number" name="jumlah_revisi" value={marketingDesignData.jumlah_revisi} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Order Type:</label>
                        <input type="text" name="order_type" value={marketingDesignData.order_type} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Offer Type:</label>
                        <input type="text" name="offer_type" value={marketingDesignData.offer_type} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Style:</label>
                        <input type="text" name="style" value={marketingDesignData.style} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Resolution:</label>
                        <input type="text" name="resolution" value={marketingDesignData.resolution} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Price Normal:</label>
                        <input type="number" step="0.01" name="price_normal" value={marketingDesignData.price_normal} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Price Discount:</label>
                        <input type="number" step="0.01" name="price_discount" value={marketingDesignData.price_discount} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Discount Percentage:</label>
                        <input type="number" step="0.01" name="discount_percentage" value={marketingDesignData.discount_precentage} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Required Files:</label>
                        <input type="text" name="required_files" value={marketingDesignData.required_files} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Project Type:</label>
                        <input type="text" name="project_type" value={marketingDesignData.project_type} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Reference Link:</label>
                        <input type="url" name="reference" value={marketingDesignData.reference} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>File & Chat Link:</label>
                        <input type="url" name="file_and_chat" value={marketingDesignData.file_and_chat} onChange={handleChange} required />
                    </div>
                </form>
                <div className='detail-project'>
                    <label htmlFor="detail_project">Detail Project:</label>
                    <textarea
                    id="detail_project"
                    name="detail_project"
                    value={marketingDesignData.detail_project}
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
  )
}

export default PopupEditingMarketingDesign