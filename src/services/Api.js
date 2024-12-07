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
export const createBoard = (data) => axios.post(`${API_URL}/boards`, data);
export const updateBoard = (id, data) => axios.put(`${API_URL}/boards/${id}`, data);
export const deleteBoard = (id) => axios.delete(`${API_URL}/boards/${id}`);
export const getBoardById = (id) => axios.get(`${API_URL}/boards/${id}`);
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

export const getBoardByWorkspace = (workspace_id) => axios.get(`${API_URL}/boards-workspace`, workspace_id);
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

// List APIs
export const getAllLists = () => axios.get(`${API_URL}/lists`);
export const getLists = (boardId) => axios.get(`${API_URL}/lists?board_id=${boardId}`);
export const createList = (data) => axios.post(`${API_URL}/lists`, data);
export const updateList = (id, data) => axios.put(`${API_URL}/lists/${id}`, data);
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
export const getCardById = (id) => axios.get(`${API_URL}/cards/${id}`);
export const archiveCard = async(id)=>{
    try{
        const response = await axios.post(`${API_URL}/cards/archive/${id}`);
        return response.data;
    }catch(error){
        console.error('Error while archiving card data:', error);
        throw error;
    }
}
//Duplicate card
export const duplicateCard = async (cardId, {list_id}) =>{
    try{
        const response = await axios.post(`${API_URL}/cards/duplicate/${cardId}`,{
            list_id,
        })
        // return response.data;
        return response;
    }catch(error){
        console.error('Failed to duplicate card:', error);
        throw error;
    }
}
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


// Card Description APIs
export const createCardDescription = (data) => axios.post(`${API_URL}/card-description`, data);
export const getAllCardDescriptions = () => axios.get(`${API_URL}/card-description`);
export const updateCardDescription = (id, data) => axios.put(`${API_URL}/card-description/${id}`, data);
export const deleteCardDescription = (id) => axios.delete(`${API_URL}/card-description/${id}`);
export const getCardDescriptionById = (id) => axios.get(`${API_URL}/card-description/${id}`);

// Labels APIs
export const getlabel = () => axios.get(`${API_URL}/labels`);
export const createLabel = (data) => axios.post(`${API_URL}/labels`, data);
export const updateLabel = (id, data) => axios.put(`${API_URL}/labels/${id}`, data);
export const deleteLabel = (id) => axios.delete(`${API_URL}/labels/${id}`);
export const getLabelById = (id) => axios.get(`${API_URL}/labels/${id}`);

// Card Labels APIs
export const getCardLabels = (cardId) => axios.get(`${API_URL}/cards-labels/${cardId}/labels`);
export const updateCardLabels = (cardId, labels) => axios.put(`${API_URL}/cards/${cardId}/labels`, { labels });


//cover 
export const getAllCover = () => axios.get(`${API_URL}/cover`);
export const getCoverById = (id) => axios.get(`${API_URL}/cover/${id}`);
export const updateCover = (id,data) => axios.put (`${API_URL}/cover/${id}`, data);
export const createCover = (data) => axios.post(`${API_URL}/cover`, data);
export const deleteCover = (id) => axios.delete(`${API_URL}/cover/${id}`);

//marketing
export const getAllMarketingData = () => axios.get(`${API_URL}/marketing_data`);
export const updateMarketingData = (id, data) => axios.put(`${API_URL}/marketing_data/${id}`, data);
export const createMarketingData = (data) => axios.post(`${API_URL}/marketing_data`, data);
export const deleteMarektingData = (id) => axios.delete(`${API_URL}/marketing_data/${id}`);
export const getDataMarketingById = (id) => axios.get(`${API_URL}/marketing_data/${id}`);

//data marketing

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

//employees
export const getAllDataEmployee = () => axios.get(`${API_URL}/employees`);
export const getDataEmployeeById = (id) => axios.get(`${API_URL}/employees/${id}`);
export const updateDataEmployee = (id, data) => axios.put(`${API_URL}/employees/${id}`, data);
export const createDataEmployee = (data) => axios.post(`${API_URL}/employees`, data);
export const deleteDataEmployee = (id) => axios.delete(`${API_URL}/employees/${id}`); 

//work schedule
export const getEmployeeScheduleById = (id) => axios.get(`${API_URL}/employees/${id}/schedule`);

