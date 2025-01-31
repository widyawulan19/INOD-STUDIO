import React, { useState } from 'react'
import CommentForm from './CommentForm';
import Comment from './Comment';
import '../style/CommentStyle.css'

const PostComment=()=> {
    const [comments, setComments] = useState([]);

    const addComment = (text, parentId = null)=>{
        const newComment = {
            id: Date.now(),
            text,
            parentId,
            replies: []
        };
        setComments((prevComments) => {
            if(parentId === null){
                return [...prevComments, newComment];
            }else{
                return addReplyRecursively(prevComments, parentId,newComment);
                // return prevComments.map(comment =>
                //     comment.id === parentId
                //     ? {...comment, replies: [...comment.replies, newComment]}
                //     : comment
                // );
            }
        });
    };

    const addReplyRecursively = (commentsArray, parentId, newComment) => {
        return commentsArray.map(comment => {
            if(comment.id === parentId){
                return {...comment, replies: [...comment.replies, newComment]};
            }else if (comment.replies.length > 0){
                return {...comment, replies: addReplyRecursively(comment.replies, parentId, newComment)};
            }
            return comment;
        });
    };

  return (
    <div className='comment-container'>
        {/* <h3>Comment Section</h3> */}
        <div className='comment-reply'>
            {comments.map((comment)=>(
                <Comment key={comment.id} comment={comment} addReply={addComment}/>
            ))}
        </div>
        <div className="comment-form" >
            <CommentForm onSubmit={addComment}/>
        </div>
    </div>
  )
}

export default PostComment