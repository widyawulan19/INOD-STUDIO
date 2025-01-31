

import React, { useState, useEffect } from 'react';
import { CiImageOn } from 'react-icons/ci';
import '../style/CoverImage.css';
import { getAllExapleCover, saveCoverToCard, saveImageToCard, getCardById, uploadImage, getAllImageUpload } from '../services/Api';
import axios from 'axios';
import { useDate } from '../context/DateContext';

const TestingFiture2 = ({ onCoverSelect, cardId }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [showSelectionMenu, setShowSelectionMenu] = useState(false);
    const [buttonActive, setButtonActive] = useState('gallery');
    const [coverImages, setCoverImages] = useState([]);
    const [defaultColors, setDefaultColors] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    // update dan akses cover di komponen 
    const {setSelectedCover, covers, setCovers} = useDate();


    // Fetch data cover dari API
    useEffect(() => {
        const fetchCover = async () => {
            try {
                const response = await getAllExapleCover();
                const covers = response.data;
    
                setCovers(covers);
    
                const colors = covers.filter(item => item.color_code && !item.cover_image_url)
                    .map((item) => ({
                        ...item,
                        color_code: item.color_code.startsWith('#') ? item.color_code : `#${item.color_code}`,
                    }));
    
                const images = covers.filter(item => item.cover_image_url);
                setDefaultColors(colors);
                setCoverImages(images);
    
                if (cardId) {
                    const cardResponse = await getCardById(cardId);
                    const card = cardResponse.data;
    
                    const cover = covers.find(c => c.id === card.cover_id);
                    if (cover) {
                        setSelectedImage(cover.cover_image_url || cover.color_code);
                        setSelectedImageId(cover.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching cover data:', error);
            }
        };
    
        fetchCover();
    }, [cardId]);

    //fetch upload image
    useEffect(()=>{
        const fetchImageUploaded = async () =>{
            try{
                const response = await getAllImageUpload();
                setUploadedImages(response.data);
            }catch(error){
                console.error('Error to fetch image uploaded:', error);
            }
        }
        fetchImageUploaded();
    },[]);

    const toggleSelectionMenu = () => {
        setShowSelectionMenu(!showSelectionMenu);
    };

    const handleSaveImage = (cover, coverId) => {
        console.log('Selected Cover:', cover, 'Selected Cover ID:', coverId);
    
        setSelectedImage(cover);
        setSelectedImageId(coverId);
    
        localStorage.setItem('coverImage', cover);
        localStorage.setItem('coverImageId', coverId);
    
        handleSaveCoverToCard(coverId);
        onCoverSelect(cover);
        setSelectedCover(cover);
    };
    

    const handleFileChange = (event) => {
        console.log('Input file triggered');
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file);
            setSelectedImage(URL.createObjectURL(file));
            handleUpload(file);
        }else{
            console.log('No file selected')
        }
    };


    const handleUpload = async (file) => {
        if (!file) return alert("Please select an image first.");

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const response = await uploadImage(file);


            const uploadedImageUrl = response.image.image_url;
            if(uploadedImageUrl){
                setSelectedImage(uploadedImageUrl);
                setSelectedImageId(null);
                alert('Image uploaded successfully')

                await handleSaveCoverToCard(uploadedImageUrl);
            }else{
                alert('image URL not found in response.')
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveCoverToCard = async (coverId, imageId = null) => {
        console.log('Cover ID yang diterima:', coverId);
        console.log('Image ID yang diterima:', imageId);
        console.log('Card ID yang diterima:', cardId);
    
        if (!cardId || (!coverId && !imageId)) {
            console.error('Card ID, Cover ID, atau Image ID kosong.');
            return;
        }
    
        try {
            let response;
    
            if (imageId) {
                // Gunakan endpoint saveImageToCard jika imageId tersedia
                response = await saveImageToCard(cardId, imageId);
            } else {
                // Gunakan endpoint saveCoverToCard jika coverId tersedia
                response = await saveCoverToCard(cardId, coverId);
            }
    
            console.log('Response from save operation:', response);
    
            // Fetch updated card untuk sinkronisasi data
            const updatedCard = await getCardById(cardId);
            const cover = updatedCard.data.cover_id
                ? covers.find((c) => c.id === updatedCard.data.cover_id)
                : null;
    
            if (cover) {
                setSelectedImage(cover.cover_image_url || cover.color_code);
                setSelectedImageId(cover.id);
                console.log('Updated cover:', cover);
            }
    
            alert('Cover berhasil diperbarui pada kartu!');
        } catch (error) {
            console.error('Error saving cover to card:', error);
            alert('Gagal memperbarui cover!');
        }
    };
    
    
    
   

    return (
        <div className="cover-container">
            <button className='cover-button' onClick={toggleSelectionMenu}>
                <p>Select Cover</p>
                <CiImageOn/>
            </button>
           
            {showSelectionMenu && (
                <div className="cover-select-content">
                    <div className="cover-header">
                        <button
                            onClick={() => setButtonActive('gallery')}
                            className={buttonActive === 'gallery' ? 'active-btn' : ''}
                        >
                            Gallery
                        </button>
                        <button
                            onClick={() => setButtonActive('upload')}
                            className={buttonActive === 'upload' ? 'active-btn' : ''}
                        >
                            Upload
                        </button>
                    </div>
                    <div className="cover-body">
                        {buttonActive === 'gallery' && (
                            <div className="cover-gallery">
                                <div className="gallery-default">
                                    <h5>Colors</h5>
                                    <div className="default-color">
                                        {defaultColors.map((color, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleSaveImage(color.color_code, color.id)}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: color.color_code,
                                                    cursor: 'pointer',
                                                    margin: '2px',
                                                    borderRadius: '4px',
                                                    boxShadow: selectedImage === color.color_code
                                                        ? '0px 4px 8px rgba(0,0,0,0.5)'
                                                        : 'none',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="image-default">
                                    <h5>Images</h5>
                                    <div className="image-cover">
                                        {coverImages.map((img) => (
                                            <img
                                                key={img.id}
                                                src={img.cover_image_url}
                                                alt={img.name || 'Cover Image'}
                                                onClick={() => handleSaveImage(img.cover_image_url, img.id)}
                                                style={{
                                                    margin: '2px',
                                                    width: '100px',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    boxShadow: selectedImage === img.cover_image_url
                                                        ? '0px 4px 8px rgba(0,0,0,0.5)'
                                                        : 'none',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {buttonActive === 'upload' && (
                            <div className="cover-upload">
                                <h5>Upload Custom Image</h5>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ borderRadius: '5px', padding: '5px' }}
                                    disabled={uploading}
                                />
                                {uploading && <p>Uploading...</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedImage && !uploading && (
                <div className="selected-cover">
                    {/* <h5>Selected Cover:</h5> */}
                    {selectedImage.startsWith('#') || selectedImage.length === 6 ? (
                        <div
                            style={{
                                backgroundColor: selectedImage.startsWith('#') ? selectedImage : `#${selectedImage}`,
                                borderRadius: '8px',
                                // border:'1px solid red',
                                width: '100%',
                                height: '25vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff', // Warna teks putih untuk kontras
                                fontWeight: 'bold',
                            }}
                        >
                            {/* Menampilkan kode warna sebagai teks di tengah */}
                            {/* {selectedImage.startsWith('#') ? selectedImage : `#${selectedImage}`} */}
                        </div>
                    ) : (
                        <img
                            src={selectedImage}
                            alt="Selected Cover"
                            style={{
                                borderRadius: '8px',
                                width: '100%',
                                height: '25vh',
                                objectFit: 'cover', // Memastikan gambar tidak terdistorsi
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default TestingFiture2;