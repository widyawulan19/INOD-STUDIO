import React, { useState } from 'react'
import img1 from '../assets/bg/bg1.jpeg'
import img2 from '../assets/bg/bg2.jpeg'
import img3 from '../assets/bg/bg3.jpeg'
import img4 from '../assets/bg/bg4.jpeg'
import img5 from '../assets/bg/bg5.jpeg'
import img6 from '../assets/bg/bg6.jpeg'
import img7 from '../assets/bg/bg7.jpeg'
import img8 from '../assets/bg/bg8.jpeg'

const BACKGROUND = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8
]

const Background =({onChangeBackground})=> {

  return (
    <div style={{
                width:'10vw', 
                backgroundColor:'white', 
                boxShadow:'0 4px 8px rgba(0,0,0,0.3)',
                height:'4vh', 
                borderRadius:'5px', 
                marginRight:'1vw',
                display:'flex',
                alignItems:'center',
                padding: '0 4px',
              }}>
        <select onChange={(e) => onChangeBackground(e.target.value)}
          style={{width:'100%', backgroundColor:'white'}}
        >
        {BACKGROUND.map((bg, index) => (
          <option key={index} value={bg}>
            Background {index + 1}
          </option>
        ))}
      </select>
    </div>

  )
}

export default Background