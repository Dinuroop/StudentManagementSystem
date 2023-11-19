import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Students from './Students';
import AddStud from './AddStud';
import Navbar from './NavBar';
import EditDelete from './Edit&Delete';
import MultiSearch from './MultiSearch';
import Average from './Average';
import SubjectDetails from './SubjectDetails';
import ShowSubs from './ShowSubs';
import First from './First';
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path='/' element={<First/>}/>
    <Route path='/StudentDetails' element={<Students/>}/>
    <Route path='/AddStudent' element={<AddStud/>}/>
    <Route path='/subjectdetails' element={<SubjectDetails/>}/>
    <Route path='/Edit&Delete' element={<EditDelete/>}/>
    <Route path='/ShowSubs' element={<ShowSubs/>}/>
    <Route path='/MultiSearch' element={<MultiSearch/>}/>
    <Route path='/Average' element={<Average/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
