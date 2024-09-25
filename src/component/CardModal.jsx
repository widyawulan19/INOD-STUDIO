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
    
      if (!cardDetail) {
        return <p>Loading...</p>;
      }



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

export default CardModal