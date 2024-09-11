import {React,useEffect,useState,useRef} from 'react'
import { FaUserAstronaut, FaPlus } from "react-icons/fa6";
import { FaStar} from "react-icons/fa";
import { MdDashboard} from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { CiGrid41 } from "react-icons/ci";
import '../style/NavbarStyle.css'
import { createWorkspace, getWorkspaces } from '../services/Api';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import logo from '../assets/LOGO1.png'

const Navbar=()=> {
    //state untuk scroll
    const [ isScrolled, setIsScrolled] = useState(false)
    //const {workspace,setWorkspace} = useParams();

    //state untuk dropdown
    const [dropdowns, setDropdowns] = useState({
        workspace: false,
        board: false,
        starred: false,
        new: false,
    })

    //refs untuk track dropdown container
    const workspaceRef = useRef();
    const boardRef = useRef();
    const starredRef = useRef();
    const newRef = useRef();

    const toggleDropdown = (menu) => {
        setDropdowns((prev) => ({
          // Toggle menu yang diklik
          [menu]: !prev[menu],
          // Tutup semua dropdown lainnya
          workspace: menu === 'workspace' ? !prev.workspace : false,
          board: menu === 'board' ? !prev.board : false,
          starred: menu === 'starred' ? !prev.starred : false,
          new: menu === 'new' ? !prev.new : false,
        }));
      };

    //handle click outside dropdown
    const handleClickOutside = (event) => {
        if(
            workspaceRef.current && 
            !workspaceRef.current.contains(event.target) &&
            boardRef.current &&
            !boardRef.current.contains(event.target) &&
            starredRef.current &&
            !starredRef.current.contains(event.target) &&
            newRef.current &&
            !newRef.current.contains(event.target)
        ){
            setDropdowns({
                workspace: false,
                board: false,
                starred: false,
                new:false
            })
        }
    }

    useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [])

    //event listener untuk scroll
    useEffect(()=>{
        const handleScroll = () => {
            if (window.scrollY > 0){
                setIsScrolled(true);
            } else{
                setIsScrolled(false)
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // const loadWorkspace = async () => {
    //     const response = await getWorkspaces();
    //     setWorkspace
    // }

    //useEffect for workspace
    const [ workspace, setWorkspace] = useState([]);
    const [ newWorkspace, setNewWorkspace] = useState({name:'',description:''})
    //const [dropdown, setDropdown] = useState({workspace:false});
    //const workspaceRef = useRef(null);
    //cont untuk button add workspace
    const [showForm, setShowForm] = useState(false)

    //membuat data workspace saat pertama kali dirender
    useEffect(()=>{
        const loadWorkspace = async () => {
            const response = await getWorkspaces();
            setWorkspace(response.data)
        };
        loadWorkspace();
    },[])

    //handle create workspace
    const loadWorkspaces = async () => {
        const response = await getWorkspaces();
        loadWorkspaces();
    }

    const handleCreateWorkspace = async() => {
        await createWorkspace(newWorkspace);
        loadWorkspaces();
        setNewWorkspace({name:'', description:''})
        setShowForm(false);
    }
    const toggleFormVisibility = () => {
        setShowForm(!showForm); // Toggle visibilitas form
      };

    const stopPropagation = (event) =>{
        event.stopPropagation();
    }
  
    return (
        <nav className={`navbar ${isScrolled ? 'scrolled ': ''}`}>
            <div className="navbar-left">
                {/* Workspace Dropdown */}
                <div className='navbar-item' ref={workspaceRef} onClick={() => toggleDropdown('workspace')}>
                    {/* Workspace */}
                    {dropdowns.workspace && (
                        <div className='dropdownWorkspace' onClick={stopPropagation}>
                            {workspace.length > 0 ? (
                                workspace.map((workspace)=> (
                                    <div key={workspace.id} className='dropdown-item-workspace'>
                                        <RiDashboardHorizontalFill style={{marginRight:'1vw'}}/>{workspace.name}
                                    </div>
                                    
                                ))
                            ):( 
                                <div className='dropdown-item-workspace'>No Workspace available</div>
                            )}
                            <button 
                                className='btn-add1' 
                                onClick={toggleFormVisibility}>
                                
                                {showForm ?
                                (<><IoClose style={{marginRight:'1vw'}}/> Cancle </>):(<><FaPlus style={{marginRight:'1vw'}}/>Add Workspace</>)}
                            </button>
                            {showForm && (
                                <div  className='workspace-form'>
                                    <input 
                                        className='input-workspace'
                                        type="text"
                                        placeholder='Workspace name'
                                        value={newWorkspace.name}
                                        onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value})}
                                    />
                                    <input 
                                        className='input-workspace'
                                        type="text"
                                        placeholder='Description'
                                        value={newWorkspace.description}
                                        onChange={(e)=> setNewWorkspace({ ...newWorkspace, description: e.target.value})}
                                    />
                                    <button className="btn-add2" onClick={handleCreateWorkspace}>Add Workspace</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
    
                {/* dropdown Board */}
                <div className="navbar-item" ref={boardRef} onClick={()=> toggleDropdown('board')}>
                    {/* Recent <CiGrid41 size={15}/> */}
                    {dropdowns.board && (
                        <div className="dropdownMenu">
                            <div className="dropdown-item">Recent Workspace 1</div>
                            <div className="dropdown-item">Recent Workspace 2</div>
                            <div className="dropdown-item">Recent Workspace 3</div>
                        </div>
                    )}
                </div>
    
                {/* dropdown Starrred */}
                <div className="navbar-item" ref={starredRef} onClick={() => toggleDropdown('starred')}>
                    {/* Starred <FaStar size={12}/> */}
                    {dropdowns.starred && (
                        <div className="dropdownMenu" style={{textAlign:'left'}}>
                            <div className="dropdown-item"><FaStar style={{marginRight:'1vw'}}/>Board Starred 1</div>
                            <div className="dropdown-item"><FaStar style={{marginRight:'1vw'}}/>Board Starred 2</div>
                            <div className="dropdown-item"><FaStar style={{marginRight:'1vw'}}/>Board Starred 3</div>
                        </div>
                    )}
                </div>
                <div className="navbar-item" ref={newRef} onClick={() => toggleDropdown('new')}>
                    {/* New */}
                    {dropdowns.new && (
                        <div className="dropdownMenu" style={{textAlign:'left'}}>
                            <div className="dropdown-item"><FaPlus style={{marginRight:'1vw'}}/>New Board</div>
                            <div className="dropdown-item"> <FaPlus style={{marginRight:'1vw'}}/>New Workspace</div>
                        </div>
                    )}
                </div>
            </div>
            <div className='navbar-center logo'><img src={logo} style={{width:'60%', height:'5.5vh'}} alt="logo inod" /></div>
            <div className="navbar-right">
                {/* <input type="text" className='search-input' placeholder='Search '/>
                <div className="navbar-item"><FaUserAstronaut size={30}/></div> */}
            </div>
        </nav>
      )
}
 
export default Navbar

/*
{/* <div className="dropdown-item-workspace">Workspace1</div>
                            <div className="dropdown-item-workspace">Workspace2</div>
                            <div className="dropdown-item-workspace">Workspace3</div> */