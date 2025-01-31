import React, { useState } from 'react'
import { uploadFile } from '../services/Api';
import '../style/DescriptionActivities.css'

const FileUpload=({cardId})=> {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        if(event.target.files && event.target.files > 0){
            setSelectedFile(event.target.files[0]);
        }else{
            console.warn('')
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

  return (
    <div className='file-upload-container'>
        <h4>Attachments</h4>
        <div className="file-upload-content">
            <input type="file" className='input' onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload File</button>
        </div>
    </div>
  )
}

export default FileUpload