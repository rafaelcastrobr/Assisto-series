import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [dados, setDados] = useState({})


  //process.env.REACT_APP_LKA
  function ChamaAPI() {
    axios.get(`https://api.themoviedb.org/3/movie/550?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
    .then(resp => setDados(resp.data))
  }

  useEffect(() => {
    ChamaAPI()
  }, []);

  return (
    <div className='container'>
      <img src={`https://image.tmdb.org/t/p/w500${dados.poster_path}`} style={{width: '100px'}} />
      <h1>{dados.title}</h1>
      <p>{dados.overview}</p>
   
     
      

      <p></p>

    </div>

  );
}

export default App;
