import './App.css';
import Search from './components/Search/Search';
import Header from './components/Header/Header';

import ContentProvider from './context/ContentProvider';
import Home from './template/Home/Home';
import Serie from './template/Serie/Serie';

import { HashRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer';
import ModalHome from './components/ModalHome/ModalHome';


function App() {

  return (
    <>
      <ContentProvider>
        
        <HashRouter basename="/">
          <div className='container'>
            <ModalHome />
            <div className='pages'>
              <Header />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search/:titulo' element={<Search />} />
                <Route path='/serie/:id/' element={<Serie />} />

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
