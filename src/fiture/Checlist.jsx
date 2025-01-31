import React, { useState } from 'react';
import { PiDotsThreeBold } from "react-icons/pi";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdCheckBoxOutlineBlank, MdCheckBox, MdEdit, MdDelete, MdAdd, MdCheck } from "react-icons/md";
import '../style/ChecklistStyle.css'
import ChecklistTest from './ChecklistTest';

const Checklist = () => {
    const [checklist, setChecklist] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [editingItem, setEditingItem] = useState(null)
    const [editingParentId, setEditingParentId] = useState(null);
    const [showChecklist, setShowChecklist] = useState(false);
    const [showAction, setShowAction] = useState({});
    const [showActionBody, setShowActionBody] = useState({});
    const [activeActionId, setActiveActionId] = useState(null);



    const handleShowChecklist = () => {
      setShowChecklist(!showChecklist);
    }

    // show action header
    const handleShowAction = (id) => {
      // setShowAction(!showAction);
      setShowAction((prevShowAction) => ({ ...prevShowAction, [id]: !prevShowAction[id] }));
    }

    //show action body
    const handleShowBody = (id) => {
      setShowActionBody((prevShowBody)=> ({ ...prevShowBody, [id]: !prevShowBody[id]}));
    }



    // Menghitung progres untuk checklist dan subChecklist
    const calculateProgress = () => {
      const completedItems = checklist.reduce((acc, item)=> {
        return acc + (item.isCompleted ? 1 : 0) + item.subChecklist.filter(sub => sub.isCompleted).length;
      },0);
      const totalItems = checklist.reduce((acc, item)=>{
        return acc + 1 + item.subChecklist.length;
      },0);
      return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    }
    // const calculateProgress = () => {
    //     const completedItems = checklist.filter(item => item.isCompleted).length;
    //     const totalItems = checklist.length;
    //     return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    // };

    // Menampilkan progres berdasarkan ratio untuk checklist dan subChecklist
    const calculateProgressRatio = () => {
      const completedItems = checklist.reduce((acc, item)=>{
        return acc + (item.isCompleted ? 1 : 0) + item.subChecklist.filter(sub => sub.isCompleted).length;
      },0);
      const totalItems = checklist.reduce((acc, item)=>{
        return acc + 1 + item.subChecklist.length;
      },0)
      return `${completedItems} / ${totalItems}`;
    }
    // const calculateProgressRatio = () => {
    //     const completedItems = checklist.filter(item => item.isCompleted).length;
    //     const totalItems = checklist.length;
    //     return `${completedItems}/${totalItems}`;
    // };

    // Fungsi untuk menangani perubahan status checklist
    const toggleCheckbox = (id) => {
        setChecklist(prevChecklist =>
            prevChecklist.map(item =>
                item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            )
        );
    };

    // Fungsi untuk menambahkan item checklist
    const addChecklistItem = () => {
        if (inputValue.trim() === '') {
            alert('Isi checklist tidak boleh kosong');
            return;
        }
        const newItem = {
            id: Date.now(),
            text: inputValue.trim(),
            isCompleted: false,
            subChecklist: []
        };

        setChecklist(prevChecklist => [...prevChecklist, newItem]);
        setInputValue('');
    };

    // Fungsi untuk menambahkan sub-checklist
    const addSubChecklistItem = (id, subText) => {
        if (subText.trim() === '') {
            alert('Isi sub-checklist tidak boleh kosong');
            return;
        }
        setChecklist(prevChecklist =>
            prevChecklist.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subChecklist: [
                            ...item.subChecklist,
                            { id: Date.now(), text: subText.trim(), isCompleted: false }
                        ]
                    }
                    : item
            )
        );
    };

    // Fungsi untuk toggle status sub-checklist
    const toggleSubCheckbox = (parentId, subId) => {
        setChecklist(prevChecklist =>
            prevChecklist.map(item =>
                item.id === parentId
                    ? {
                        ...item,
                        subChecklist: item.subChecklist.map(sub =>
                            sub.id === subId ? { ...sub, isCompleted: !sub.isCompleted } : sub
                        )
                    }
                    : item
            )
        );
    };

    //fungsi untuk menghapus item checklist 
    const deleteChecklist = (id) => {
      setChecklist(prevChecklist => prevChecklist.filter(item => item.id !== id));
    }

    const deleteSubChecklist = (parentId, subId) => {
      setChecklist(prevChecklist => prevChecklist.map(item => item.id === parentId ? { ...item, subChecklist: item.subChecklist.filter(subItem => subItem.id !== subId) }
      : item));
    }

  //fungsi untuk mengedit checklist
    const startEditingItem = (id) =>{
      const itemToEdit = checklist.find(item => item.id === id);
      setEditingItem(itemToEdit);
      setInputValue(itemToEdit.text);
    };

    //fungsi untuk menyimpan hasil editan checklist
    const saveEditChecklist = () => {
      if(inputValue.trim() === ''){
        alert('Checklist tidak boleh kosong')
        return;
      }
      setChecklist(prevChecklist =>
        prevChecklist.map(item => 
          item.id === editingItem.id ? {...item, text:inputValue.trim()} : item
        )
      )
      setEditingItem(null);
      setInputValue('');
    }

    //fungsi untuk mengedit subChecklist
    const startEditingSubItem = (parentId, subId)=>{
      const parentItem = checklist.find(item => item.id === parentId);
      if(parentItem){
        const subItemToEdit = parentItem.subChecklist.find(subItem => subItem.id === subId);
        if(subItemToEdit){
          setEditingItem(subItemToEdit);
          setInputValue(subItemToEdit.text);
          setEditingParentId(parentId);
        }
      }
    }

    //fungsi untuk menyimpan hasil edit dari subChecklist
    const saveEditSubItem = () => {
      if(inputValue.trim() === ''){
        alert('Isi sub-checklist tidak boleh kosong');
        return;
      }
      setChecklist(prevChecklist =>
        prevChecklist.map(item =>
            item.id === editingParentId
                ? {
                    ...item,
                    subChecklist: item.subChecklist.map(sub =>
                        sub.id === editingItem.id ? { ...sub, text: inputValue.trim() } : sub
                    )
                }
                : item
        )
    );
      //reset editing state
      setEditingItem(null);
      setEditingParentId(null);
      setInputValue('');
    };

    

    <button onClick={handleShowChecklist}>
    <AiOutlinePlus style={{marginRight:'5px'}}/> 
    Create Checklist
  </button>


    return (
        <div className='checklist-container'>
          <ChecklistTest/>
            <h4>Checklists</h4>
            <div className="ch-c">
              <button onClick={handleShowChecklist}>
              {showChecklist ?
                <>
                  Checklists
                </>
                : 
                <>
                <AiOutlinePlus style={{marginRight:'5px'}}/> 
                Create Checklist
                </>
              }
              </button>
            </div>
            
            {showChecklist && (
                <div className='checklist-content'>
                    <div className='checklist-input'>
                      <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder='Create new checklist'
                          onKeyDown={(e)=>{
                            if(e.key === 'Enter'){
                              addChecklistItem();
                              setInputValue('');
                            }
                          }}
                      />
                      {editingItem ? (
                        <button onClick={editingParentId ? saveEditSubItem : saveEditChecklist}>Save</button>
                      ):(
                        <button onClick={addChecklistItem}><AiOutlinePlus/></button>
                      )}
                  </div>
                  
                  <div className="show-progres">
                    <h5>List Complete {calculateProgressRatio()}</h5>
                    <div style={{
                            width: '10%',
                            height: '5px',
                            backgroundColor: '#eee',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            marginLeft:'5px'
                        }}>
                            <div style={{
                                width: `${calculateProgress()}%`,
                                height: '100%',
                                backgroundColor: '#6b1c14',
                                transition: 'width 0.3s ease'
                            }}>
                            </div>
                      </div>
                  </div>

                  {/* Menampilkan checklist */}
                  <div >
                    {checklist.map((item) => (
                      <div className="checklist-list-container">
                        <div  key={item.id} className="checklist-list-header">

                          <span
                            onClick={()=> toggleCheckbox(item.id)}
                            className='span-header'
                          >
                            {item.isCompleted ? (
                              <IoCheckmarkDoneCircle style={{ color: '#4caf50', fontSize: '20px' }}/>
                            ):(
                              <RiCheckboxBlankCircleLine style={{ color: '#aaa', fontSize: '20px' }}/>
                            )}
                          </span>
                          <span
                            style={{
                              margin:'0px 10px',
                              textDecoration: item.isCompleted ? 'line-through':'none',
                              color:item.isCompleted? '#aaa': '#000',
                              fontSize:'13px'
                              // border:'1px solid grey'
                            }}
                          >
                            {item.text}
                          </span>
                          <div className="action-header">
                            <PiDotsThreeBold onClick={()=>handleShowAction(item.id)} className='dot-action'/>
                              {showAction[item.id] && (
                                  <div className="action">
                                      <button className='action-edit' onClick={() => startEditingItem(item.id)}>
                                      <AiOutlineEdit className='action-ikon'/>
                                      <p>Rename checklist</p>
                                    </button>
                                    <button className='action-delete' onClick={()=> deleteChecklist(item.id)}>
                                      <AiOutlineDelete  className='action-ikon'/>
                                      <p>Delete checklist</p>
                                    </button>
                                  </div>
                              )}
                          </div>
                        </div>
                        <div className="checklist-list-container-body">
                            {item.subChecklist.map(sub =>(
                              <div className='checklist-list-body'>
                                <span 
                                  className='span-body'
                                  onClick={()=> toggleSubCheckbox(item.id, sub.id)}
                                >
                                  {sub.isCompleted  ? (
                                      <IoCheckmarkDoneCircle style={{ color: '#4caf50', fontSize: '18px', fontWeight:'normal' }} />
                                  ) : (
                                      <RiCheckboxBlankCircleLine style={{ color: '#aaa', fontSize: '18px',fontWeight:'normal' }} />
                                  )}
                                </span>
                                <span
                                  
                                  style={{
                                    marginLeft: '10px',
                                    textDecoration: sub.isCompleted ? 'line-through' : 'none',
                                    color: sub.isCompleted ? '#aaa' : '#000',
                                    fontSize:'13px'
                                }}
                                >
                                  {sub.text}
                                </span>
                                <div className="action-body">
                                  <PiDotsThreeBold onClick={()=> handleShowBody(sub.id)} className='dot-action'/>
                                    {showActionBody[sub.id] && (
                                        <div className="body-action">
                                            <button className='action-edit' onClick={() => startEditingSubItem(item.id, sub.id)}>
                                            <AiOutlineEdit className='action-ikon'/>
                                            <p>Rename checklist</p>
                                          </button>
                                          <button className='action-delete' onClick={()=> deleteSubChecklist(item.id, sub.id)}>
                                            <AiOutlineDelete  className='action-ikon'/>
                                            <p>Delete checklist</p>
                                          </button>
                                        </div>
                                    )}
                                </div>
                              </div>
                            ))}
                            <div className="checklist-subChecklis">
                              <AiOutlinePlus style={{marginRight:'10px'}}/>
                              <input
                                  type="text"
                                  placeholder='New checklist item...'
                                  onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                          addSubChecklistItem(item.id, e.target.value);
                                          e.target.value = '';
                                      }
                                  }}
                              />
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}
            
        </div>
    );
};

export default Checklist;
