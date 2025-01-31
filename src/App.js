import './App.css';
import './style/HomeStyle.css';
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
import Example from './pages/Example';
import OtherPage from './pages/OtherPage';
import ExampleCard from './pages/ExampleCard';
import CardDescription from './pages/CardDescription';
import Marketing2 from './pages/Marketing2';
import MarketingForm from './pages/MarketingForm';
import CardMarketingDetail from './component/CardMarketingDetail';
import PopupMarketingDetail from './popup/PopupMarketingDetail';
import PopupEditDataMarketing from './popup/PopupEditDataMarketing';
import Home from './pages/Home';
import LabelSelector from './fiture/LabelSelector';
import Label from './fiture/Label';
import TestingFitur from './fiture/TestingFitur';
import CoverSelected from './fiture/CoverSelected';
import TestingFiture2 from './fiture/TestingFiture2';
import SelectorCover from './fiture/SelectorCover';
import NewMarketing from './pages/NewMarketing';
import ChecklistTest from './fiture/ChecklistTest';
import Checklist from './fiture/Checlist';
import Disscution from './fiture/Disscution';
// import './style/SidebarStyle.css'

function Layout({children}){
  return(
    <div className='home-container'>
      <Navbar/>
      <div className='main'>
        <Sidebar className='sidebar'/>
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}

function App(){
  return(
    <Router>
            <Routes>
              <Route
                path='*'
                element={
                  <Layout>
                    <Routes>
                      <Route path='/home' element={<Home/>}/>
                      <Route path='/' element={<Workspace/>}/>
                      <Route path='/workspaces/:workspaceId/boards' element={<Board/>}/>
                      <Route path='/workspaces/:workspaceId/boards/:boardId' element={<BoardView/>}/>
                      <Route path='/workspaces/:workspaceId/boards/:boardId/lists' element={<List/>}/>
                      <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards' element={<Card/>}/>
                      <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId' element={<CardDetail/>}/>
                      <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId/modal' element={<CardModal/>}/>
                      <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId/other-page' element={<OtherPage/>}/>
                      <Route path='/member' element={<Member/>}/>
                      <Route path='/marketing' element={<Marketing/>}/>
                      <Route path='/marketing2' element={<Marketing2/>}/>
                      <Route path='/marketingForm' element={<MarketingForm/>}/>
                      <Route path='/marketing-detail' element={<CardMarketingDetail/>}/>
                      <Route path='/popup-detail-marketing/:marketing_id' element={<PopupMarketingDetail/>}/>
                      <Route path="/popup-detail-marketing/:marketing_id/edit-data-marketing" element={<PopupEditDataMarketing />} />

                      <Route path='/archive' element={<Archive/>}/>
                      <Route path='/archive-marketing' element={<ArchiveMarketing/>}/>
                      <Route path='/setting' element={<Setting/>}/>
                      <Route path='/faq' element={<Faq/>}/>
                      <Route path='/schedule' element={<Schedule/>}/>
                      {/* <Route path='other-page' element={<OtherPage/>}/> */}
                      <Route path='/example' element={<Example/>}/>
                      <Route path='/example-card' element={<ExampleCard/>}/>
                      <Route path='/description' element={<CardDescription/>}/>
                      <Route path='/label-select' element={<LabelSelector/>}/>
                      <Route path='/label2' element={<Label/>}/>
                      <Route path='/testing-fitur' element={<TestingFitur/>}/>
                      <Route path='/testing-fitur2' element={<TestingFiture2/>}/>
                      <Route path='/cover-selector' element={<CoverSelected/>}/>
                      <Route path='/selector-cover' element={<SelectorCover/>}/>
                      <Route path='/new-marketing' element={<NewMarketing/>}/>
                      {/* <Route path='/navbar' element={<Navbar/>}/> */}
                      <Route path='/test-checklist' element={<ChecklistTest/>}/>
                      <Route path='/checlis' element={<Checklist/>}/>
                      {/* <Route path='/discuss' element={<Disscution/>}/> */}
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
      {/* </div> */}
    </Router>
  )
}
export default App;


/*

function App(){
  return(
    <Router>
      <div className='App'>
        <div className='App2'>
            <Routes>
              <Route path='/home' element={<Home/>}/>
              <Route path='/' element={<Workspace/>}/>
              <Route path='/workspaces/:workspaceId/boards' element={<Board/>}/>
              <Route path='/workspaces/:workspaceId/boards/:boardId' element={<BoardView/>}/>
              <Route path='/workspaces/:workspaceId/boards/:boardId/lists' element={<List/>}/>
              <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards' element={<Card/>}/>
              <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId' element={<CardDetail/>}/>
              <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId/modal' element={<CardModal/>}/>
              <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId/other-page' element={<OtherPage/>}/>
              <Route path='/member' element={<Member/>}/>
              <Route path='/marketing' element={<Marketing/>}/>
              <Route path='/marketing2' element={<Marketing2/>}/>
              <Route path='/marketingForm' element={<MarketingForm/>}/>
              <Route path='/marketing-detail' element={<CardMarketingDetail/>}/>
              <Route path='/popup-detail-marketing/:marketing_id' element={<PopupMarketingDetail/>}/>
              <Route path="/popup-detail-marketing/:marketing_id/edit-data-marketing" element={<PopupEditDataMarketing />} />

              <Route path='/archive' element={<Archive/>}/>
              <Route path='/archive-marketing' element={<ArchiveMarketing/>}/>
              <Route path='/setting' element={<Setting/>}/>
              <Route path='/faq' element={<Faq/>}/>
              <Route path='/schedule' element={<Schedule/>}/>
              {/* <Route path='other-page' element={<OtherPage/>}/> 
              <Route path='/example' element={<Example/>}/>
              <Route path='/example-card' element={<ExampleCard/>}/>
              <Route path='/description' element={<CardDescription/>}/>
              // {/* <Route path='/navbar' element={<Navbar/>}/> 
            </Routes>
          </div>
        </div>
      {/* </div>
    </Router>
  )

*/