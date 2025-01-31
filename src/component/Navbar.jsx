import React from 'react'
import { IoLogoOctocat, IoSearch, } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { PiUserCircleGear } from "react-icons/pi";
import { GiMusicSpell } from "react-icons/gi";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { CgNotes } from "react-icons/cg";
import logo2 from '../assets/logo2.png';
import '../style/NavbarStyle.css';
import { useNavigate} from 'react-router-dom';

const Navbar=()=> { 
    const navigate = useNavigate();

    const navigateToWorkspace = ()=>{
        navigate('/')
    }
  return ( 
    <div className='navbar-container'>
        <div className="logo" onClick={navigateToWorkspace}>
            <img src={logo2} alt={logo2}/>
        </div>
        <div className="search-fitur">
            <IoSearch size={12} style={{marginRight:'5px', color:'grey'}}/>
            <input 
                type="text" 
                placeholder='search here...' 
            />
            <GiMusicSpell size={15} style={{marginLeft:'5px', color:'#783fbf'}}/>
        </div>
        <div className="another-icon">
            <div className="icon">
                <div className="icon-wrapper" data-tooltip="Calendar">
                    <HiMiniCalendarDays  size={17} className='icon-icon' />
                </div>
                <div className="icon-wrapper" data-tooltip="Notes">
                    <CgNotes size={15} className='icon-icon' />
                </div>
                <div className="icon-wrapper" data-tooltip="Schedule">
                    <HiMiniCalendarDays size={17} className='icon-icon' />
                </div>
            </div>
            <div className="profil">
                <div className='icon-wrapper' data-tooltipe="Profile">
                    <button ><PiUserCircleGear size={16}/> <MdOutlineKeyboardArrowDown/></button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar;