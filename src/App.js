import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import NavBar from '../src/Navbar/Navbar'
import About from './pages/About'
import Contact from './pages/Leaderboard';
import Home from './pages/Home';
import Rewards from './pages/Rewards';
import "./App.css";
import Leaderboard from './pages/Leaderboard';

function App() { 
  return(
  <BrowserRouter>
        <NavBar/>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path='/homepage' element={<Home/>}/>
                <Route path='/aboutpage' element={<About/>} />
                <Route path='/contactpage' element={<Leaderboard/>} />
                <Route path='/eventspage' element={<Rewards/>}/>
            </Routes>
        </BrowserRouter>
  );
}

export default App;