import React from 'react'
import '../style/MarketingStyle.css'
import { CgDatabase } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

const AddDataMarketing=({isOpen,newData,data,handleSubmit,handleChange, handleClose})=> {
    

    const stopPropagation = (e) => {
        e.stopPropagation();
    }
  
  return (
        <div className="add-data-marketing">
            <div className="add-data-content">
                <IoClose size={25} className='close-icon' onClick={handleClose}/>
                <h2> <CgDatabase style={{marginRight:'10px'}}/> Add New Marketing Data</h2> <hr  style={{marginBottom:'4vh', border:'0.2px solid grey'}}/>
                <form onSubmit={handleSubmit}>
                    <div className='form'>
                        <label>Nomer Active Order :</label>
                        <input 
                            type="text"
                            name="nomer_active_order"
                            value={newData.nomer_active_order}
                            onChange={handleChange}
                            placeholder="Nomer active order" 
                        />
                    </div>
                    <div className='form'>
                        <label>Input By :</label>
                        <input 
                            type="text"
                            name="input_by"
                            value={newData.input_by}
                            onChange={handleChange}
                            placeholder="Input By" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Buyer Name :</label>
                        <input 
                            type="text"
                            name="buyer_name"
                            value={newData.buyer_name}
                            onChange={handleChange}
                            placeholder="Buyer Name" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Code Order :</label>
                        <input 
                            type="text"
                            name="code_order"
                            value={newData.code_order}
                            onChange={handleChange}
                            placeholder="Code Order" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Jumlah Track :</label>
                        <input 
                            type="text"
                            name="jumlah_track"
                            value={newData.jumlah_track}
                            onChange={handleChange}
                            placeholder="Jumlah Track" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Order Number :</label>
                        <input 
                            type="text"
                            name="order_number"
                            value={newData.order_number}
                            onChange={handleChange}
                            placeholder="Order Number" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Account :</label>
                        <input 
                            type="text"
                            name="account"
                            value={newData.account}
                            onChange={handleChange}
                            placeholder="Account" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Deadline :</label>
                        <input 
                            type="date"
                            name="deadline"
                            value={newData.deadline}
                            onChange={handleChange}
                            placeholder="Deadline" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Jumlah Revisi :</label>
                        <input 
                            type="text"
                            name="jumlah_revisi"
                            value={newData.jumlah_revisi}
                            onChange={handleChange}
                            placeholder="Jumlah Revisi" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Order Type :</label>
                        <input 
                            type="text"
                            name="order_type"
                            value={newData.order_type}
                            onChange={handleChange}
                            placeholder="Order Type" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Offer Type :</label>
                        <input 
                            type="text"
                            name="offer_type"
                            value={newData.offer_type}
                            onChange={handleChange}
                            placeholder="Offer Type" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Jenis Track :</label>
                        <input 
                            type="text"
                            name="jenis_track"
                            value={newData.jenis_track}
                            onChange={handleChange}
                            placeholder="Jenis Track" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Genre :</label>
                        <input 
                            type="text"
                            name="genre"
                            value={newData.genre}
                            onChange={handleChange}
                            placeholder="Genre" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Price :</label>
                        <input 
                            type="text"
                            name="price"
                            value={newData.price}
                            onChange={handleChange}
                            placeholder="Price" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Required File</label>
                        <input 
                            type="file"
                            name="required_file"
                            onChange={handleChange}
                            placeholder="Required File" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Project Type :</label>
                        <input 
                            type="text"
                            name="project_type"
                            value={newData.project_type}
                            onChange={handleChange}
                            placeholder="Project Type" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Duration :</label>
                        <input 
                            type="text"
                            name="duration"
                            value={newData.duration}
                            onChange={handleChange}
                            placeholder="Duration" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Reference :</label>
                        <input 
                            id='url'
                            type="url"
                            name="reference"
                            value={newData.reference}
                            onChange={handleChange}
                            placeholder="https://example.com" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">File and Chat :</label>
                        <input 
                            type="file"
                            name="file_and_chat"
                            onChange={handleChange}
                            placeholder="File and Chat" 
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Detail Project :</label>
                        <textarea 
                            name="detail_project"
                            value={newData.detail_project}
                            onChange={handleChange}
                            placeholder="Detail Project"
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="">Progress :</label>
                        <input 
                            type="text"
                            name="progress"
                            value={newData.progress}
                            onChange={handleChange}
                            placeholder="Progress" 
                        />
                    </div>
                    <div className='form-btn'>
                        <button type="submit">Add New Data</button>
                        <button onClick={handleClose}>Cancel</button>
                        <button>Create Card</button>
                    </div>
                
            </form>

                
            </div>
        </div>
    
  )
}

export default AddDataMarketing