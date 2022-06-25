import './App.css';
import Search from './components/Search/Search';
import Header from './components/Header/Header';

import ContentProvider from './context/ContentProvider';
import Home from './template/Home/Home';
import Serie from './template/Serie/Serie';

import { HashRouter, Route, Routes } from 'react-router-dom'

function App() {

  //process.env.REACT_APP_LKA

  return (
    <div className='container'>
      <ContentProvider>

      <HashRouter basename="/">
        <Header />
        <Routes>
          <Route path='/' element={ <Home />} />
          <Route path='/search/:titulo' element={ <Search />} />
          <Route path='/serie/:id' element={ <Serie />} />
          
        </Routes>
      </HashRouter>
        
        
      </ContentProvider>
    </div>

  );
}

export default App;
