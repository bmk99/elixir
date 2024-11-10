import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
// import Main from './components/Main';
import PaginatedItems from './components/Main';
import Hotel from './components/Hotel';

function App() {
  return (
    <> 
      <Navbar />
  <Routes>
    {/* {/* <Route path="/" element={< />} /> */}
    <Route path='/' element={<PaginatedItems/>}/>
    <Route path="/:page" element={<PaginatedItems/>} /> 
    <Route path="/hotel-details/:id" element={<Hotel/>} /> 
  </Routes>
 </>
  );
}

export default App;
