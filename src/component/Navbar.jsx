import React, {useRef, useState, useEffect} from 'react'
import { IoLogoOctocat, IoSearch, } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { PiUserCircleGear } from "react-icons/pi";
import { GiMusicSpell } from "react-icons/gi";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { CgNotes } from "react-icons/cg";
import logo2 from '../assets/logo2.png';
import '../style/NavbarStyle.css';
import { useNavigate} from 'react-router-dom';
import {Tooltip,tooltipClasses  } from '@mui/material';
import { styled } from '@mui/material';

//tooltip
const BootstrapTooltip = styled(({className, ...props}) =>(
    <Tooltip {...props} arrow classes={{popper: className}}/>
    ))(({theme}) => ({
      [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
      },
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
      },
    }));

const Navbar=()=> { 
    const navigate = useNavigate();
    const [showCalender, setShowCalender] = useState(false)
    const calendarRef = useRef(null);

    //FUNCTION
    const handleShowCalender = () =>{
        setShowCalender(!showCalender)
    };

    const navigateToWorkspace = ()=>{
        navigate('/')
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalender(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                <BootstrapTooltip title="Calendar">
                    <div className="icon-wrapper" onClick={handleShowCalender}>
                        <HiMiniCalendarDays size={17} className='icon-icon' />
                    </div>
                </BootstrapTooltip>
                {showCalender && (
                    <div className="dropdown-menu">
                        <h4>Show Calendar</h4>
                        <p>Ini adalah dropdown kalender.</p>
                    </div>
                )}
                <BootstrapTooltip title="Notes">
                    <div className="icon-wrapper">
                        <CgNotes size={15} className='icon-icon' />
                    </div>
                </BootstrapTooltip>
                <BootstrapTooltip title="Schedule">
                    <div className="icon-wrapper">
                        <HiMiniCalendarDays size={17} className='icon-icon' />
                    </div>
                </BootstrapTooltip>
            </div>
            
            <div className="profil">
                <BootstrapTooltip title="Profile">
                    <div className='icon-wrapper'>
                        <button><PiUserCircleGear size={16} /> <MdOutlineKeyboardArrowDown /></button>
                    </div>
                </BootstrapTooltip>
            </div>
        </div>
        
        {/* {showCalender && (
            <div className="calendar-text">
                <h4>Show Calender</h4>
            </div>
        )} */}
    </div>
    
  )
}

export default Navbar;