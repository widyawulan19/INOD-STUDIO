import React, { useState } from 'react'
import Picker from '@emoji-mart/react'
import { IoIosNotificationsOutline,IoIosNotifications } from "react-icons/io";
import '../style/Commentar.css'

const CommentForm=({onSubmit, parentId= null, toggleReply})=> {
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    //notif
    const [showNotif, setShowNotif] = useState(false);

    const handleShowNotif = () => {
      setShowNotif(!showNotif);
    }

    const handleEmojiSelect = (emoji) => {
        setText(text + emoji.native);
        setShowEmojiPicker(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
          onSubmit(text, parentId);
          setText('');
          if (toggleReply) toggleReply();
        }
      };
    

  return (
    <div className='comment-form'>
      <div className="chead">
        <h4>Comment Forum</h4>
        <span>
          {showNotif ? 
          <><IoIosNotifications/></>
          :
          <><IoIosNotificationsOutline/></>
        }
        </span>
      </div>
      
        <form
            onSubmit={handleSubmit}
            style={{ backgroundColor:'#eee'}}
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='write a comment...'
                required
                rows='5'
                style={{
                        width:'95%',
                        boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
            />
            <button type='button' onClick={()=> setShowEmojiPicker(!showEmojiPicker)}
              style={{backgroundColor:'white', boxShadow:'0px 4px 8px rgba(0,0,0,0.2'}}
              >
                😀
            </button>
            {showEmojiPicker && (
        <div style={{backgroundColor:'yellow'}}>
          <Picker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
            <button 
              type='submit'
              style={{backgroundColor:'white',color:'#491519', boxShadow:'0px 4px 8px rgba(0,0,0,0.2'}}
            >
              Post Comment
            </button>
        </form>
        
    </div>
  )
}

export default CommentForm

/*
return (
    <div className='comment-form'>
        <form
            onSubmit={handleSubmit}
            style={{marginTop:'10px'}}
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='write a comment...'
                required
                rows='5'
                style={{
                        width:'95%',
                        boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.2)'
                    }}
            />
            <button type='button' onClick={()=> setShowEmojiPicker(!showEmojiPicker)}
              style={{backgroundColor:'white', boxShadow:'0px 4px 8px rgba(0,0,0,0.2'}}
              >
                😀
            </button>
            {showEmojiPicker && (
        <div>
          <Picker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
            <button 
              type='submit'
              style={{backgroundColor:'white',color:'#491519', boxShadow:'0px 4px 8px rgba(0,0,0,0.2'}}
            >
              Post Comment
            </button>
        </form>
        
    </div>
  )

*/