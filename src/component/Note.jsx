//just for note

/*
// List.jsx
<div key={card.id} className='card-item-lists' onClick={() => handleToCardDetail(card.id)}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: '1vw' }}>
    <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0' }}>
      <strong>{card.title}</strong>
    </p>
    <p className='dot-icon'>
      <HiDotsVertical
        className='dot-btn'
        onClick={(e) => toggleActionCard(card.id, e)}
      />
    </p>
    {showAction === card.id && (
      <div className='card-dropdown-menu-action'>
        <ul className='dropdown-ul'>
          Actions
          <li onClick={() => handleAction(card.id, 'delete')} className='dropdown-li'>
            <AiFillDelete className='ikon' size={15} />
            <div style={{ size: '10px' }}>
              Delete <br />
              <span style={{ fontSize: '10px', fontWeight: 'normal' }}>Delete workspace</span>
            </div>
          </li>
          <li onClick={() => handleAction(card.id, 'archive')} className='dropdown-li'>
            <HiArchive className='ikon' size={15} />
            <div>
              Archive <br />
              <span style={{ fontSize: '10px', fontWeight: 'normal' }}>Archive your workspace</span>
            </div>
          </li>
        </ul>
      </div>
    )}
  </div>


  /* Style untuk ikon HiDotsVertical 
.dot-btn {
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  transition: color 0.3s ease;
}

.dot-btn:hover {
  color: #0079bf; /* Memberikan warna saat dihover 
}

/* Style untuk dropdown action 
.card-dropdown-menu-action, .list-drodpwon-menu-action {
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
  z-index: 10;
  top: 40px; /* Sesuaikan agar muncul di bawah ikon 
  right: 0;
  width: 180px;
}

.dropdown-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-ul li {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.dropdown-ul li:hover {
  background-color: #f4f4f4; /* Warna latar saat dihover 
}

.ikon {
  margin-right: 8px;
}

*/