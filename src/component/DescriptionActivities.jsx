import React, {useEffect, useState} from 'react'
import '../style/DescriptionActivities.css'
import '../style/TextEditor.css';
import TextEditor from './TextEditor';
import PostComment from './PostComment';
import FileUpload from '../fiture/FileUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CardMarketingDetail from './CardMarketingDetail';
import CardMarketingDesign from './CardMarketingDesign';
import Checlist from '../fiture/Checlist';
import ChecklistTest from '../fiture/ChecklistTest';
import { getMarketingDataJoinCard, getMarketingDesignJoinCard } from '../services/Api';

const DescriptionActivities=({cardId})=> {
    const [descriptionActivities, setDescriptionActivities] = useState('description');
    const [activeButton, setActiveButton] = useState(null)
    //text editor
    const [editorContent, setEditorContent] = useState('');
    //state untuk marketing 
    const [marketingData, setMarketingData] = useState(null);
    const [isMarketingDesign, setIsMarketingDesign] = useState(false);

    

    //TEXT EDITOR
    useEffect(()=>{
        const savedContent = localStorage.getItem(`editorContent_${cardId}`);
        if(savedContent){
            setEditorContent(savedContent);
        }
    },[cardId]);

    const handleEditorChange = (content) =>{
        setEditorContent(content);
    }
    const handleSave = ()=>{
        localStorage.setItem(`editorContent_${cardId}`, editorContent);
        alert('Content saved to local storage');
    }
    //TEXT EDITOR

    const handleClick = (button) => {
        setActiveButton(button)
    }

    const handleCategoryClick = (category) => {
        setDescriptionActivities(category)
    }
    const renderContent = () => {
        switch(descriptionActivities){
            case 'description':
                return <div className='dc'>
                            <div className="description-content">
                                <TextEditor cardId={cardId}/>
                            </div>
                           {/* <div className="checklist-container">
                                <ChecklistTest cardId={cardId}/>
                           </div> */}
                        </div>
            // case 'comment':
            //     return <div>
            //                 <PostComment cardId={cardId}/>
            //             </div>
            case 'activities': 
                return <div>
                    <FileUpload cardId={cardId}/>
                </div>
            case 'data_marketing':
                return <div>
                           <CardMarketingDetail  cardId={cardId} />
                        </div>
            case 'data_marketing_design':
                return <div>
                    <CardMarketingDesign cardId={cardId} />
                </div>
            case 'checklist':
                return <div>
                    {/* <Checlist cardId={cardId}/> */}
                    <ChecklistTest cardId={cardId}/>
                </div>
            default:
                return null;

        }
    }

  return (
    <div className='desc-container'>
        <div className='desc-btn' style={{display:'flex', gap:'10px'}}>
            <button 
                className={activeButton === 'description' ? 'active': ''}
                onClick={()=> {handleCategoryClick('description'); handleClick('description');}}
            >
                    Description
            </button>
            {/* <button 
                className={activeButton === 'comment' ? 'active': ''}
                onClick={()=> {handleCategoryClick('comment'); handleClick('comment');}}  
            >
                Comment
            </button> */}
            <button 
                className={activeButton === 'activities' ? 'active': ''}
                onClick={()=> {handleCategoryClick('activities'); handleClick('activities');}}   
            >
                Activities
            </button>
            <button 
                className={activeButton === 'data_marketing' ? 'active': ''}
                onClick={()=> {handleCategoryClick('data_marketing'); handleClick('data_marketing');}}   
            >
                Data Marketing
            </button>
            <button 
                className={activeButton === 'data_marketing_design' ? 'active': ''}
                onClick={()=> {handleCategoryClick('data_marketing_design'); handleClick('data_marketing_design');}}   
            >
                Data Marketing Design
            </button>
            <button 
                className={activeButton === 'checklist' ? 'active': ''}
                onClick={()=> {handleCategoryClick('checklist'); handleClick('checklist');}}   
            >
                Checklist
            </button>
        </div>
        <hr  style={{width:'450px', border:'0.5px solid grey', marginLeft:'0', marginTop:'0'}}/>
        <div>
            {renderContent()}
        </div>
    </div>
  )
}

export default DescriptionActivities