import './App.css';
//import CardModal from './component/CardModal';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import AppRoutes from './routes/Routes';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Workspace from './component/Workspace';
import Board from './component/Board';
import BoardView from './component/BoardView';
import List from './component/List';
import Card from './component/Card';
import CardDetail from './component/CardDetail';
import CardModal from './component/CardModal';
import Member from './pages/Member';
import Marketing from './pages/Marketing'
import Archive from './pages/Archive'
import Setting from './pages/Setting'
import Faq from './pages/Faq'
import ArchiveMarketing from './pages/ArchiveMarketing'
import Schedule from './pages/Schedule';

function App(){
  return(
    <Router>
      <div className='App'>
        <Sidebar className='sidebar'/>
        <div className='App2'>
          <Routes>
            <Route path='/' element={<Workspace/>}/>
            <Route path='/workspaces/:workspaceId/boards' element={<Board/>}/>
            <Route path='/workspaces/:workspaceId/boards/:boardId' element={<BoardView/>}/>
            <Route path='/workspaces/:workspaceId/boards/:boardId/lists' element={<List/>}/>
            <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards' element={<Card/>}/>
            <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId' element={<CardDetail/>}/>
            <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId/modal' element={<CardModal/>}/>
            <Route path='/member' element={<Member/>}/>
            <Route path='/marketing' element={<Marketing/>}/>
            <Route path='/archive' element={<Archive/>}/>
            <Route path='/archive-marketing' element={<ArchiveMarketing/>}/>
            <Route path='/setting' element={<Setting/>}/>
            <Route path='/faq' element={<Faq/>}/>
            <Route path='/schedule' element={<Schedule/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  )
}
export default App;

// function App() {
//   const location = useLocation();
//   const isMemberPage = location.pathname === '/member'
//   return (
//       <div className="App">
//         {isMemberPage && <Sidebar className='sidebar'/>}
//         <Sidebar className='sidebar'/>
//           <div className='App2'>
//             {/* <Navbar/> */}
//             <AppRoutes className='routes'/>
//           </div>  
//       </div>
//   );
// }

// export default App;

/*
<div className="App">
      <Navbar/>
        <div className='App2'>
          <Sidebar className='sidebar'/>
          <AppRoutes className='routes'/>
        </div>  
    </div>

*/