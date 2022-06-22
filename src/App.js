import axios from 'axios';
import { useState } from 'react';
import './App.css';
import Search from './components/Search';
import Header from './components/Header/Header';

import ContentProvider from './context/ContentProvider';

function App() {

  //process.env.REACT_APP_LKA

  return (
    <div className='container'>
      <ContentProvider>
        <Header />
        <Search />
        
      </ContentProvider>
    </div>

  );
}

export default App;
