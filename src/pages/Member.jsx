import React from 'react'
import '../style/MemberStyle.css'

function Member() {
  const imgUrl = 'https://drive.google.com/uc?id=1MQPOnl9hX8SSyLrkgHDC8NHBHxF3VX8q';
  return (
    <div className="member-container">
      <h1>member</h1>
        <div className="title1"></div>
        <div className="category"></div>
        <div className="data-member">
          <img src={imgUrl} alt="" />
        </div>
    </div>
  )
}

export default Member