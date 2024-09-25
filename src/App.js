import './App.css';
//import CardModal from './component/CardModal';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import AppRoutes from './routes/Routes';
import { BrowserRouter as Router, useLocation} from 'react-router-dom';

function App() {
  const location = useLocation();
  const isMemberPage = location.pathname === '/member'
  return (
      <div className="App">
        {isMemberPage && <Sidebar className='sidebar'/>}
        <Sidebar className='sidebar'/>
          <div className='App2'>
            {/* <Navbar/> */}
            <AppRoutes className='routes'/>
          </div>  
      </div>
  );
}

export default App;

/*
<div className="App">
      <Navbar/>
        <div className='App2'>
          <Sidebar className='sidebar'/>
          <AppRoutes className='routes'/>
        </div>  
    </div>

*/