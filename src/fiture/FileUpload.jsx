import React, { useState } from 'react'
import { uploadFile } from '../services/Api';

const FileUpload=({cardId})=> {
    const [selectedFile, setSelectedFile] = useState(null);
    // const [uploadMessage, setUploadMessage] = useState('');

    // const handleFileChange = (event) => {
    //     setSelectedFile(event.target.files[0]);
    // }
    const handleFileChange = (event) => {
        if(event.target.files && event.target.files > 0){
            setSelectedFile(event.target.files[0]);
        }else{
            console.warn('No file selected.')
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        try {
            const response = await uploadFile(cardId, selectedFile); // Call the API service
            console.log("File uploaded successfully:", response);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // const handleFileUpload = async (event) => {
    //     event.preventDefault();
    //     if(!selectedFile){
    //         setUploadMessage('Please select a file to upload');
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append('file', selectedFile);

    //     try{
    //         const response = await uploadFile(cardId, selectedFile);
    //         setUploadMessage('file uploaded successfully');
    //         console.log('Upload response:', response);
    //     }catch(error){
    //         setUploadMessage('Error uploading file');
    //         console.error('Error uploading file', error);
    //     }
    // }
  return (
    <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Upload File</button>
    </div>
  )
}

export default FileUpload