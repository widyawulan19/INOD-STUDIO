import React, { useEffect, useState } from 'react'
import { Data_Bg } from '../data/DataBg'
import '../style/ImageSelector.css'

const ImageSelector=({onSelectImage})=> {
    const [selectedImage, setSelectedImage] = useState(null)
    const [isDrodownOpen, setDropdownOpen] = useState(false)

    useEffect(()=>{
        const saveImage = localStorage.getItem('selectedImage');
        if(saveImage){
            setSelectedImage(JSON.parse(saveImage))
        }
    },[])

    const handleImageSelect = (image) =>{
        setSelectedImage(image);
        localStorage.setItem('selectedImage', JSON.stringify(image))
        setDropdownOpen(false)

        onSelectImage(image);
    }


  return (
    <div>
        <h1>Select an image</h1>
        <div className="dropdown">
            <button onClick={() => setDropdownOpen(!isDrodownOpen)}>
                {selectedImage ? selectedImage.name : 'Select Image'}
            </button>
            {isDrodownOpen && (
                <ul className='dropdown-list'>
                    {Data_Bg.map((bg)=>(
                        <li key={bg.id} onClick={()=> handleImageSelect(bg)}>
                            <img 
                                src={bg.image_url} 
                                alt={bg.name} 
                                style={{
                                    width:'50px', 
                                    marginRight:'10px'
                                }} />
                            {bg.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>

        {/* {selectedImage && (
            <div>
                <h2>Selected Image :</h2>
                <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.name}
                    style={{
                        width:'100%',
                        maxWidth:'500px'
                    }}
                />
                <p>{selectedImage.image}</p>
            </div>
        )} */}
    </div>
  )
}

export default ImageSelector