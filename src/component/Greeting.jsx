import React from 'react'

function Greeting() {
    //get hourse
    const currentHour = new Date().getHours();

    //menentukan pesan gretting
    let grettingMessage = '';
    if(currentHour >= 5 && currentHour < 12){
        grettingMessage = 'Good Morning! 🌞 ';
    } else if (currentHour >= 12 && currentHour < 18){
        grettingMessage = 'Good Afternoon! 🌞';
    } else {
        grettingMessage = 'Good Evening! 🌃';
    }

    //get date
    const currentDate = new Date();
    const daysOfWeek = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[currentDate.getDay()];
    const monthOfYears = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthOfYears[currentDate.getMonth()];

    const date = currentDate.getDate();
    const year = currentDate.getFullYear();

  return (
    <div style={{ textAlign: 'left',padding:'10px',marginTop:'0px' , fontSize: '24px' }}>
      <h3 style={{marginBottom:'0px', marginTop:'0px'}}>{grettingMessage}</h3>
      <p style={{marginTop:'0',marginBottom:'0', fontSize:'10px'}}>Today is {dayName}, {date} {monthName} {year} | We hope you have a great day!</p>
      {/* <p>We hope you have a great day!</p> */}
    </div>
  )
}

export default Greeting