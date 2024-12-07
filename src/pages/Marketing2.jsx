import React, { useCallback, useEffect, useState } from 'react';
import { getAllDataMarketing } from '../services/Api';
import moment from 'moment';
import { CiEdit } from 'react-icons/ci';
import { IoArchiveOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import '../style/MarketingStyle.css';

const Marketing2 = () => {
    const [marketingData, setMarketingData] = useState([]);
    const navigate = useNavigate();

    // Fetch data from API
    const fetchingMarketingData = useCallback(async () => {
        try {
            const response = await getAllDataMarketing();
            console.log('Receive data marketing from database:', response.data);
            setMarketingData(response.data);
        } catch (err) {
            console.error('Error fetching marketing data:', err);
        }
    }, []); 

    useEffect(() => {
        fetchingMarketingData();
    }, [fetchingMarketingData]);

    const handleToPopupMarketing = () =>{
        navigate('/marketing-detail')
    }

    return (
        <div className="tabel-container">
            <div className="tabel-data-marketing">
                {marketingData.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Input By</th>
                                <th>Acc by</th>
                                <th>Buyer Name</th>
                                <th>Code Order</th>
                                <th>Jumlah Track</th>
                                <th>Order Number</th>
                                <th>Account</th>
                                <th>Deadline</th>
                                <th>Jumlah Revisi</th>
                                <th>Order Type</th>
                                <th>Offer Type</th>
                                <th>Jenis Track</th>
                                <th>Genre</th>
                                <th>Price Normal</th>
                                <th>Price Discount</th>
                                <th>Discount</th>
                                <th>Basic Price</th>
                                {/* <th>GIG Link</th> */}
                                <th>Required Files</th>
                                <th>Project Type</th>
                                <th>Duration</th>
                                {/* <th>Reference</th>
                                <th>File & Chat</th>
                                <th>Detail Project</th> */}
                                <th style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketingData.map((item) => (
                                <tr key={item.marketing_id} onClick={handleToPopupMarketing}>
                                    <td>{item.input_by}</td>
                                    <td>{item.acc_by}</td>
                                    <td>{item.buyer_name}</td>
                                    <td>{item.code_order}</td>
                                    <td>{item.jumlah_track}</td>
                                    <td>
                                        <div style={{
                                            border: '1px solid #6b1c14',
                                            borderRadius: '8px',
                                            color: '#6b1c14',
                                            fontWeight: 'bolder',
                                            padding: '5px',
                                            backgroundColor: '#ecd1cd',
                                            width: 'fit-content'
                                        }}>
                                            {item.order_number}
                                        </div>
                                    </td>
                                    <td>{item.account}</td>
                                    <td>{item.deadline ? moment(item.deadline).format('D MMMM YYYY') : 'N/A'}</td>
                                    <td>{item.jumlah_revisi}</td>
                                    <td>{item.order_type}</td>
                                    <td>{item.offer_type}</td>
                                    <td>{item.jenis_track}</td>
                                    <td>{item.genre}</td>
                                    <td>{item.price_normal}</td>
                                    <td>{item.price_discount}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.basic_price}</td>
                                    {/* <td>{item.gig_link}</td> */}
                                    <td>{item.required_files}</td>
                                    <td>{item.project_type}</td>
                                    <td>{item.duration}</td>
                                    {/* <td>{item.reference_link}</td>
                                    <td>{item.file_and_chat_link}</td>
                                    <td>{item.detail_project}</td> */}
                                    <td style={{ textAlign: 'center' }}>
                                        <button className='btn-action'><CiEdit size={15} /> </button>
                                        <button className='btn-action'><IoArchiveOutline size={15} /> </button>
                                        <button className='btn-action'><AiOutlineDelete size={15} /> </button>
                                        <button className='btn-action' style={{ width: 'fit-content', padding: '6px' }}>View Card </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default Marketing2;
