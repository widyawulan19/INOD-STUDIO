import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import '../style/TextEditor.css'

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
    <div>
        <button onClick={handleShowEditor}>{showEditor ? 'Show Editor':'Close Editor'}</button>
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
  )
}

export default TextEditor