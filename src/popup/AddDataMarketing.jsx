import React from 'react'
import '../style/MarketingStyle.css'

const AddDataMarketing=({isOpen,newData,data,handleSubmit,handleChange, handleClose})=> {


    const stopPropagation = (e) => {
        e.stopPropagation();
    }
 
  return (
        <div className="add-data-marketing">
            <div className="add-data-content">
                <h2>Add New Marketing Data</h2>
                <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="nomer_active_order"
                    value={newData.nomer_active_order}
                    onChange={handleChange}
                    placeholder="Nomer active order" 
                />
                
                <input 
                    type="text"
                    name="input_by"
                    value={newData.input_by}
                    onChange={handleChange}
                    placeholder="Input By" 
                />
                
                <input 
                    type="text"
                    name="buyer_name"
                    value={newData.buyer_name}
                    onChange={handleChange}
                    placeholder="Buyer Name" 
                />
                
                <input 
                    type="text"
                    name="code_order"
                    value={newData.code_order}
                    onChange={handleChange}
                    placeholder="Code Order" 
                />
                
                <input 
                    type="text"
                    name="jumlah_track"
                    value={newData.jumlah_track}
                    onChange={handleChange}
                    placeholder="Jumlah Track" 
                />
                
                <input 
                    type="text"
                    name="order_number"
                    value={newData.order_number}
                    onChange={handleChange}
                    placeholder="Order Number" 
                />
                
                <input 
                    type="text"
                    name="account"
                    value={newData.account}
                    onChange={handleChange}
                    placeholder="Account" 
                />
                
                <input 
                    type="date"
                    name="deadline"
                    value={newData.deadline}
                    onChange={handleChange}
                    placeholder="Deadline" 
                />
                
                <input 
                    type="text"
                    name="jumlah_revisi"
                    value={newData.jumlah_revisi}
                    onChange={handleChange}
                    placeholder="Jumlah Revisi" 
                />
                
                <input 
                    type="text"
                    name="order_type"
                    value={newData.order_type}
                    onChange={handleChange}
                    placeholder="Order Type" 
                />
                
                <input 
                    type="text"
                    name="offer_type"
                    value={newData.offer_type}
                    onChange={handleChange}
                    placeholder="Offer Type" 
                />
                
                <input 
                    type="text"
                    name="jenis_track"
                    value={newData.jenis_track}
                    onChange={handleChange}
                    placeholder="Jenis Track" 
                />
                
                <input 
                    type="text"
                    name="genre"
                    value={newData.genre}
                    onChange={handleChange}
                    placeholder="Genre" 
                />
                
                <input 
                    type="text"
                    name="price"
                    value={newData.price}
                    onChange={handleChange}
                    placeholder="Price" 
                />
                
                <input 
                    type="file"
                    name="required_file"
                    onChange={handleChange}
                    placeholder="Required File" 
                />
                
                <input 
                    type="text"
                    name="project_type"
                    value={newData.project_type}
                    onChange={handleChange}
                    placeholder="Project Type" 
                />
                
                <input 
                    type="text"
                    name="duration"
                    value={newData.duration}
                    onChange={handleChange}
                    placeholder="Duration" 
                />
                
                <input 
                    type="text"
                    name="reference"
                    value={newData.reference}
                    onChange={handleChange}
                    placeholder="Reference" 
                />
                
                <input 
                    type="file"
                    name="file_and_chat"
                    onChange={handleChange}
                    placeholder="File and Chat" 
                />
                
                <textarea 
                    name="detail_project"
                    value={newData.detail_project}
                    onChange={handleChange}
                    placeholder="Detail Project"
                />
                
                <input 
                    type="text"
                    name="progress"
                    value={newData.progress}
                    onChange={handleChange}
                    placeholder="Progress" 
                />

                <button type="submit">Submit</button>
                <button onClick={handleClose}>Cancel</button>
                <button>Create Card</button>
            </form>

                
            </div>
        </div>
    
  )
}

export default AddDataMarketing