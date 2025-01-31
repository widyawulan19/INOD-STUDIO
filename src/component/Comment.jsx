import React, { useState } from 'react'
import CommentForm from './CommentForm';
import '../style/Commentar.css'
// import { HiOutlineUserCircle } from "react-icons/hi2";

const Comment=({comment, addReply})=> {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const toggleReplyForm = () =>{
        setShowReplyForm((prev) => !prev);
    };

    //fungsi untuk mendeteksi dan mengubah URL menjadi elemen link 
    const convertTextToLinks = (text) => {
        const urlRegex = /(\bhttps?:\/\/[^\s/$.?#].[^\s]*)/gi;
        return text.split(urlRegex).map((part, index)=> {
            if (part.match(urlRegex)){
                return (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{color:'blue'}}>
                        {part}
                    </a>
                );
            }
            return part;
        })
    }

  return (
    <div className='comment'>
        <p>{convertTextToLinks(comment.text)}</p>
        {/* <p>{comment.text}</p> */}
        <button onClick={toggleReplyForm}>
            {showReplyForm ? 'Cancle' : 'Reply'}
        </button>
        {showReplyForm && (
            <CommentForm onSubmit={addReply} parentId={comment.id} toggleReply={toggleReplyForm}/>    

        )}
        {comment.replies.length > 0 && (
            <div className='reply-container'>
                {comment.replies.map((reply)=>(
                    <Comment key={reply.id} comment={reply} addReply={addReply}/>
                ))}
            </div>
        )}
    </div>
  )
}

export default Comment