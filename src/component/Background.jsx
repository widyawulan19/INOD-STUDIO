import React, { useState } from 'react'
import img1 from '../assets/bg/bg1.jpeg'
import img2 from '../assets/bg/bg2.jpeg'
import img3 from '../assets/bg/bg3.jpeg'
import img4 from '../assets/bg/bg4.jpeg'
import img5 from '../assets/bg/bg5.jpeg'
import img6 from '../assets/bg/bg6.jpeg'
import img7 from '../assets/bg/bg7.jpeg'

const BACKGROUND = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7
]

const Background =({onChangeBackground})=> {
    // const [backgroundImage, setBackgroundImage] = useState(BACKGROUND[0]);

    // const handleBagroundChange = (event) => {
    //     setBackgroundImage(event.target.value); 
    // };

  return (
    <div style={{marginBottom:'10px'}}>
        <h4>Select Background</h4>
        <select onChange={(e) => onChangeBackground(e.target.value)}>
        {BACKGROUND.map((bg, index) => (
          <option key={index} value={bg}>
            Background {index + 1}
          </option>
        ))}
      </select>
    </div>
    // <div style={{backgroundImage:`url(${backgroundImage})`, height:'100vh', backgroundSize:'cover'}}>
    //     <div style={{padding:'20px'}}>
    //         <h2>Select Background</h2>
    //         <select 
    //         style={{padding:'5px', fontSize:'16px'}}
    //         onChange={handleBagroundChange}>
    //             {BACKGROUND.map((bg, index)=>(
    //                 <option key={index} value={bg}>
    //                     Background {index + 1}
    //                 </option>
    //             ))}
    //         </select>
    //     </div>
    // </div>
  )
}

export default Background