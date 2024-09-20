import axios from "axios";

const API_URL = 'http://localhost:3002/api';

// Workspace APIs
export const getWorkspaces = () => axios.get(`${API_URL}/workspaces`);
export const createWorkspace = (data) => axios.post(`${API_URL}/workspaces`, data);
export const updateWorkspace = (id, data) => axios.put(`${API_URL}/workspaces/${id}`, data);
export const deleteWorkspace = (id) => axios.delete(`${API_URL}/workspaces/${id}`);
export const getWorkspaceById = (id) => axios.get(`${API_URL}/workspaces/${id}`);

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

// List APIs
export const getLists = (boardId) => axios.get(`${API_URL}/lists?board_id=${boardId}`);
export const createList = (data) => axios.post(`${API_URL}/lists`, data);
export const updateList = (id, data) => axios.put(`${API_URL}/lists/${id}`, data);
export const deleteList = (id) => axios.delete(`${API_URL}/lists/${id}`);
export const getListById = (id) => axios.get(`${API_URL}/lists/${id}`);
//getListsCountByBoard
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


/* contoh conver menggunakan axios pada frontend

import axios from 'axios';

// Definisikan URL dasar API
const API_URL = 'http://url-backend-kamu/api'; // Ganti dengan URL API backend kamu

// 1. Mendapatkan semua board
export const getAllBoards = () => {
    return axios.get(`${API_URL}/boards`);
};

// 2. Membuat board baru
export const createBoard = (data) => {
    // `data` adalah objek yang berisi detail board baru: { name, description, user_id, workspace_id }
    return axios.post(`${API_URL}/boards`, data);
};

// 3. Mendapatkan board berdasarkan ID
export const getBoardById = (id) => {
    return axios.get(`${API_URL}/boards/${id}`);
};

// 4. Memperbarui board berdasarkan ID
export const updateBoard = (id, data) => {
    // `data` adalah objek yang berisi data yang akan diperbarui: { name, description }
    return axios.put(`${API_URL}/boards/${id}`, data);
};

// 5. Menghapus board berdasarkan ID
export const deleteBoard = (id) => {
    return axios.delete(`${API_URL}/boards/${id}`);
};

// 6. Mendapatkan jumlah board berdasarkan workspace ID
export const getBoardCountByWorkspace = (workspaceId) => {
    return axios.get(`${API_URL}/board-count`, {
        params: {
            workspace_id: workspaceId,
        }
    });
};

*/