import React, { useEffect, useState } from 'react';

const isImportedImage = (image) => {
    return image && (image.startsWith('http') || image.startsWith('file://'));
};

const CoverDisplay = ({ cardId }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Load the cover image only when cardId changes
    useEffect(() => {
        const loadCoverImage = () => {
            try {
                const savedImage = localStorage.getItem(`cover_${cardId}`);
                if (savedImage && savedImage !== selectedImage) {
                    setSelectedImage(savedImage); // Use savedImage directly if it's a string
                }
            } catch (error) {
                console.error("Error loading cover image:", error);
                setSelectedImage(null);
            }
        };

        loadCoverImage();
    }, [cardId]); // Only depend on cardId

    return (
        <div className='cover-display-container'>
            {selectedImage ? (
                isImportedImage(selectedImage) ? (
                    <img
                        src={selectedImage}
                        alt="Card Cover"
                        className='cover-image'
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                ) : selectedImage.startsWith('data:image') ? (
                    <img
                        src={selectedImage}
                        alt="Card Cover"
                        className="cover-image"
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: 'auto',
                            backgroundColor: selectedImage,
                            borderRadius: '8px',
                        }}
                    />
                )
            ) : (
                <p>No Cover selected</p>
            )}
        </div>
    );
};

export default CoverDisplay;
