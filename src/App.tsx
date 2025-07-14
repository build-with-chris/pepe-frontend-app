import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from './routes/Home';
import Anfragen from './routes/Anfragen';
import Kuenstler from './routes/Kuenstler';


function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anfragen" element={<Anfragen />} />
        <Route path="/kuenstler" element={<Kuenstler />} />

      </Routes>

    </div>
  )
}

export default App