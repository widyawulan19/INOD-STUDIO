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

  return (
    <div style={{}}>
        <select onChange={(e) => onChangeBackground(e.target.value)}>
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