import axios from "axios";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ContentContext } from "../../context/ContentProvider";
import './Home.css'
document.title = 'Assisto Série'


export default function Home() {
  const { state: { populares, minhas_series }, dispatch } = useContext(ContentContext)

  const img = 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'


  useEffect(() => {
    getSeriesPopular()
    pegaDadosApiMinhaSerie()

    // eslint-disable-next-line
  }, []);



  function pegaDadosApiMinhaSerie() {
    if (localStorage.getItem('MINHA_SERIE')) {
      
      const dados = JSON.parse(localStorage.getItem('MINHA_SERIE'))
      dados.sort((a, b) => {
        if(a.titulo < b.titulo) {
          return -1
        } else {
          return true
        }
      })

      dispatch({ type: 'ATUALIZA_MINHA_LISTA', payload: dados })
    }
  }

  async function getSeriesPopular() {
    await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_LKA_KEY}&language=pt-BR`)
      .then(resp => {
        const dados = resp.data.results
        dispatch({ type: 'ATUALIZA_HOME', payload: dados })
      })
  }

  return (
    <>
      <h2 className="Home-titulos">Populares</h2>
      <div className="Home-container">
        {populares.map(dados => {
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
        {minhas_series.length > 0 && <h2 className="Home-titulos">Minha Lista</h2>}
        <div className="Home-minhas-series">
          {minhas_series.map(dados => {
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
                  {dados.ultimo_ep_visto.length === 0 ? '' : <p style={{ color: '#b6283f' }}>Prox: {dados.ultimo_ep_visto}</p>}

                </div>

              </>
            )
          })}
        </div>
      </div>
    </>
  )
}