import axios from "axios";

const API_URL = 'http://localhost:3002/api';

//upload file
export const uploadFile = async (cardId, file) => {
    try{
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/app/upload/${cardId}`, formData, {
            headers:{
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }catch (error){
        console.error('Error while uploading file:',error);
        throw error;
    }
}

// Workspace APIs 
export const getWorkspaces = () => axios.get(`${API_URL}/workspaces`);
export const createWorkspace = (data) => axios.post(`${API_URL}/workspaces`, data);
// export const updateWorkspace = (id, data) => axios.put(`${API_URL}/workspaces/${id}`, data);
export const updateWorkspace = (id, data) => axios.put(`${API_URL}/workspaces/${id}`,{
    name: data.name,
    description: data.description,
})
export const deleteWorkspace = (id) => axios.delete(`${API_URL}/workspaces/${id}`);
export const getWorkspaceById = (id) => axios.get(`${API_URL}/workspaces/${id}`);
export const updateWorkspaceBg = async (id, bgImage) => {
    try{
        const response = await axios.put(`${API_URL}/workspace/${id}/background`, {bg_image:bgImage,})
        return response.data;
    }catch(error){
        console.error('Failed to update backgrounf', error)
        throw error;
    }
}
export const archiveWorkspace = async (id) => {
    try {
        const response = await axios.post(`${API_URL}/workspace/archive/${id}`);
        return response.data; // Return the response data to the caller
    } catch (error) {
        console.error('Error while archiving workspace:', error);
        throw error; // Rethrow the error for handling in the caller
    }
};



//archive 
export const getArchiveWorkspace = () => axios.get(`${API_URL}/workspace/archives`);
export const getArchiveBoard = () => axios.get(`${API_URL}/board/archives`);
export const getArchiveList = () => axios.get(`${API_URL}/list/archives`);
export const getArchiveCard = () => axios.get(`${API_URL}/card/archives`);
export const getArchiveMarketing = () => axios.get(`${API_URL}/marketing/archive`);

//image
export const getAllImage = () => axios.get(`${API_URL}/images`);
export const getImageById = (id) => axios.get(`${API_URL}/images/${id}`);



//update backgorund board
// export const updateBoardBackground = (boardId, imageId) => {
//     return axios.put(`${API_URL}/boards/${boardId}/background`,{image_id: imageId});
// }
export const updateBoardBackground = (boardId, imageId) => {
    return axios.put(`http://localhost:3002/api/boards/${boardId}/background`,{
        image_Id: parseInt(imageId, 10)
    })
    .then(response=> response.data)
    .catch(error =>{
        console.error('Error memperbarui latarbelakang board:', error)
        throw error;
    })
} 

// Board APIs
export const getBoard = (workspaceId) => axios.get(`${API_URL}/boards?workspace_id=${workspaceId}`);
// export const getBoard = (workspaceId) => {
//     if (!workspaceId) {
//         console.error("workspaceId is required but not provided");
//         return Promise.reject(new Error("workspaceId is required"));
//     }
//     return axios.get(`${API_URL}/boards?workspace_id=${workspaceId}`);
// };
export const createBoard = (data) => axios.post(`${API_URL}/boards`, data);
export const updateBoard = (id, data) => axios.put(`${API_URL}/boards/${id}`, data);
export const deleteBoard = (id) => axios.delete(`${API_URL}/boards/${id}`);
// export const getBoardById = (id) => axios.get(`${API_URL}/boards/${id}`);
export const getBoardById = (boardId) => axios.get(`${API_URL}/boards/${boardId}`);
export const getBoardCountByWorkspace = (workspaceId) => {
    return axios.get(`${API_URL}/board-count`,{
        params:{
            workspace_id:workspaceId
        }
    })
}
export const getCardCountByLists = (listId) => {
    return axios.get(`${API_URL}/card-count`,{
        params:{
            list_id:listId
        }
    })
}
export const archiveBoard = async (id) =>{
    try{
        const response = await axios.post(`${API_URL}/boards/archive/${id}`);
        return response.data;
    }catch(error){
        console.error('Error while archiving board:', error);
        throw error;
    }
}
// export const getBoardByWorkspace = (workspaceId) => axios.get(`${API_URL}/boards`, workspaceId)

// export const getBoardByWorkspace = (workspace_id) => axios.get(`${API_URL}/boards-workspace`, workspace_id);
export const getBoardByWorkspace = async(workspaceId)=>{
    try{
        const response = await axios.get(`${API_URL}/boards-workspace`,{
            params: {workspace_id:workspaceId},
        });
        return response.data;
    }catch(error){
        console.error('Error fetching boards by workspace:', error);
        throw error;
    }
}
export const duplicateBoard = async (boardId, {workspace_id})=>{
    try{
        const response = await axios.post(`${API_URL}/boards/${boardId}/duplicate`, {
            workspace_id,
        });
        return response.data;
    }catch(error){
        console.error('Failed to duplicate board:', error);
        throw error;
    }
}

export const getBoardAssignCount = async (boardId) =>{
    try{
        const response = await axios.get(`${API_URL}/boards/${boardId}/assign-count`);
        return response.data;
    }catch(error){
        console.error('Error fetching assign count:', error);
        throw error;
    }
}

//'/api/board-users/:boardId/count'
export const getAssignCountForBoard = async (boardId)=>{
    try{
        const response = await axios.get(`${API_URL}/board-users/${boardId}/count`);
        return response.data;
    }catch(error){
        console.error('Error fetching board user count:', error);
        throw error;
    }
}

//memperbarui/mengupdate assign board
export const updateBoardAssignment = async(boardId, assign) =>{
    try{
        const response = await fetch(`${API_URL}/boards/${boardId}/assign`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({assign}),
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update board assignment');
        }
        return await response.json();
    }catch(error){
        console.error('API error (updateBoardAssignment):', error);
        throw error;
    }
}

//fungsi untuk menghapus user didalam lists assign
export const removeUserFromBoardAssignment = async (boardId, userId) =>{
    try {
        const response = await fetch(`${API_URL}/boards/${boardId}/remove-assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Ensure userId is properly passed
        });
  
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove user from board assignment');
        }
  
        return await response.json();
    } catch (error) {
        console.error('API Error (removeUserFromBoardAssignment):', error); // Debug any API call errors
        throw error;
    }
}

//fungsi untuk mencari semua pengguna
export const searchUsers = async (query) => {
    try{
       const response = await axios.get(`${API_URL}/users`,{
        params: query ? { query } : {}
       });
       return response.data;
    }catch(error){
        console.error('Error fetching users:', error);
        throw error;
    }
  }

//BOARD_USERS
//1. menambahkan user ke board 
///api/board-users/:boardId/assign'
export const addUserToBoard = async (boardId, userId)=>{
    try{
        const response = await axios.post(`${API_URL}/board-users/${boardId}/assign`, {userId});
        return response.data;
    }catch(error){
        console.error('Error adding user to board:', error);
        throw error;
    }
}

//2. menampilkan semua user yang terdaftar di board
///api/board-users/:boardId/users
export const getUsersInBoard = async(boardId) =>{
    try{
        const response = await axios.get(`${API_URL}/board-users/${boardId}/users`);
        return response.data;
    }catch(error){
        console.error('Error retrieving users from board:', error);
        throw error;
    }
};

//'/api/board-users/:boardId/assign/:userId'
//3. menghapus user dari board
export const removeUserFromBoard = async(boardId, userId) =>{
    try{
        const response = await axios.delete(`${API_URL}/board-users/${boardId}/assign/${userId}`);
        return response.data;
    }catch(error){
        console.error('Error removing user from board:', error);
        throw error;
    }
}

//4. memilih user dan menambahkannya ke board (dek duplikasi)
///api/:boardId/select-user'
export const selectUserAndAddToBoard = async (boardId, userId) =>{
    try{
        const response = await axios.post(`${API_URL}/${boardId}/select-user`, {userId});
        return response.data;
    }catch(error){
        console.error('Error adding user to board:', error);
        throw error;
    }
}

//END BOARD_USERS



// List APIs
export const getAllLists = () => axios.get(`${API_URL}/lists`);
export const getLists = (boardId) => axios.get(`${API_URL}/lists?board_id=${boardId}`);
export const createList = (data) => axios.post(`${API_URL}/lists`, data);
// export const updateList = (id, data) => axios.put(`${API_URL}/lists/${id}`, data);
//update list test 1
export const updateTestList = (id, data) => axios.put(`${API_URL}/list-update/${id}`, data);
export const updateList = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/lists/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error in updateList API:', error);
        throw error;
    }
};
export const deleteList = (id) => axios.delete(`${API_URL}/lists/${id}`); 
export const getListById = (id) => axios.get(`${API_URL}/lists/${id}`);
export const archiveLists = async (id) =>{
    try{
        const response = await axios.post(`${API_URL}/lists/archive/${id}`);
        return response.data;
    }catch(error){
        console.error('Error while archiving list:', error);
        throw error;
    }
}

//duplicate list
export const duplicateList = async (listId, {board_id}) => {
    try{
        const response = await axios.post(`${API_URL}/lists/${listId}/duplicate-to-board`,{
            board_id,
        })
        return response.data;
    }catch(error){
        console.error('Failed to duplicate list:', error);
        throw error;
    }
}

export const getListsCountByBoard = (boardId) => { return axios.get(`${API_URL}/list-count/${boardId}`)}
// export const getListsCountByBoard = (boardId) => {
//     return axios.get(`${API_URL}/list-count`,{
//         params:{
//             board_id:boardId
//         }
//     })
// }

// Card APIs
export const getCards = (listId) => axios.get(`${API_URL}/cards?list_id=${listId}`);
export const createCard = (data) => axios.post(`${API_URL}/cards`, data);
export const updateCard = (id, data) => axios.put(`${API_URL}/cards/${id}`, data);
export const deleteCard = (id) => axios.delete(`${API_URL}/cards/${id}`);
// export const getCardById = (id) => axios.get(`${API_URL}/cards/${id}`);
export const archiveCard = async(id)=>{
    try{
        const response = await axios.post(`${API_URL}/cards/archive/${id}`);
        return response.data;
    }catch(error){
        console.error('Error while archiving card data:', error);
        throw error;
    }
}

export const getCardById = async (id) => {
    try{
        const response = await axios.get(`${API_URL}/cards/${id}`);
        const data = response.data;

        //menangani jika data ada
        if(data){
            const cardDetails = {
                id: data.card_id,
                title: data.title,
                description: data.description,
                position: data.position,
                due_date: data.due_date,
                create_at: data.create_at,
                cover: {
                    id: data.cover_id,
                    name: data.cover_name,
                    image_url: data.cover_image_url,
                    color_code: data.cover_color_code
                },
                labels: data.labels.map((label) => ({
                    id: label.id,
                    name: label.name,
                    color: label.color,
                    bg_color: label.bg_color
                }))
            }
            return cardDetails;
        }else{
            throw new Error('Card not found');
        }
    }catch(error){
        console.error('Error while fetching card data:', error);
        throw new Error('Error retriving card data');
    }
};

//Duplicate card
//new card duplicate
export const duplicateCard = async (cardId, listId) => {
    try {
        //memastikan listId adalah tipe data integer
        // Pastikan listId adalah tipe data integer
        const listIdInt = parseInt(listId, 10);

        // Cek jika listId tidak valid
        if (isNaN(listIdInt)) {
            throw new Error('Invalid List ID');
        }

        const response = await axios.post(`${API_URL}/cards/duplicate/${cardId}`, {
            // cardId,
            list_id: listIdInt,  // Kirimkan hanya integer selectedListId
        });

        // Mengembalikan data kartu yang baru dibuat
        return response.data;
    } catch (error) {
        console.error('Failed to duplicate card:', error.message);

        // Lemparkan error yang lebih terformat untuk penanganan yang lebih baik
        throw new Error(error.response?.data?.message || 'Failed to duplicate card');
    }
};

//update due_date berdasarkan custom Date
export const updateDueDate = async(cardId, due_date)=>{
    try{
        const response = await fetch(`${API_URL}/cards/${cardId}/due-date`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ due_date }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update due date: ${response.statusText}`);
        }

        return await response.json();
    }catch(error){
        console.error('Error updating due date:', error);
        throw error;
    }
}

//menambahkan cover id yang dipilih ke database menggunakan id
// api/cards.js
export const updateCoverAndRefresh = async (cardId, coverId) => {
    try {
        const response = await fetch(`${API_URL}/cards/${cardId}/cover`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cover_id: coverId }),
        });

        if (response.ok) {
            const updatedCard = await response.json();
            return updatedCard; // Kembalikan data terbaru
        } else {
            throw new Error('Failed to update cover');
        }
    } catch (error) {
        console.error('Error updating cover:', error);
        throw error;
    }
};


//get card with card_description
export const getCardWithDescription = (id) => axios.get(`${API_URL}/cards/${id}/description`, id);

//buat card + card Description
export const createCardWithDescription = async (data) => axios.post(`${API_URL}/cards/createWithDescription`, data);
//get card description by card id
export const getCardDetails = async (cardId) => {
    try{
        const response = await axios.get(`${API_URL}/cards/${cardId}/detail`);
        return response.data;
    }catch(error){
        console.error('Error fetching card details:', error);
        throw error;
    }
}
export const getCardDescription = async (cardId) => {
    try{
        const response = await axios.get(`${API_URL}/cards/${cardId}/description`);
        return response.data;
    }catch(error){
        console.error('Error fetching description data');
        throw error;
    }
}

//CARD_USERS
// 1. assign user to card 
export const assignUserToCard = async(cardId, userId) => {
    try{
        const response = await axios.post(`${API_URL}/card-users`, {card_id: cardId, user_id:userId});
        return response.data;
    }catch(error){
        console.error('Error assigning user to card');
        throw error;
    }
}

// 2. remove user form card
export const removeUserFromCard = async (card_Id, user_Id) =>{
    try{
        const response = await axios.delete(`${API_URL}/card-users/${Number(card_Id)}/${user_Id}`);
        return response.data;
    }catch(error){
        console.error('Error removing user from card');
        throw error;
    }
}

// 3. get assigned users for a card 
export const getAssignedUsersForCard = async(cardId) =>{
    try{
        const response = await axios.get(`${API_URL}/assign-card/${cardId}`)
        return response.data;
    }catch(error){
        console.error('Error fetching assigned users');
        throw error;
    }
}

//4. get cards assigned to a user 
export const getCardsAssignedToUser = async(userId) =>{
    try{
        const response = await axios.get(`${API_URL}/assign-user/${userId}`);
        return response.data;
    }catch(error){
        console.error('Error fetching cards for users')
        throw error;
    }
}

// 5.get total all assigned users for each card 
export const getTotalUsersPerCard = async()=>{
    try{
        const response = await axios.get(`${API_URL}/total-assign-card`);
        return response.data;
    }catch(error){
        console.error('Error fetching total users per card');
        throw error;
    }
}

//6. fungsi untuk mendapatkan jumlah pengguna pada kartu tertentu
export const getUserCountByCard = async(card_id) =>{
    try{
        const response = await axios.get(`${API_URL}/total-assign-card/${card_id}`);
        return response.data;
    }catch(error){
        console.error('Error fetching user count');
        throw error;
    }
}
//7. menampilkan user bedasarkan card id
export const getUsersByCardId = async(cardId) =>{
    try{
        const response = await axios.get(`${API_URL}/card-users/${Number(cardId)}`);
        return response.data;
    }catch(error){
        console.error('Error fetching user for card:', error);
        throw error;
    }
}

//END_CARD_USERS


// Card Description APIs
export const createCardDescription = (data) => axios.post(`${API_URL}/card-description`, data);
export const getAllCardDescriptions = () => axios.get(`${API_URL}/card-description`);
export const updateCardDescription = (id, data) => axios.put(`${API_URL}/card-description/${id}`, data);
export const deleteCardDescription = (id) => axios.delete(`${API_URL}/card-description/${id}`);
export const getCardDescriptionById = (id) => axios.get(`${API_URL}/card-description/${id}`);

// // Labels APIs
// export const getlabel = () => axios.get(`${API_URL}/labels`);
export const createLabel = (data) => axios.post(`${API_URL}/labels`, data);
export const updateLabel = (id, data) => axios.put(`${API_URL}/labels/${id}`, data);
export const deleteLabel = (id) => axios.delete(`${API_URL}/labels/${id}`);
export const getLabelById = (id) => axios.get(`${API_URL}/labels/${id}`);


// Card Labels APIs
// export const getCardLabels = (cardId) => axios.get(`${API_URL}/cards-labels/${cardId}/labels`);
//menambahkan label ke cards
// export const updateCardLabels = (cardId, labels) => axios.put(`${API_URL}/cards/${cardId}/labels`, { labels });


export const getlabel = () => axios.get(`${API_URL}/labels`);

//menyimpan dan menampilkan pada cards
export const updateCardLabels = async (id, label_id) => {
    try {
        const response = await axios.put(`${API_URL}/cards/${id}/labels`, {
            label_id
        });
        return response.data; // Mengembalikan card yang telah diperbarui
    } catch (error) {
        console.error("Error updating labels:", error);
        throw error;
    }
};

export const getCardLabels = (id) => axios.get(`${API_URL}/cards/${id}/label`);

// Menyimpan label yang dipilih pada kartu card_labels
export const saveCardLabels = async (id, label_id) => {
    try {
      const response = await axios.post(`${API_URL}/cards/${id}/labels`, { label_id: label_id });
      return response.data; // Mengembalikan data label yang baru disimpan
    } catch (error) {
      console.error('Error saving card labels:', error);
      throw error;
    }
  };

//menghapus label pada card berdasarkan label_id
export const removeLabelFromCard = async (id, label_id) => {
    try {
        const response = await axios.delete(`${API_URL}/cards/${id}/label`, {
            data: { label_id }, // Mengirim label_id dalam body
            headers: { 'Content-Type': 'application/json' }, // Tambahkan header JSON jika diperlukan
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting card label:', error);
        throw error;
    }
};

// api.js or a similar file for handling API calls



// Delete label from card
export const deleteLabelFromCard = async (cardId, labelId) => {
    try {
        const response = await axios.delete(`${API_URL}/${cardId}/card-labels`, {
            data: {
                card_id: cardId,
                label_id: labelId,
            },
        });
        return response;
    } catch (error) {
        console.error('Error deleting label from card:', error);
        throw error;
    }
};

//   export default deleteCardLabel;
  


//menampilkan label dari tabel cards
export const getCardLabelsFromCards = (id) => axios.get(`${API_URL}/cards/${id}/label`)


//cover 
export const getAllCover = () => axios.get(`${API_URL}/cover`);
export const getCoverById = (id) => axios.get(`${API_URL}/cover/${id}`);
export const updateCover = (id,data) => axios.put (`${API_URL}/cover/${id}`, data);
export const createCover = (data) => axios.post(`${API_URL}/cover`, data);
export const deleteCover = (id) => axios.delete(`${API_URL}/cover/${id}`);
//fungsi untuk mengunggah gambar untuk cover 
export const uploadImage = async (file) =>{
    const formData = new FormData();
    formData.append('image', file);

    try{
        const response = await axios.post(`${API_URL}/upload-image`, formData,{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data;
    }catch(error){
        console.error('Error uploading image:', error);
        throw error;
    }
}

//marketing
export const getAllMarketingData = () => axios.get(`${API_URL}/marketing_data`);
export const updateMarketingData = (id, data) => axios.put(`${API_URL}/marketing_data/${id}`, data);
export const createMarketingData = (data) => axios.post(`${API_URL}/marketing_data`, data);
export const deleteMarektingData = (id) => axios.delete(`${API_URL}/marketing_data/${id}`);
export const getDataMarketingById = (id) => axios.get(`${API_URL}/marketing_data/${id}`);
export const getDataMarketingByCardId = (id) => axios.get(`${API_URL}/marketing/card/${id}`);

//data marketing
export const getMarketingDataJoinCard = async(cardId) => await axios.get(`${API_URL}/cards-marketing/${cardId}`);
export const getAllDataMarketing = () => axios.get(`${API_URL}/marketing`);
export const createCardFromMarketing = async (marketing_id,listId)=>{
    const response = await axios.post(`${API_URL}/create-card-from-marketing`,{
        marketing_id,
        listId
    })
    return response.data;
};

export const updateDataMarketing = (marketing_id, data) => axios.put(`${API_URL}/marketing/${marketing_id}`, data);
export const createDataMarketing = (data) => axios.post(`${API_URL}/marketing`, data);
export const getMarketingDataById = (marketing_id) => axios.get(`${API_URL}/marketing/${marketing_id}`);
export const deleteDataMarketing = (marketing_id) => axios.delete(`${API_URL}/marketing/${marketing_id}`);
//mengambil data marketing yang memiliki card_id yang sama
export const getMarketingDataByCardId = async (cardId) =>{
    try{
        const response = await fetch(`${API_URL}${cardId}`);
        if(!response.ok){
            throw new Error('Data marketing tidak ditemukan');
        }
        return await response.json();
    }catch(error){
        throw new Error(error.message);
    }
}
export const archiveMarketing = async (marketing_id) =>{
    try{
        const response = await axios.post(`${API_URL}/marketing/archive/${marketing_id}`);
        return response.data;
    }catch(error){
        console.error('Error while archiving marketing:', error);
        throw error;
    }
}

//marketing design
export const getAllMarketingDesign = async() => await axios.get(`${API_URL}/marketing-design`);
export const getMarketingDesignById = async(id) => await axios.get(`${API_URL}/marketing-design/${id}`);
export const createMarketingDesign = async(data) => await axios.post(`${API_URL}/marketing-design`, data);
export const updateMarketingDesign = async(id, data) => await axios.put(`${API_URL}/marketing-design/${id}`,data);
export const deleteMarketingDesign = async(id) => await axios.delete(`${API_URL}/marketing-design/${id}`);
export const archiveMarketingDesign = async(id, archiveData) => await axios.post(`${API_URL}/marketing-design/${id}/archive`, archiveData);
export const createCardFromMarketingDesign = async(marketingDesignId, listId)=> await axios.post(`${API_URL}/marketing-design/create-card-marketing-design`,{
    marketing_design_id: marketingDesignId,
    listId
})
export const getMarketingDesignJoinCard = async(cardId) => await axios.get(`${API_URL}/cards-marketing-design/${cardId}`);


//end marketing design

//employees
export const getAllDataEmployee = () => axios.get(`${API_URL}/employees`);
export const getDataEmployeeById = (id) => axios.get(`${API_URL}/employees/${id}`);
export const updateDataEmployee = (id, data) => axios.put(`${API_URL}/employees/${id}`, data);
export const createDataEmployee = (data) => axios.post(`${API_URL}/employees`, data);
export const deleteDataEmployee = (id) => axios.delete(`${API_URL}/employees/${id}`); 

//data_employees
export const getAllEmployeeData = () => axios.get(`${API_URL}/data-employees`);
export const getEmployeDataById = (userId) => axios.get(`${API_URL}/data-employees/${userId}`);
export const createEmployeeData = (employeeData) => axios.post(`${API_URL}/data-employees`, employeeData);
export const updateEmployeeData = (userId, employeeData) => axios.put(`${API_URL}/data-employees/${userId}`, employeeData);
export const deleteEmployeeData = (userId) => axios.delete(`${API_URL}/data-employees/${userId}`);

//work schedule
export const getEmployeeScheduleById = (id) => axios.get(`${API_URL}/employees/${id}/schedule`);


//api for testing cover on postgre
export const getAllExapleCover = () => axios.get(`${API_URL}/label-test`);
 

//save cover to card
// export const saveCoverToCard = async (id, coverId) => {
//     try {
//       const response = await axios.put(`${API_URL}/cards/${cardId}/cover`, { cover_id: coverId });
//       return response.data; // Mengembalikan response jika berhasil
//     } catch (error) {
//       console.error('Error saving cover:', error);
//       throw error; // Menangani error jika API gagal
//     }
//   };

//image upload
export const getAllImageUpload = () => axios.get(`${API_URL}/upload-images`);
export const getImageUploadById = (image_id) => axios.get(`${API_URL}/upload-images/${image_id}`);


export const saveCoverToCard = async (id, coverId) => {
    console.log('Saving cover for card:', { id, coverId }); // Log nilai id dan coverId
    try {
      const response = await axios.put(`${API_URL}/cards/${id}/cover`, {
        cover_id: coverId,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cover:', error);
      throw new Error('Failed to update cover');
    }
  };

export const saveImageToCard = async (id, imageId) =>{
    console.log('Saving image for card:', { id, imageId }); // Log nilai id dan
    try{
        const response = await axios.put(`${API_URL}/cards/${id}/image`, {
            image_id: imageId,
        });
        return response.data;
    }catch(error){
        console.error('Error updating cover using image:', error);
        throw new Error('Failed to update cover');
    }
}


//remove cover form card
export const removeCover = async(cardId)=>{
    try{
        const response = await axios.put(`${API_URL}/cards/${cardId}/remove-cover`)
        return response.data;
    }catch(error){
        console.error('Failed to remove cover:', error);
        throw error;
    }
}

//covers for example
export const getCoversByImageUrl = () => axios.get(`${API_URL}/covers/image-url`);
export const getCoversByColorCode = () => axios.get(`${API_URL}/covers/color-code`);
export const getCoversByUploadLink = () => axios.get(`${API_URL}/covers/upload-link`);


//covers
export const getNewAllCovers = () => axios.get(`${API_URL}/cover-cards`);

//selectAndSaveCover
// export const selectAndSaveCover = async (cardId, cover_id) =>{
//     try{
//         await axios.put(`${API_URL}/cards/${cardId}/cover`, { cover_id }); // Menggunakan cover_id
//         console.log('Cover successfully saved to card', { cardId, cover_id });
//     }catch(error){
//         console.error('Error saving cover to card:', error);
//         throw error;
//     }
// }
export const selectAndSaveCover = async (cardId, coverId) => {
    try {
        await axios.put(`${API_URL}/cards/${cardId}/cover`,  { cover_id: coverId });
        console.log('Cover successfully saved to card', { cardId, coverId });
    } catch (error) {
        console.error('Error saving cover to card:', error);
        throw error;
    }
};

export const getSelectedCoverForCard = async(cardId)=>{
    try{
        const response = await axios.get(`${API_URL}/cards/${cardId}/cover`);
        return response.data;
    }catch(error){
        console.error('Error getting selected cover for card:', error);
        throw error;
    }
}

// API TETX EDITOR DESCRIPTION 
export const createCardDescriptions = async (card_id, description) =>{
    try {
        const response = await axios.post(
            `${API_URL}/card-descriptions/${card_id}`,
            { description: encodeURIComponent(description) }, // Pastikan teks aman dikirim
            { headers: { 'Content-Type': 'application/json' } } // Pastikan JSON format dikirim
        );
        return response.data;
    } catch (error) {
        console.error('Error adding description:', error);
        throw error;
    }
}


export const getCardDescriptions = async(card_id)=>{
    try{
        const respons = await axios.get(`${API_URL}/card-descriptions/${card_id}`);
        return respons.data;
    }catch(error){
        console.error('Error fetching description:', error);
        throw error;
    }
};

export const getAllCardDescriptionData = () => axios.get(`${API_URL}/card-descriptions`)

export const updateCardDescriptions = async(card_id, description)=>{
    try{
        const respons = await axios.put(`${API_URL}/card-descriptions/${card_id}`, {description});
        return respons.data;
    }catch(error){
        console.error('Error updating description:', error);
        throw error;
    }
}

export const deleteCardDescriptions = async(card_id) =>{
    try{
        const response = await axios.delete(`${API_URL}/card-descriptions/${card_id}`);
        return response.data;
    }catch(error){
        console.error('Error deleting description:', error);
        throw error;
    }
}
// END API TETX EDITOR DESCRIPTION 

//ENDPOIN CHECKLIST & CHECKLIST ITEM
//get checklist
export const getChecklists = async (card_id) => {
    try {
      const response = await axios.get(`${API_URL}/checklist/${card_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching checklists:', error);
      throw error;
    }
  };

//   '/api/checklist-items/:checklist_id'
  //get checklist_item
  export const getChecklistItems = async(checklist_id)=>{
    try{
        const response = await axios.get(`${API_URL}/checklist-items/${checklist_id}`);
        return response.data;
    }catch(error){
        console.error('Error fetching checklist items:', error);
        throw error;
    }
  }

  // Create a new checklist for a specific card
export const createChecklist = async (card_id, name) => {
    try {
      const response = await axios.post(`${API_URL}/checklist`, { card_id, name });
      return response.data;
    } catch (error) {
      console.error('Error creating checklist:', error);
      throw error;
    }
  };

  // Fungsi untuk menambahkan checklist item baru
  export const createChecklistItem = async (checklist_id, description) => {
    try {
        const response = await axios.post(`${API_URL}/checklist-items`, { 
            checklist_id, 
            description, 
            is_checked: false // Default false saat menambahkan item
        });
        return response.data;
    } catch (error) {
        console.error('Error creating checklist item:', error);
        throw error;
    }
};

//update checklist
export const updateChecklist = async (id, name) =>{
    try{
        const response = await axios.put(`${API_URL}/checklist/${id}`, {name});
        return response.data;
    }catch(error){
        console.error('Error updating checklist:', error);
        throw error;
    }
}

  // Update a checklist item
export const updateChecklistItem = async (itemId, isChecked) => {
    try {
      const response = await axios.put(`${API_URL}/checklist-items/${itemId}`, { is_checked: isChecked });
      return response.data;
    } catch (error) {
      console.error('Error updating checklist item:', error);
      throw error;
    }
  };
  
  // Delete a checklist item
export const deleteChecklistItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/checklist-items/${itemId}`);
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      throw error;
    }
  };
  
  // Delete a checklist
export const deleteChecklist = async (checklistId) => {
    try {
      await axios.delete(`${API_URL}/checklist/${checklistId}`);
    } catch (error) {
      console.error('Error deleting checklist:', error);
      throw error;
    }
  };
//END ENDPOIN CHECKLIST & CHECKLIST ITEM

//ENDPOIN tim disscus
//tabel message
//mendapatkan pesan untuk tim tertentu
export const getMessages = async(id)=>{
    try{
        const response = await axios.get(`${API_URL}/messages/${id}`);
        return response.data;
    }catch(error){
        console.error('Error fetching messages:', error);
        throw error;
    }
}

//mengirim pesan
export const sendMessage = async ({content, user_id, card_id}) =>{
    try{
        const response = await axios.post(`${API_URL}/messages`,{
            content,
            user_id,
            card_id
        })
        return response.data;
    }catch(error){
        console.error('Error sending message:', error.respons?.data || error.message);
        throw error.respons?.data || error.message;
    }
}
//end tabel message

// Fungsi untuk mendapatkan pesan dan balasannya berdasarkan cardId
export const getMessagesWithReplies = async(cardId)=>{
    try {
        const response = await axios.get(`${API_URL}/cards/${cardId}/messages`);
        return response.data; // Mengembalikan data pesan dan balasan dalam format JSON
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message);
        throw error.response?.data || error.message; // Melempar error untuk ditangani di frontend
      }
}

//preview pesan
export const fetchLinkPreview = async (url) =>{
    try{
        const response = await axios.post(`${API_URL}/preview`, {url});
        return response.data;
    }catch(error){
        console.error('Error fetching link preview', error);
        throw error;
    }
}
//ENDPOIN tim disscus
