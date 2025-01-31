import React, { useEffect, useState } from 'react'
import { getBoardByWorkspace } from '../services/Api';

const TestingFitur=({workspaceId})=> {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const fetchBoards  = async()=>{
      setLoading(true);
      try{
        const data = await getBoardByWorkspace(workspaceId);
        setBoards(data);
        setError(null);
      }catch(error){
        setError('Failed to fetch boards. please try again later.');
      }finally{
        setLoading(false);
      }
    }
    if(workspaceId){
      fetchBoards();
    }
  },[workspaceId]);

  if(loading) return <p>loading...</p>
  if(error) return <p>{error}</p>
  return (
    <div>
      <h3>Boards</h3>
      {boards.length > 0 ? (
        boards.map((board) => (
          <div key={board.id}>
            <h4>{board.name}</h4>
            <p>{board.description}</p>
            <p>Assigned Users:</p>
            {board.users && board.users.length > 0 ? (
              board.users.map((user) => (
                <div key={user.id}>
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <p>No users assigned</p>
            )}
          </div>
        ))
      ) : (
        <p>No boards available</p>
      )}
    </div>
  )
}

export default TestingFitur

// import React, { useState } from 'react'
// import { uploadImage } from '../services/Api'

// const TestingFitur=()=> {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [uploadedImageUrl, setUploadedImageUrl] = useState('');

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert('Please select a file first!');
//       return;
//     }

//     try {
//       const result = await uploadImage(selectedFile);
//       console.log('Upload Result:', result);

//       const imageUrl = result.image.image_url;
//       setUploadedImageUrl(imageUrl);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Failed to upload image');
//     }
//   };

//   return (
// <div>
//       <h1>Upload and Display Image</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload Image</button>

//       {uploadedImageUrl && (
//         <div>
//           <h2>Uploaded Image:</h2>
//           <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />
//         </div>
//       )}
//     </div>
//   )
// }

// export default TestingFitur