import React, { useEffect, useState } from 'react'
import { Data_Lables } from '../data/DataLabel'
import { CiShoppingTag } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import '../style/Label.css'

const getRandomColor = ()=>{
    const letters = "0123456789ABCDEF";
    let color = '#';
    for (let i = 0; i  < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return `${color}90`; //Transparansi
}

const LabelSelector=()=> {
    const [labels, setLabels] = useState([]);
    const [newLabel, setNewLabel] = useState("");
    const [showLabel, setShowLabel] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState([]);

    // showLabel 
    const handleShowLabel = () => {
        setShowLabel(!showLabel);
    }

    // mengambil data dari localstorage
    useEffect(()=>{
        const storedLabels = localStorage.getItem('labels');
        if(storedLabels){
            setLabels(JSON.parse(storedLabels));
        }else{
            setLabels(Data_Lables)
            localStorage.setItem('labels', JSON.stringify(Data_Lables));
        }

        // Mengambil label yang dipilih dari localStorage
        const storedSelectedLabels = localStorage.getItem('selectedLabels');
        if (storedSelectedLabels) {
            setSelectedLabels(JSON.parse(storedSelectedLabels));
        }
    },[]);

    // fungsi untuk menambahkan label baru 
    const addCustomLabel = () =>{
        if(newLabel.trim() === "")return;
        const newLabelData = {
            id: labels.length + 1,
            name : newLabel,
            color:'#000000',
            bgColor:getRandomColor(),
        };
        const updatedLabels = [...labels, newLabelData];
        setLabels(updatedLabels);
        localStorage.setItem('labels', JSON.stringify(updatedLabels));
        setNewLabel("");
    }

    // remove label 
    const removeLabel = (id) =>{
        const updatedLabels = labels.filter((label) => label.id !== id);
        setLabels(updatedLabels);
        localStorage.setItem('labels', JSON.stringify(updatedLabels));
    }

    const toggleSelectLabel = (id) => {
        const updatedSelectedLabels = selectedLabels.includes(id)
            ? selectedLabels.filter(labelId => labelId !== id)  // Hapus jika sudah dipilih
            : [...selectedLabels, id]; // Tambahkan jika belum dipilih

        setSelectedLabels(updatedSelectedLabels);
        localStorage.setItem('selectedLabels', JSON.stringify(updatedSelectedLabels)); // Menyimpan label yang dipilih ke localStorage
    };

    const handleStopPropagation = (e) => {
        e.stopPropagation();
    }

    return (
        <div className='label-select-container'>
            {/* Bagian untuk memilih label */}
            <div className="label-container" onClick={handleShowLabel}>
                <p>{selectedLabels.length > 0 
                    ? labels.filter(label => selectedLabels.includes(label.id)).map(label => (
                        `Nama: ${label.name}, Warna Teks: ${label.color}, Warna Latar: ${label.bgColor}`
                    )).join(" | ")
                    : "Empty"}</p>
                {showLabel && (
                    <div className="label-component" onClick={handleStopPropagation}>
                        <h5>Label Manager</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {labels.map((label) => (
                                <div
                                    key={label.id}
                                    style={{
                                        backgroundColor: label.bgColor,
                                        color: label.color,
                                        padding: '10px 15px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: selectedLabels.includes(label.id) ? '2px solid #007BFF' : 'none', // Menandai label yang dipilih
                                    }}
                                    onClick={() => toggleSelectLabel(label.id)} // Mengubah pemilihan label saat diklik
                                >
                                    {label.name}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Masukkan label baru"
                                style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                            <button
                                onClick={addCustomLabel}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Tambahkan Label
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bagian untuk menampilkan label yang dipilih */}
            <div className="selected-labels-container">
                <h5>Label yang Dipilih:</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {labels.filter(label => selectedLabels.includes(label.id)).map((label) => (
                        <div
                            key={label.id}
                            style={{
                                backgroundColor: label.bgColor,
                                color: label.color,
                                padding: '10px 15px',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {label.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LabelSelector;
