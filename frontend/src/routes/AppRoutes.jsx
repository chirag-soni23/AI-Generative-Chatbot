import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes