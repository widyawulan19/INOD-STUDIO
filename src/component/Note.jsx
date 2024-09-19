//just for note

/*

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardDescriptionById, getlabel } from '../services/Api';
import { IoIosSend } from 'react-icons/io';
import { HiOutlineCreditCard, HiMenuAlt2, HiOutlineUserAdd, HiOutlinePaperClip, HiOutlineArrowRight, HiOutlineDuplicate, HiOutlineArchive } from 'react-icons/hi';
import { FaUserAstronaut } from 'react-icons/fa';
import '../style/CardDetail.css';

const CardDetail = () => {
  const { workspaceId, boardId, listId, cardId } = useParams();
  const [cardDetail, setCardDetail] = useState(null);
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
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

    const fetchLabels = async () => {
      try {
        const response = await getlabel();
        setLabels(response.data); // Assuming response contains list of labels
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchCardDetail();
    fetchLabels();
  }, [cardId]);

  if (!cardDetail) {
    return <p>Loading...</p>;
  }

  const handleLabelSelect = (e) => {
    const labelId = e.target.value;
    if (!selectedLabels.includes(labelId)) {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const handleLabelRemove = (labelId) => {
    setSelectedLabels(selectedLabels.filter((id) => id !== labelId));
  };

  const handleBackToBoardView = () => {
    navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
  };

  return (
    <div className='card-detail-container'>
      <div className='description-container'>
        <div className='cover'></div>
        <div className='container'>
          <div className='description'>
            <h5 style={{ textAlign: 'left' }}>
              <HiOutlineCreditCard size={25} />
              New Project-1track-alexxpiinksz-SWQUENCE-1D343 EXTRA FAST
            </h5>
            <h5>Labels</h5>

            {/* Label Selection 
            <div>
              <select onChange={handleLabelSelect} className="label-select">
                <option value="">Select Label</option>
                {labels.map((label) => (
                  <option key={label.id} value={label.id}>
                    {label.name} ({label.color})
                  </option>
                ))}
              </select>

              {/* Display selected labels 
              <div className="selected-labels">
                {selectedLabels.map((labelId) => {
                  const label = labels.find((lbl) => lbl.id === labelId);
                  return (
                    <div key={labelId} className="label-item">
                      <span>{label.name}</span>
                      <button onClick={() => handleLabelRemove(labelId)}>Remove</button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='description-attribute'>
              <h5>
                <HiMenuAlt2 style={{ marginRight: '0.5vw' }} />
                DESCRIPTION
              </h5>
              <button className='btn-edit'>Edit</button>
            </div>

            <div className='container-desc'>
              <p><strong>Nomer Active Order: </strong>{cardDetail.nomer_active_order}</p>
              <hr />
              {/* Add the rest of the card details here 
            </div>

            <div className='attachment'>
              <h5><HiOutlinePaperClip />Attachment</h5>
              <button>Add</button>
            </div>

            {/* Form Komentar 
            <div className='commentar'>
              <FaUserAstronaut size={25} />
              <input type='text' className='input-komentar' placeholder='Write a comment...' />
              <IoIosSend size={25} />
            </div>
          </div>

          <div className='action'>
            <h4>ACTIONS</h4>
            <button className='btn'>
              <HiOutlineUserAdd className='action-icon' />
              Add Member
            </button>
            <button className='btn'>
              <HiOutlinePaperClip className='action-icon' />
              Attachment
            </button>
            <button className='btn'>
              <HiOutlineArrowRight className='action-icon' />
              Move
            </button>
            <button className='btn'>
              <HiOutlineDuplicate className='action-icon' />
              Copy
            </button>
            <button className='btn'>
              <HiOutlineArchive className='action-icon' />
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;

import React, { useEffect, useState } from 'react';
import { getCardDescriptionById, getlabel } from '../services/Api';

const CardDetail = () => {
  const { cardId } = useParams();
  const [cardDetail, setCardDetail] = useState(null);
  const [labels, setLabels] = useState([]); // State untuk label

  useEffect(() => {
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
        setLabels(response.data); // Simpan label ke state
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchCardDetail();
    fetchLabels(); // Panggil API label saat komponen di-mount
  }, [cardId]);

  if (!cardDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className='card-detail-container'>
      {/* Konten card detail lainnya 
      
      <h5>Labels</h5>
      <div className="label-container">
        {labels.map((label) => (
          <div
            key={label.id}
            className="label"
            style={{ backgroundColor: label.color, padding: '5px 10px', borderRadius: '4px', marginBottom: '5px' }}
          >
            {label.name}
          </div>
        ))}
      </div>
      
      {/* Konten lainnya 
    </div>
  );
}

export default CardDetail;


import React, { useEffect, useState } from 'react';
import { getlabel } from '../services/Api';

const LabelSelection = () => {
  const [labels, setLabels] = useState([]); // State untuk label
  const [selectedLabel, setSelectedLabel] = useState(null); // State untuk label yang dipilih

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await getlabel();
        setLabels(response.data); // Simpan label ke state
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchLabels(); // Panggil API label saat komponen di-mount
  }, []);

  // Fungsi untuk menangani perubahan pada pilihan label
  const handleLabelChange = (event) => {
    const selectedId = event.target.value;
    const selected = labels.find((label) => label.id === parseInt(selectedId));
    setSelectedLabel(selected); // Simpan label yang dipilih
  };

  return (
    <div className="label-selection-container">
      <h5>Select a Label</h5>
      <select onChange={handleLabelChange}>
        <option value="">-- Choose a Label --</option>
        {labels.map((label) => (
          <option key={label.id} value={label.id} style={{ backgroundColor: label.color }}>
            {label.name}
          </option>
        ))}
      </select>

      {/* Menampilkan label yang dipilih 
      {selectedLabel && (
        <div className="selected-label" style={{ backgroundColor: selectedLabel.color, color: '#fff', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
          <strong>{selectedLabel.name}</strong>
        </div>
      )}
    </div>
  );
};

.label-selection-container {
  display: flex;
  flex-direction: column;
}

.selected-label {
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  margin-top: 10px;
}

select {
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
}


export default LabelSelection;

import React, { useEffect, useState } from 'react';
import { getlabel } from '../services/Api';

const LabelSelection = () => {
  const [labels, setLabels] = useState([]); // State untuk menyimpan semua label
  const [selectedLabels, setSelectedLabels] = useState([]); // State untuk menyimpan label yang dipilih

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await getlabel();
        setLabels(response.data); // Simpan label ke state
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchLabels(); // Panggil API label saat komponen di-mount
  }, []);

  // Fungsi untuk menangani perubahan pilihan label
  const handleLabelChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions); // Mengambil semua option yang dipilih
    const selectedIds = selectedOptions.map((option) => parseInt(option.value)); // Mendapatkan id label yang dipilih
    const selected = labels.filter((label) => selectedIds.includes(label.id)); // Menyimpan label yang dipilih
    setSelectedLabels(selected); // Simpan label yang dipilih ke state
  };

  return (
    <div className="label-selection-container">
      <h5>Select Labels</h5>
      <select multiple onChange={handleLabelChange}>
        {labels.map((label) => (
          <option key={label.id} value={label.id} style={{ backgroundColor: label.color }}>
            {label.name}
          </option>
        ))}
      </select>

      {/* Menampilkan label yang dipilih 
      <div className="selected-labels">
        {selectedLabels.length > 0 && selectedLabels.map((label) => (
          <div
            key={label.id}
            className="label"
            style={{
              backgroundColor: label.color,
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '4px',
              marginBottom: '5px',
              display: 'inline-block',
              marginRight: '5px'
            }}
          >
            {label.name}
          </div>
        ))}
      </div>
    </div>
  );
};

.label-selection-container {
  display: flex;
  flex-direction: column;
}

.selected-labels {
  margin-top: 10px;
}

.label {
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  display: inline-block;
  margin: 5px;
}

select {
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  min-width: 200px;
  height: 100px; /* Menambah tinggi untuk multiple selection 



export default LabelSelection;


import React, { useEffect, useState } from 'react';
import { getlabel } from '../services/Api'; // Import API untuk mengambil label

const LabelSelection = () => {
  const [labels, setLabels] = useState([]); // State untuk menyimpan daftar semua label
  const [selectedLabels, setSelectedLabels] = useState([]); // State untuk menyimpan label yang dipilih

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await getlabel(); // Ambil label dari API
        setLabels(response.data); // Set label ke state
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchLabels(); // Ambil label saat komponen dimuat
  }, []);

  // Fungsi untuk menangani perubahan pilihan label
  const handleLabelChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions); // Ambil semua opsi yang dipilih
    const selectedIds = selectedOptions.map((option) => parseInt(option.value)); // Ambil ID dari label yang dipilih
    const selected = labels.filter((label) => selectedIds.includes(label.id)); // Cari label yang sesuai dengan ID yang dipilih
    setSelectedLabels(selected); // Simpan label yang dipilih di state
  };

  return (
    <div className="label-selection-container">
      <h5>Select Labels</h5>

      {/* Dropdown untuk memilih banyak label 
      <select multiple onChange={handleLabelChange} style={{ width: '200px', height: '100px' }}>
        {labels.map((label) => (
          <option key={label.id} value={label.id}>
            {label.name}
          </option>
        ))}
      </select>

      {/* Menampilkan label yang dipilih 
      <div className="selected-labels" style={{ marginTop: '10px' }}>
        {selectedLabels.length > 0 && selectedLabels.map((label) => (
          <div
            key={label.id}
            className="label"
            style={{
              backgroundColor: label.color,
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '4px',
              marginBottom: '5px',
              display: 'inline-block',
              marginRight: '5px'
            }}
          >
            {label.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelSelection;

.label-selection-container {
  display: flex;
  flex-direction: column;
}

.selected-labels {
  margin-top: 10px;
}

.label {
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  display: inline-block;
  margin: 5px;
}

select {
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  min-width: 200px;
  height: 100px; /* Menambah tinggi untuk multiple selection 
}

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardDescriptionById, getlabel } from '../services/Api';
import { IoIosSend } from "react-icons/io";
import { HiOutlineCreditCard, HiMenuAlt2, HiOutlineUserAdd, HiOutlinePaperClip, HiOutlineArrowRight, HiOutlineDuplicate, HiOutlineArchive } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import '../style/CardDetail.css';

const CardDetail = () => {
  const { workspaceId, boardId, listId, cardId } = useParams();
  const [cardDetail, setCardDetail] = useState(null);
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
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

    const fetchLabels = async () => {
      try {
        const response = await getlabel();
        setLabels(response.data);
      } catch (error) {
        console.error('Error fetching labels:', error);
      }
    };

    fetchCardDetail();
    fetchLabels();
  }, [cardId]);

  if (!cardDetail) {
    return <p>Loading...</p>;
  }

  const handleLabelChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => parseInt(option.value));

    // Perbarui selectedLabels tanpa menghapus pilihan sebelumnya
    const updatedSelectedLabels = labels.filter((label) => selectedIds.includes(label.id));
    setSelectedLabels(updatedSelectedLabels);
  };

  const handleBackToBoardView = () => {
    navigate(`/workspaces/${workspaceId}/boards/${boardId}`);
  };

  return (
    <div className='card-detail-container'>
      <div className="description-container">
        <div className='cover'></div>
        <div className="container">
          <div className="description">
            <h5 style={{ textAlign: 'left' }}>
              <HiOutlineCreditCard size={25} />New Project-1track-alexxpiinksz-SWQUENCE-1D343 EXTRA FAST
            </h5>

            <div className="label-selected-container">
              <h5>Selected Labels</h5>
              <select
                multiple
                onChange={handleLabelChange}
                style={{ width: '200px', height: '100px' }}
              >
                {labels.map((label) => (
                  <option
                    key={label.id}
                    value={label.id}
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </option>
                ))}
              </select>

              {/* MENAMPILKAN LABEL YANG DIPILIH 
              <div className='selected-labels' style={{ marginTop: '10px' }}>
                {selectedLabels.length > 0 && selectedLabels.map((label) => (
                  <div
                    key={label.id}
                    className='label'
                    style={{
                      backgroundColor: label.color,
                      color: '#fff',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      marginBottom: '5px',
                      display: 'inline-block',
                      marginRight: '5px',
                    }}
                  >
                    {label.name}
                  </div>
                ))}
              </div>
            </div>

            <div className='description-attribute'>
              <h5><HiMenuAlt2 style={{ marginRight: '0.5vw' }} />DESCRIPTION</h5>
              <button className='btn-edit'>Edit</button>
            </div>

            <div className='container-desc'>
              {/* Bagian deskripsi kartu 
              <p><strong>Nomer Active Order: </strong>{cardDetail.nomer_active_order}</p><hr />
              {/* Konten detail lainnya 
            </div>

            <div className='attachment'>
              <h5><HiOutlinePaperClip />Attachment</h5>
              <button>Add</button>
            </div>

            {/* FORM KOMENTAR 
            <div className='commentar'>
              <FaUserAstronaut size={25} />
              <input type="text" className='input-komentar' placeholder='Write a comment...' />
              <IoIosSend size={25} />
            </div>

          </div>
          <div className="action">
            <h4>ACTIONS</h4>
            <button className='btn'><HiOutlineUserAdd className='action-icon' />Add Member</button>
            <button className='btn'><HiOutlinePaperClip className='action-icon' />Attachment</button>
            <button className='btn'><HiOutlineArrowRight className='action-icon' />Move</button>
            <button className='btn'><HiOutlineDuplicate className='action-icon' />Copy</button>
            <button className='btn'><HiOutlineArchive className='action-icon' />Archive</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;


      
*/