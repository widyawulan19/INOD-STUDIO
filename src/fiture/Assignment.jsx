import React, { useEffect, useState } from 'react'
import { addUserToBoard, getAssignCountForBoard, getUsersInBoard,removeUserFromBoard ,searchUsers,selectUserAndAddToBoard} from '../services/Api';
import '../style/Assignment.css';
import { LuSearch } from 'react-icons/lu';
import { AiOutlineDelete } from "react-icons/ai";

const Assignment=({boardId})=> {
    const [users, setUsers] = useState([]);
    const [userIdToAdd, setUserIdToAdd] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    //count board
    const [userCount, setUserCount] = useState(null);


    //mendapatkan semua user yang terdaftar di board
    useEffect(()=>{
        const fetchUsers = async()=>{
            try{
                const usersData = await getUsersInBoard(boardId);
                setUsers(usersData);
            }catch(error){
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    },[boardId]);

    //mendapatkan semua user dari database
    useEffect(()=>{
        const fetchAllUsers = async () =>{
            try{
                const usersData = await searchUsers();
                setAllUsers(usersData);
            }catch(error){
                console.error('Error fetching all users:', error);
            }
        }
        fetchAllUsers();
    },[]);

    const handleAddUser = async(userId)=>{
        try{
            const addedUser = await addUserToBoard(boardId, userId);
            setUsers([...users, addedUser]);
            setSearchTerm('');
        }catch(error){
            console.error('Error adding users:', error);
        }
    };

      const handleRemoveUser = async (userId) => {
        try {
          await removeUserFromBoard(boardId, userId);
          setUsers(users.filter(user => user.id !== userId)); // Menghapus user dari state
        } catch (error) {
          console.error('Error removing user:', error);
        }
      };
    
      const handleSelectUser = async (userId) => {
        try {
          const selectedUser = await selectUserAndAddToBoard(boardId, userId);
          setUsers([...users, selectedUser]); // Menambahkan user ke board
        } catch (error) {
          console.error('Error selecting and adding user:', error);
        }
      };

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !users.some(boardUser => boardUser.id === user.id) // Hindari duplikasi
    );

    //COUNT TOTAL ASSIGNM BOARD
        useEffect(()=>{
            const fetchData = async ()=>{
                try{
                    const data = await getAssignCountForBoard(boardId);
                    setUserCount(data.user_count);
                }catch(error){
                    console.error('Failed to fetch user count:', error);
                }
            };
            if(boardId){
                fetchData();
            }
        },[boardId]);
    //END COUNT TOTAL ASSIGNM BOARD


    //GENERATE FOR PROFILE
    //rofile users
    const generateProfileInitials = (name) =>{
        if(!name) return '';
        const nameParts = name.split(' ');
        const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
        return initials.slice(0,2);
    };

    //END GENERATE FOR PROFILE

    const handleStopPropagation = (event) =>{
        event.stopPropagation();
    }


      return (
        <div className='assgn-container'>
            {/* <h3>Users in Board {boardId}</h3> */}
            <div className='assgn-form'>
                {/* Input pencarian */}
                <LuSearch/>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                />
            </div>
            {/* Dropdown user berdasarkan pencarian */}
            <div className="lc" >
                    {searchTerm && (
                        <div className='list-cont' onClick={(event)=> handleStopPropagation(event)}>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div key={user.id} onClick={() => handleAddUser(user.id)} className='list-box'>
                                        <div className="user-photo">
                                            <span>{generateProfileInitials(user.username)}</span>
                                        </div>
                                        <div>
                                            {user.username}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'red', textAlign: 'center' }}>Username users tidak ada</p>
                            )}
                        </div>
                    )}
                </div>
            {/* jumlah assign  */}
            {/* <div> 
                {userCount !== null ? (
                    <p>Jumlah user: {userCount}</p>
                ) : (
                    <p>Loading...</p>
                )}
            </div> */}
            {/* jumlah assign  */}
            <div className='assgn-list'>
                {users.map(user =>(
                    <div key={user.id} className='assgn-user-box'>
                        <div className="left">
                            <div className="user-photo">
                                <span>{generateProfileInitials(user.username)}</span>
                            </div>
                            <p>{user.username}</p>
                        </div>
                        <button onClick={() => handleRemoveUser(user.id)}><AiOutlineDelete size={15}/></button>
                    </div>
                ))}
            </div>
            
        </div>
    );
}

export default Assignment