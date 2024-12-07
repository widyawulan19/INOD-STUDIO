import React from 'react'
import { useDate } from '../context/DateContext'
import SearchBar from '../fiture/SearchBar';
import { Data_Cover } from '../data/DataCover';

function Example() {
  const {cards} = useDate();

  return (
    <div>
      <h1>Example search bar</h1>
      {/* <SearchBar cards={cards}/> */}
      {Data_Cover.map((cover)=>(
        <div key={cover.id}>
          <h1>{cover.name}</h1>
        </div>
      ))}

    </div>
  )
}

export default Example