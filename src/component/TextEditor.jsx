import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import '../style/TextEditor.css'
import { CiFileOn } from "react-icons/ci";
import { getCardDescriptions, updateCardDescriptions } from '../services/Api';

const TextEditor=({cardId})=> {
    const [editorContent, setEditorContent] = useState('')
    const [showEditor, setShowEditor] = useState(false);

    const handleShowEditor = () => {
        setShowEditor(!showEditor);
    }

    //mengambil/menampilkan descripsi saata komponen dimuat
    useEffect(()=>{
        const fetchDescription = async() =>{
            try{
                const data = await getCardDescriptions(cardId);
                setEditorContent(data.description);
            }catch(error){
                console.error('Failed to load description:', error);
            }
        };
        fetchDescription();
    },[cardId])

    const handleEditorChange = (content) => {
        setEditorContent(content);
    };
    
    //menyimpan deskripsi menggunakan api services
    const handleSaveDescription = async () =>{
        try{
            await updateCardDescriptions(cardId, editorContent);
            alert('Description saved successfully');
        }catch(error){
            alert('Failed to save description');
        }
    }

  return (
    <div className='te-c'>
        <h4>Description</h4>
        <div className="te-button">
            <button onClick={handleShowEditor}>
                <CiFileOn size={15} style={{marginRight:'5px'}}/>
                {showEditor ? 'Close Editor':'Show Editor'}
            </button>
            {showEditor && (
            <div className='editor-container'>
                <ReactQuill
                    value={editorContent}
                    onChange={handleEditorChange}
                    theme='snow'
                    modules={{
                        toolbar:[
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'], //tombol format teks
                            [{list: 'ordered'}, {list:'bullet'}],
                            [{indent:'-1'},{indent:'+1'}],
                            [{align: []}],
                            ['link', 'image'],
                            ['clean']//tombol untuk membersihkan format
                        ]
                    }}
                    formats={[
                        'header','bold','italic','underline','strike','list','bullet','indent','align','link','image'
                    ]}
                    placeholder='start typing here...'
                />
                <button onClick={handleSaveDescription} className='save-btn'>Save Content</button>
            </div>
        )}
        </div>
    </div>
  )
}

export default TextEditor


/*
const TextEditor=({cardId})=> {
    const [editorContent, setEditorContent] = useState('')
    const [showEditor, setShowEditor] = useState(false);

    const handleShowEditor = () => {
        setShowEditor(!showEditor);
    }


    useEffect(()=>{
        const savedContent = localStorage.getItem(`editorContent_${cardId}`);
        if(savedContent){
            setEditorContent(savedContent);
        }
    },[cardId]);
 
    const handleEditorChange = (content) =>{
        setEditorContent(content);
    }

    const handleSave =() =>{
        localStorage.setItem(`editorContent_${cardId}`, editorContent);
        alert('Content saved to local storage!')
    }

  return (
    <div className='te-c'>
        <h4>Description</h4>
        <div className="te-button">
            <button onClick={handleShowEditor}>
                <CiFileOn size={15} style={{marginRight:'5px'}}/>
                {showEditor ? 'Close Editor':'Show Editor'}
            </button>
            {showEditor && (
            <div className='editor-container'>
                <ReactQuill
                    value={editorContent}
                    onChange={handleEditorChange}
                    theme='snow'
                    modules={{
                        toolbar:[
                            [{ 'header': [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'], //tombol format teks
                            [{list: 'ordered'}, {list:'bullet'}],
                            [{indent:'-1'},{indent:'+1'}],
                            [{align: []}],
                            ['link', 'image'],
                            ['clean']//tombol untuk membersihkan format
                        ]
                    }}
                    formats={[
                        'header','bold','italic','underline','strike','list','bullet','indent','align','link','image'
                    ]}
                    placeholder='start typing here...'
                />
                <button onClick={handleSave} className='save-btn'>Save Content</button>
            </div>
        )}
        </div>
    </div>
  )
}

export default TextEditor
*/