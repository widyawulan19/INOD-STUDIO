import React, { useEffect, useState } from 'react'
import '../style/ArchiveStyle.css'
import { useParams } from 'react-router-dom'
import { HiOutlineExternalLink } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { getArchiveWorkspace, getArchiveBoard, getArchiveList ,getArchiveCard, getArchiveMarketing } from '../services/Api';

function ArchiveMarketing() {
  const {workspaceId, boardId, listId, cardId} = useParams();
  const [selectedType, setSelectedType] = useState('workspace');
  const [archiveData, setArchiveData] = useState([]);
  // const [archiveWorkspace, setArchivedWorkspace] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeButton, setActiveButton] = useState('workspace');

  //mengambil data berdasarkan entity type yang dipilih
  const fetchArchiveData = async (type) =>{
    try{
      let response;
      if (type === 'workspace'){
        response = await getArchiveWorkspace();
      }else if (type === 'board'){
        response = await getArchiveBoard();
      }else if (type === 'list'){
        response = await getArchiveList();
      }else if (type === 'card'){
        response = await getArchiveCard();
      }else if (type === 'marketing'){
        response = await getArchiveMarketing();
      }
      setArchiveData(response.data);
    }catch(err){
      setError('Error fetching archive data');
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    setLoading(true);
    fetchArchiveData(selectedType);
  }, [selectedType]);

  if (loading) return <p>Loading archived workspaces...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='archive-container'>
      <div className="archive-header">
      <h2>Archived {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s</h2>
        {/* <h3>Data Archive</h3> */}
        <div className="button-header">
          <div className='data-search'>
            <CiSearch/>
            <input 
              type="text" 
              placeholder='search data archive...'
              value=''
              className='search-archive'
            />
          </div>
          <div className='btn-ex'>
            <button>
                Export 
                <HiOutlineExternalLink style={{marginLeft:'2px'}} size={15}/>
            </button>
          </div>
        </div>
      </div>
      <div className='archive-title'>
        
      </div>
      <div className='archive-data'>
        <div className='archive-button'>
          <button 
            onClick={()=> {setSelectedType('workspace'); setActiveButton('workspace');}}
            className={activeButton === 'workspace' ? 'active' : ''}
            >
              Workspace
            </button>
          <button 
            onClick={()=> {setSelectedType('board'); setActiveButton('board');}}
            className={activeButton === 'board'? 'active' : ''}
          >
            Board
          </button>
          <button 
            onClick={()=>{ setSelectedType('list'); setActiveButton('list');}}
            className={activeButton === 'list' ? 'active' : ''}
            >
              List
            </button>
          <button 
            onClick={()=> {setSelectedType('card'); setActiveButton('card');}}
            className={activeButton === 'card' ? 'active' : ''}
          >
            Card
          </button>
          <button
            onClick={()=> {setSelectedType('marketing'); setActiveButton('marketing');}}
            className={activeButton === 'marketing' ? 'active' : ''}
          >
            Marketing
          </button>
        </div>
        <div className="archive-show-data">
          {/* <h2>Archived {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s</h2> */}
          {archiveData.length === 0 ? (
            <p>No archived {selectedType}s found.</p>
          ):(
            <table>
              <thead>
                <tr>
                  <th style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}}>No.</th>
                  <th >ID No.</th>
                  <th>Kategori</th>
                  <th>Name</th>
                  <th style={{borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>Description</th>
                </tr> 
              </thead>
              <tbody>
                {archiveData.map(item=>(
                  <tr key={item.entity_id}>
                    <td style={{borderTopLeftRadius:'8px', borderBottomLeftRadius:'8px'}}>{archiveData.indexOf(item)+1}</td>
                    <td style={{paddingLeft:'15px', width:'20px'}}>{item.entity_id}</td>
                    <td style={{fontWeight:'bold'}}>{item.entity_type}</td>
                    <td>{item.name}</td>
                    <td style={{borderTopRightRadius:'8px', borderBottomRightRadius:'8px'}}>{item.description}</td>
                  </tr>
                  ))}
              </tbody>
            </table>
            )}
        </div>
      </div>
    </div>
  )
}

export default ArchiveMarketing