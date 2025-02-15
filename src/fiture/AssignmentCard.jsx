import React, { useEffect, useState } from 'react'
import { assignUserToCard, getAssignedUsersForCard, getUsersInBoard, removeUserFromCard,getUserCountByCard } from '../services/Api';
import { LuSearch } from 'react-icons/lu';
import { AiOutlineDelete } from "react-icons/ai";
import '../style/AssignmentCard.css';

const AssignmentCard=({boardId, cardId})=> {
    const [users, setUsers] = useState([]);
    const [userCard, setUserCard] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [allCardUser, setAllCardUser] = useState([]);
    const [userCount, setUserCount] = useState(null);
    

    //1. mendapatkan semua user yang terdaftar di board 
    useEffect(()=>{
        const fetchUsers = async()=>{
            try{
                const userData = await getUsersInBoard(boardId);
                setUsers(userData);
                setAllCardUser(userData);
            }catch(error){
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    },[boardId]);

    //2. menampilkan semua user untuk card
    useEffect(()=>{
        const fetchUserCard = async()=>{
            try{
                const userCard = await getAssignedUsersForCard(cardId);
                setUserCard(userCard.assignedUsers);
            }catch(error){
                console.error('Error fetch card users:', error);
            }
        };
        fetchUserCard();
    },[cardId]);

    //3. menambahkan user pada card
    const handleAddUserToCard = async(userId)=>{
        try{
            const addUserCard = await assignUserToCard(cardId,userId);
            setUserCard([...userCard, addUserCard]);
            setSearchTerm('');
        }catch(error){
            console.error('Errorng adding user to card:', error);
        }
    };

    // 4. Search filter untuk mencari pengguna yang dapat ditambahkan ke card
    const filterCardUsers = allCardUser.filter(cardUser =>
        cardUser.username.toLowerCase().includes(searchTerm.toLowerCase()) && // Case insensitive search
        !userCard.some(assignedUser => assignedUser.id === cardUser.id) // Hindari duplikasi user yang sudah ada di card
    );

    // 5. menghapus user dari card 
    const handleRemove = async(userId)=>{
        try{
            console.log('removing user:', userId, "from card:", cardId)
            await removeUserFromCard(Number(cardId),userId);
            // setUserCard(userCard.filter(user => user.id !== userId));
            setUserCard(prevUsers => prevUsers.filter(user => user.id !== userId));
        }catch(error){
            console.error('Error removing user from card:', error);
        }
    }

    //6. mendapatkan total assign card
    useEffect(() => {
        const fetchTotalData = async () => {
            try {
                const data = await getUserCountByCard(cardId);
                console.log("User count response:", data);
    
                // Pastikan array tidak kosong sebelum mengakses user_count
                if (data.cardUserCounts && data.cardUserCounts.length > 0) {
                    const userCountValue = parseInt(data.cardUserCounts[0].user_count, 10); // Konversi ke angka
                    setUserCount(userCountValue);
                } else {
                    console.error("User count data is missing or empty:", data);
                }
            } catch (error) {
                console.error("Failed to fetch user count:", error);
            }
        };
    
        if (boardId && cardId) { 
            fetchTotalData();
        }
    }, [cardId, boardId]);
    
    


    const handleSearchChange = (event) =>{
        setSearchTerm(event.target.value);
    };

    const handleStopPropagation = (event) =>{
        event.stopPropagation();
    }

    //GENERATE FOR PROFILE
    //profil users
    const generateProfileInitials = (name) =>{
        if(!name) return'';
        const nameParts = name.split(' ');
        const initials = nameParts.map((part)=> part.charAt(0).toUpperCase()).join('');
        return initials.slice(0,2);
    }
    //END GENERATE FOR PROFILE

  return (
    <div className='card-assign-container'>
        <div className="header">
            <LuSearch className='ikon'/>
            <input 
                type="text" 
                placeholder='search users...'
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
            />
        </div>

        {/* dropdown pencarian  */}
        <div className="body">
            {searchTerm && (
                <div className='list-body' onClick={(event)=> handleStopPropagation(event)}>
                    {filterCardUsers.length > 0 ? (
                        filterCardUsers.map(user =>(
                            <div className='body-cont' key={user.id} onClick={()=>handleAddUserToCard(user.id)}>
                                <div className='user-photo'>
                                    <span>{generateProfileInitials(user.username)}</span>
                                </div>
                                <div>
                                    {user.username}
                                </div>
                            </div>
                        ))
                    ):(
                        <p>username tidak tersedia pada card ini! </p>
                    )}
                </div>
            )}
        </div>
        {/* end dropdown pencarian  */}

        {/* jumlah assign  */}
        {/* <div className='assgn-list'>
            {users.map(user =>(
                <div key={user.id} className='assgn-user-box'>
                    <div className="left">
                        <div className="user-photo">
                            <span>{generateProfileInitials(user.username)}</span>
                        </div>
                        <p>{user.username}</p>
                    </div>
                    <button onClick={() => handleRemove(user.id)}><AiOutlineDelete size={15}/></button>
                </div>
            ))}
        </div> */}

        <div className="assign-list2">
            {/* <h5>Users card</h5> */}
            {/* <div>
                {userCount !== null ? (
                    <p>Jumlah user: {userCount}</p>
                ) : (
                    <p>Loading...</p>
                )}
            </div> */}
            {userCard.map(uc =>(
                <div className="assgn-user-box">
                    <div className="left">
                        <div className="user-photo">
                            <span>{generateProfileInitials(uc.username)}</span>
                        </div>
                        <p>{uc.username}</p>
                    </div>
                    <button onClick={() => handleRemove(uc.id)}><AiOutlineDelete size={15}/></button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AssignmentCard


// 1. mendapatkan semua user yang dapat di akses oleh card
// 2. mendapatkan semua user pada Card
// 3. menambahkan user pada Card
// 4. menghapus user pada card
// 5. mendapatkan total user pada card

{/* <div>
        <h3>Assigned Users for Board</h3>
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.username} ({user.email})
                </li>
            ))}
        </ul>
        <h3>Assigned Users for Card</h3>
        <ul>
            {Array.isArray(userCard) && userCard.length > 0 ? (
                userCard.map(user => (
                    <li key={user.id}>{user.username} <button onClick={()=> handleRemove(user.id)}>remove</button></li>
                ))
            ) : (
                <li>No users assigned to this card.</li>
            )}
        </ul>

        <h3>Search users to assign to card</h3>
        <input 
            type="text" 
            placeholder='search users...'
            value={searchTerm}
            onChange={handleSearchChange}
        />
        <ul>
            {filterCardUsers.length > 0 ? (
                filterCardUsers.map(user =>(
                    <li key={user.id}>
                        {user.username} ({user.email})
                        <button onClick={() => handleAddUserToCard(user.id)}>Add</button>
                    </li>
                ))
            ):(
                <li>No matching users found</li>
            )}
        </ul>
    </div> */}