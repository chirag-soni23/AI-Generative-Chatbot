import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Project from '../screens/Project'
import Auth from '../auth/Auth'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Auth><Home/></Auth>}/>
        <Route path='/project' element={<Auth><Project/></Auth>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes