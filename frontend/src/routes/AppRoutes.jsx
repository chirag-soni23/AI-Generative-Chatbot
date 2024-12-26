import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Project from '../screens/Project'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/project' element={<Project/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes