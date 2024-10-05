import React, { useState } from 'react'
import { Data_Bg } from '../data/DataBg'


const BackgroundSelector=({onSelectedBackground})=> {
    const [selectedBackground, setSelectedBackground] = useState(null);

    const handleBackgroundChange = (backgoround) => {
        setSelectedBackground(backgoround.img_url);
        onSelectedBackground(backgoround.img_url)
    }

  return (
    <div>
        <h3>Select a new background:</h3>
        {Data_Bg.map((bg) => (
            <div key={bg.id} onClick={()=> handleBackgroundChange(bg)}>
                <img src={bg.image_url} alt={bg.name} />
                <p>{bg.name}</p>
            </div>
        ))}
    </div>
  )
}

export default BackgroundSelector