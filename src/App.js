import React,{useEffect} from "react";
import {useNavigate,Routes,Route} from 'react-router-dom'
import { Login } from "./componets";
import Home from './container/Home'
import {fe} from './utils/data'

function App() {
const navigate= useNavigate()

  useEffect(()=>{
  const user =localStorage.getItem('user')
  if(!user)navigate('/login')
},[])


  return (
    <Routes>
      <Route path='Login' element={<Login />}/>
      <Route path='/*' element={<Home />} />
    </Routes>
  );
}

export default App;
