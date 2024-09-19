import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Workspace from '../component/Workspace'
import Board from '../component/Board'
import List from '../component/List'
import Card from '../component/Card'
import CardDetail from '../component/CardDetail'
import BoardView from '../component/BoardView'
import CardModal from '../component/CardModal'
import Member from '../pages/Member'
import WhitNavigate from '../component/WhitNavigate'
import Sidebar from '../component/Sidebar'

const SidebarWithNavigate = WhitNavigate(Sidebar)

const AppRoutes=()=> {
  return (
    <Router>
      {/* <SidebarWithNavigate/> */}
      <Routes>
        <Route path='/' element={<Workspace/>}/>
        <Route path='/workspaces/:workspaceId/boards' element={<Board/>}/>
        <Route path='/workspaces/:workspaceId/boards/:boardId' element={<BoardView/>}/>
        <Route path='/workspaces/:workspaceId/boards/:boardId/lists' element={<List/>}/>
        <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards' element={<Card/>}/>
        <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId' element={<CardDetail/>}/>
        <Route path='/workspaces/:workspaceId/boards/:boardId/lists/:listId/cards/:cardId/modal' element={<CardModal/>}/>
        <Route path='/member' element={<Member/>}/>
      </Routes>
    </Router>
  )
}

export default AppRoutes
