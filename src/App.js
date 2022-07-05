import './App.css';
import Search from './components/Search/Search';
import Header from './components/Header/Header';

import ContentProvider, { ContentContext } from './context/ContentProvider';
import Home from './template/Home/Home';
import Serie from './template/Serie/Serie';

import { HashRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer';
import Sobre from './template/Sobre/Sobre';


function App() {
  return (
    <>
      <ContentProvider>
        
        <HashRouter basename="/">
          <div className='container'>
            <div className='pages'>
              <Header />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search/:titulo' element={<Search />} />
                <Route path='/serie/:id/' element={<Serie />} />
                <Route path='/sobre' element={<Sobre />} />
              </Routes>
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </HashRouter>


      </ContentProvider>
    </>

  );
}

export default App;
