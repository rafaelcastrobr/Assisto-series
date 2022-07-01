import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css'
document.title = 'Assisto Série'


export default function Home() {

  const [state, setState] = useState([])
  const [dadosApiMinhaSerie, setDadosApiMinhaSerie] = useState([])

  const img = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'


  useEffect(() => {
    getSeriesPopular()
    pegaDadosApiMinhaSerie()
    //salvo se a serie ta ou não na grade no localstorage quando clico botao
    //faço um map buscando a id dos filmes na grade se encontra e tiver salvo na grade então o botao fica x
    //adc epi buscando eps nao adc pegando próxima entrada pra saber próx ep assistir
  }, []);

  function pegaDadosApiMinhaSerie () {
    if(localStorage.getItem('MINHA_SERIE')) {
      setDadosApiMinhaSerie(JSON.parse(localStorage.getItem('MINHA_SERIE')))
    }
  }

  async function getSeriesPopular() {
    await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {

        setState(resp.data.results)
        //console.log(state)
      })
  }

  return (
    <>
    <h2 className="Home-titulos">Populares</h2>
    <div className="Home-container">
      {state.map(dados => {
        return (
          <>
            <div className="Home-populares">
              <Link to={`/serie/${dados.id}`}>

              {dados.poster_path === null ? (
                  <img src={img} style={{ width: '92px' }} alt='poster' />
                )
                  :
                  (
                    <img src={`https://image.tmdb.org/t/p/w92${dados.poster_path}`} alt={dados.name} />
                  )
                }
              </Link>
            </div>

          </>
        )
      })}
      </div>
      
      <div>
        {dadosApiMinhaSerie.length > 0 && <h2 className="Home-titulos">Minha Lista</h2>}
        <div className="Home-minhas-series">
      {dadosApiMinhaSerie.map(dados => {
        return (
          <>
            <div className="Home-populares">
              <Link to={`/serie/${dados.id}`}>

              {dados.poster === null ? (
                  <img src={img} style={{ width: '92px' }} alt='poster' />
                )
                  :
                  (
                    <img src={`https://image.tmdb.org/t/p/w92${dados.poster}`} alt={dados.titulo} />
                  )
                }

              </Link>
              <p>{dados.titulo}</p>
              {dados.ultimo_ep_visto.length === 0 ? '' :  <p style={{ color: '#b6283f' }}>Prox: {dados.ultimo_ep_visto}</p>}
             
            </div>

          </>
        )
      })}
      </div>
      </div>
    </>
  )
}